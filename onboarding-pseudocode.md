# Onboarding function — pseudocode logic

This covers the full onboarding pipeline: account creation, profile data
collection, validation, the calorie/macro/water calculation engine, and the
handoff to the main Profile function. It's logic only — translate into
React Native / JS however fits your component structure.

---

## 1. Data structures

```
STRUCT UserProfile:
    userId              STRING (generated on save)
    email                STRING
    username             STRING
    passwordHash         STRING        // never store plaintext
    authProvider         ENUM { "email", "google" }

    heightCm             INTEGER       // 100–300
    weightLbs            REAL          // 10–1000
    age                  INTEGER       // 1–100
    sex                  ENUM { "male", "female" }

    activityLevel        ENUM { "sedentary", "light", "moderate", "heavy" }
    goal                 ENUM { "loss", "maintenance", "gain" }

    bmr                  REAL          // calculated
    tdee                 REAL          // calculated
    calorieTarget        REAL          // calculated
    macros               STRUCT { proteinG, carbsG, fatG }
    waterTargetMl         REAL          // calculated

    createdAt            TIMESTAMP
```

---

## 2. Lookup tables (constants)

```
CONST PAL_VALUES = {
    "sedentary": 1.1,
    "light":     1.3,
    "moderate":  1.5,
    "heavy":     1.7      // "1.7+" — treat 1.7 as the floor; see note below
}

CONST GOAL_CALORIE_ADJUSTMENT = {
    "loss":         -500,   // kcal/day deficit
    "maintenance":   0,
    "gain":         +400    // kcal/day surplus
}

CONST PROTEIN_G_PER_KG = {
    "loss":         2.0,    // higher protein protects lean mass in a deficit
    "maintenance":  1.6,
    "gain":         1.8
}

CONST FAT_PERCENT_OF_CALORIES = 0.25   // applied after protein is set
```

> Note on "heavy → 1.7+": a single multiplier can't represent an open-ended
> range. Either (a) treat 1.7 as a flat value like the others, or (b) turn
> "heavy" into a sub-question ("very active" = 1.7, "athlete" = 1.9) if you
> want finer granularity later. Pseudocode below uses (a) for simplicity.

---

## 3. Input validation functions

Each validator returns either `VALID` or an `INVALID` result carrying a
field name and message — never just `true/false` — so the UI knows exactly
what to flag.

```
FUNCTION validateHeight(value):
    IF typeOf(value) != INTEGER:
        RETURN INVALID("height", "Height must be a whole number (cm)")
    IF value < 100 OR value > 300:
        RETURN INVALID("height", "Height must be between 100–300 cm")
    RETURN VALID

FUNCTION validateAge(value):
    IF typeOf(value) != INTEGER:
        RETURN INVALID("age", "Age must be a whole number")
    IF value < 1 OR value > 100:
        RETURN INVALID("age", "Age must be between 1–100")
    RETURN VALID

FUNCTION validateWeight(value):
    IF typeOf(value) != REAL AND typeOf(value) != INTEGER:
        RETURN INVALID("weight", "Weight must be a number")
    IF value < 10 OR value > 1000:
        RETURN INVALID("weight", "Weight must be between 10–1000 lbs")
    RETURN VALID

FUNCTION validateSex(value):
    IF value NOT IN ["male", "female"]:
        RETURN INVALID("sex", "Please select a value from the dropdown")
    RETURN VALID

FUNCTION validateActivityLevel(value):
    IF value NOT IN KEYS(PAL_VALUES):
        RETURN INVALID("activityLevel", "Please select a value from the dropdown")
    RETURN VALID

FUNCTION validateGoal(value):
    IF value NOT IN ["loss", "maintenance", "gain"]:
        RETURN INVALID("goal", "Please select a value from the dropdown")
    RETURN VALID

FUNCTION validateUsername(value, existingUsernames):
    IF value IN existingUsernames:
        RETURN INVALID("username", "That name is taken",
                        suggestedActions = ["Choose another name", "Sign in with Google"])
    RETURN VALID

FUNCTION validatePassword(value):
    IF length(value) < 8 OR length(value) > 30:
        RETURN INVALID("password", "Password must be 8–30 characters")
    IF NOT containsLetter(value):
        RETURN INVALID("password", "Password must contain a letter")
    IF NOT containsUppercase(value):
        RETURN INVALID("password", "Password must contain an uppercase letter")
    IF NOT containsNumber(value):
        RETURN INVALID("password", "Password must contain a number")
    IF NOT containsSymbol(value):
        RETURN INVALID("password", "Password must contain a symbol")
    RETURN VALID
```

A single field can fail multiple rules at once — collect *all* failures for
a field rather than stopping at the first, so the user sees the complete
list of what's wrong in one pass instead of fixing issues one at a time.

---

## 4. Calculation engine

### 4.1 BMR — Mifflin-St Jeor

This formula needs metric units, so weight is converted from lbs first.

```
FUNCTION calculateBMR(weightLbs, heightCm, age, sex):
    weightKg = weightLbs * 0.453592

    IF sex == "male":
        bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
    ELSE:
        bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161

    RETURN bmr
```

### 4.2 TDEE — total daily energy expenditure

```
FUNCTION calculateTDEE(bmr, activityLevel):
    pal = PAL_VALUES[activityLevel]
    RETURN bmr * pal
```

### 4.3 Calorie target — apply goal

```
FUNCTION calculateCalorieTarget(tdee, goal):
    adjustment = GOAL_CALORIE_ADJUSTMENT[goal]
    target = tdee + adjustment

    // safety floor — never recommend below a minimum survivable intake
    minimumCalories = (sex == "male") ? 1500 : 1200
    IF target < minimumCalories:
        target = minimumCalories

    RETURN target
```

### 4.4 Macros

```
FUNCTION calculateMacros(calorieTarget, goal, weightLbs):
    weightKg = weightLbs * 0.453592

    proteinG = weightKg * PROTEIN_G_PER_KG[goal]
    proteinCalories = proteinG * 4

    fatCalories = calorieTarget * FAT_PERCENT_OF_CALORIES
    fatG = fatCalories / 9

    remainingCalories = calorieTarget - proteinCalories - fatCalories
    carbsG = remainingCalories / 4

    RETURN { proteinG, carbsG, fatG }
```

### 4.5 Water intake

```
FUNCTION calculateWaterIntake(weightLbs, activityLevel):
    baseMl = weightLbs * 16.6   // ≈ half body weight (lbs) in oz, converted to ml

    activityBonusMl = {
        "sedentary": 0,
        "light":     250,
        "moderate":  500,
        "heavy":     750
    }[activityLevel]

    RETURN baseMl + activityBonusMl
```

> These macro/water formulas are reasonable starting defaults, not medical
> guidance — flag them as adjustable constants so you can tune ratios later
> without touching the calling code.

---

## 5. Main onboarding orchestration function

This is the function the UI calls on each "Next" / "Submit" action. It
short-circuits on the first invalid step in a stage, but within a stage it
collects every field error before returning.

```
FUNCTION onboardUser(formData, existingUsernames):

    // ---- STAGE 1: account ----
    errors = []
    errors.append(validateUsername(formData.username, existingUsernames))
    errors.append(validatePassword(formData.password))
    errors = filter(errors, e => e != VALID)

    IF errors is not empty:
        RETURN { status: "error", stage: "account", errors }

    account = createAccount(formData.email, formData.username, hash(formData.password))

    // ---- STAGE 2: profile demographics ----
    errors = []
    errors.append(validateHeight(formData.heightCm))
    errors.append(validateAge(formData.age))
    errors.append(validateWeight(formData.weightLbs))
    errors.append(validateSex(formData.sex))
    errors = filter(errors, e => e != VALID)

    IF errors is not empty:
        RETURN { status: "error", stage: "demographics", errors }

    // ---- STAGE 3: preferences ----
    errors = []
    errors.append(validateActivityLevel(formData.activityLevel))
    errors.append(validateGoal(formData.goal))
    errors = filter(errors, e => e != VALID)

    IF errors is not empty:
        RETURN { status: "error", stage: "preferences", errors }

    // ---- STAGE 4: calculation engine ----
    bmr   = calculateBMR(formData.weightLbs, formData.heightCm, formData.age, formData.sex)
    tdee  = calculateTDEE(bmr, formData.activityLevel)
    target = calculateCalorieTarget(tdee, formData.goal)
    macros = calculateMacros(target, formData.goal, formData.weightLbs)
    water  = calculateWaterIntake(formData.weightLbs, formData.activityLevel)

    // ---- STAGE 5: persist & hand off ----
    profile = buildUserProfile(account, formData, bmr, tdee, target, macros, water)
    saveProfileToDatabase(profile)

    RETURN { status: "success", profile, redirectTo: "Dashboard" }
```

The caller (your onboarding screen component) reads `status`:
- `"error"` → show the relevant stage's errors inline, keep user on that step
- `"success"` → navigate to the main Profile / Dashboard function, passing `profile`

---

## 6. Edge case reference table

| Field        | Type check          | Range check           | Extra rule |
|--------------|---------------------|------------------------|------------|
| Height       | must be integer     | 100–300 cm             | — |
| Age          | must be integer      | 1–100                  | — |
| Weight       | must be real number  | 10–1000 lbs            | — |
| Sex          | dropdown only        | —                       | restricted enum |
| Activity     | dropdown only        | —                       | restricted enum, maps to PAL |
| Goal         | dropdown only        | —                       | restricted enum |
| Username     | string               | —                       | must be unique; offer "pick new" or "sign in with Google" |
| Password     | string               | 8–30 characters         | must contain letter, number, symbol, uppercase |

A couple of corrections worth flagging from your original draft:
- Your weight edge case said "if weight `< 0` and `> 1000`" — that's
  logically impossible as an AND (no number is both negative and over
  1000). It should be `< 10 OR > 1000` to match the stated 10–1000 lbs
  range, which is how the pseudocode above implements it.
- Same logical issue applies to the height and age edge cases as written
  ("< 100 and > 300") — they should be `OR`, not `AND`, since you want
  *either* condition to trigger invalid. The pseudocode uses `OR`
  throughout.
