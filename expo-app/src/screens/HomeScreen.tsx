import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const { width } = Dimensions.get('window');

const CALORIE_CIRCUMFERENCE = 2 * Math.PI * 68; // 427.26
const CALORIE_PROGRESS = 0.71; // 1420 / 2000
const CALORIE_OFFSET = CALORIE_CIRCUMFERENCE * (1 - CALORIE_PROGRESS); // 123.9

const avatarColors = ['#60a5fa', '#a78bfa', '#fb923c', '#f472b6'];
const avatarInitials = ['JD', 'SM', 'AL', 'KR'];

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* ── Navbar ─────────────────────────────────────────── */}
      <View style={[styles.navbar, { paddingTop: insets.top }]}>
        <View style={styles.navInner}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14l-4-4 1.4-1.4 2.6 2.6 6.6-6.6L19 8l-8 8z"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.logoText}>NutriTrack</Text>
          </View>

          <View style={styles.navActions}>
            <TouchableOpacity onPress={() => navigation.navigate('Onboarding')}>
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.getStartedBtn}
              onPress={() => navigation.navigate('Onboarding')}
            >
              <Text style={styles.getStartedBtnText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero ──────────────────────────────────────────── */}
        <LinearGradient
          colors={['#f0fdf4', '#dcfce7', '#f0fdf4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Badge */}
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>SCIENCE-BACKED NUTRITION PLANNING</Text>
          </View>

          {/* Headline */}
          <Text style={styles.headline}>
            Track Calories,{'\n'}
            <Text style={styles.headlineGreen}>Hit Your{'\n'}</Text>
            Health Goals
          </Text>

          {/* Subtext */}
          <Text style={styles.heroSubtext}>
            Get personalized calorie and macro targets calculated from your body stats.
            Log meals, track hydration, and build lasting habits — all in one place.
          </Text>

          {/* CTA buttons */}
          <View style={styles.heroBtns}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('Onboarding')}
            >
              <Text style={styles.primaryBtnText}>Start for Free →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Text style={styles.secondaryBtnText}>View Demo</Text>
            </TouchableOpacity>
          </View>

          {/* Social proof */}
          <View style={styles.socialProof}>
            <View style={styles.avatarStack}>
              {avatarInitials.map((initials, i) => (
                <View
                  key={initials}
                  style={[
                    styles.avatar,
                    { backgroundColor: avatarColors[i], marginLeft: i > 0 ? -10 : 0 },
                  ]}
                >
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              ))}
              <View style={[styles.avatar, styles.avatarMore]}>
                <Text style={styles.avatarMoreText}>+</Text>
              </View>
            </View>
            <View>
              <Text style={styles.stars}>★★★★★</Text>
              <Text style={styles.socialText}>
                Loved by <Text style={styles.socialBold}>10,000+</Text> users
              </Text>
            </View>
          </View>

          {/* App preview card */}
          <View style={styles.previewCard}>
            {/* Streak badge */}
            <View style={styles.streakBadge}>
              <Text style={styles.streakBadgeText}>🔥 7-day streak</Text>
            </View>

            {/* Card header */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardHeaderLabel}>Today's Progress</Text>
                <Text style={styles.cardHeaderDate}>Sunday, June 22</Text>
              </View>
              <View style={styles.fireIcon}>
                <Text style={{ fontSize: 18 }}>🔥</Text>
              </View>
            </View>

            {/* Calorie ring */}
            <View style={styles.ringContainer}>
              <Svg width={160} height={160} viewBox="0 0 160 160">
                <Circle
                  cx="80"
                  cy="80"
                  r="68"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="12"
                />
                <Circle
                  cx="80"
                  cy="80"
                  r="68"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="12"
                  strokeDasharray={`${CALORIE_CIRCUMFERENCE}`}
                  strokeDashoffset={`${CALORIE_OFFSET}`}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="80, 80"
                />
              </Svg>
              <View style={styles.ringCenter}>
                <Text style={styles.ringCalories}>1,420</Text>
                <Text style={styles.ringGoal}>of 2,000 kcal</Text>
                <Text style={styles.ringLeft}>580 left</Text>
              </View>
            </View>

            {/* Macro chips */}
            <View style={styles.macroRow}>
              <View style={[styles.macroChip, { backgroundColor: '#eff6ff' }]}>
                <Text style={[styles.macroLabel, { color: '#2563eb' }]}>Protein</Text>
                <Text style={styles.macroValue}>
                  98<Text style={styles.macroUnit}>g</Text>
                </Text>
              </View>
              <View style={[styles.macroChip, { backgroundColor: '#faf5ff' }]}>
                <Text style={[styles.macroLabel, { color: '#9333ea' }]}>Carbs</Text>
                <Text style={styles.macroValue}>
                  145<Text style={styles.macroUnit}>g</Text>
                </Text>
              </View>
              <View style={[styles.macroChip, { backgroundColor: '#fdf2f8' }]}>
                <Text style={[styles.macroLabel, { color: '#db2777' }]}>Fat</Text>
                <Text style={styles.macroValue}>
                  42<Text style={styles.macroUnit}>g</Text>
                </Text>
              </View>
            </View>

            {/* Water bar */}
            <View style={styles.waterSection}>
              <View style={styles.waterLabelRow}>
                <Text style={styles.waterLabel}>💧 Water</Text>
                <Text style={styles.waterLabel}>1.5L / 2.9L</Text>
              </View>
              <View style={styles.waterBarBg}>
                <View style={[styles.waterBarFill, { width: '52%' }]} />
              </View>
            </View>

            {/* Goal badge */}
            <View style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>✓ Goal: Maintenance</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Stats Bar ─────────────────────────────────────── */}
        <View style={styles.statsBar}>
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '2.4M', label: 'Meals Logged' },
            { value: '95%', label: 'Goal Achievement Rate' },
            { value: '4.9 ★', label: 'Average Rating' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Features ──────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Everything you need to reach your goals</Text>
          <Text style={styles.sectionSubtitle}>
            Science-backed calculations meet intuitive design. Built for real life, not just gym rats.
          </Text>

          {[
            {
              bg: '#f0fdf4',
              border: '#bbf7d0',
              iconBg: '#16a34a',
              title: 'Smart Calorie Targets',
              desc: 'Personalized calorie goals using the Mifflin-St Jeor formula — factoring your BMR, activity level, and whether you want to lose, maintain, or gain.',
            },
            {
              bg: '#eff6ff',
              border: '#bfdbfe',
              iconBg: '#2563eb',
              title: 'Macro Breakdown',
              desc: 'Track protein, carbs, and fat with per-meal precision. See how each meal fits your daily targets and adjust on the fly.',
            },
            {
              bg: '#ecfeff',
              border: '#a5f3fc',
              iconBg: '#0891b2',
              title: 'Hydration Tracking',
              desc: 'Daily water targets calculated from your weight and activity level. Stay hydrated, stay sharp — your goal updates as your profile does.',
            },
          ].map((feature) => (
            <View
              key={feature.title}
              style={[styles.featureCard, { backgroundColor: feature.bg, borderColor: feature.border }]}
            >
              <View style={[styles.featureIcon, { backgroundColor: feature.iconBg }]}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>

        {/* ── How It Works ──────────────────────────────────── */}
        <View style={[styles.section, { backgroundColor: '#f9fafb' }]}>
          <Text style={styles.sectionTitle}>Get started in under 3 minutes</Text>
          <Text style={styles.sectionSubtitle}>Simple setup. Powerful, lasting results.</Text>

          {[
            {
              step: '1',
              title: 'Create Your Profile',
              desc: 'Enter your height, weight, age, and sex. We calculate your BMR and total daily energy expenditure (TDEE) instantly.',
            },
            {
              step: '2',
              title: 'Set Your Goal',
              desc: "Tell us your activity level and whether you want to lose weight, maintain, or build muscle. We'll set your exact calorie and macro targets.",
            },
            {
              step: '3',
              title: 'Track Daily',
              desc: 'Log meals, monitor macros, and hit your water target. Watch your streak grow and your progress compound over time.',
            },
          ].map((item, i) => (
            <View key={item.step} style={styles.stepRow}>
              {i < 2 && <View style={styles.stepConnector} />}
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{item.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{item.title}</Text>
                <Text style={styles.stepDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── CTA Banner ────────────────────────────────────── */}
        <View style={styles.ctaBanner}>
          <Text style={styles.ctaTitle}>Ready to transform your nutrition?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of people who've hit their health goals with NutriTrack.{'\n'}
            Free to start. No credit card required.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('Onboarding')}
          >
            <Text style={styles.ctaBtnText}>Get Started Free →</Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ────────────────────────────────────────── */}
        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <View style={styles.footerLogoIcon}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14l-4-4 1.4-1.4 2.6 2.6 6.6-6.6L19 8l-8 8z"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.footerLogoText}>NutriTrack</Text>
          </View>
          <Text style={styles.footerTagline}>
            Your science-backed companion for calories, macros, and hydration.
          </Text>

          <View style={styles.footerLinks}>
            {['Features', 'How it works', 'Pricing', 'Dashboard', 'About', 'Privacy', 'Terms'].map(
              (link) => (
                <TouchableOpacity key={link} style={styles.footerLinkItem}>
                  <Text style={styles.footerLinkText}>{link}</Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <View style={styles.footerDivider} />
          <Text style={styles.footerCopy}>© 2026 NutriTrack. All rights reserved.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Navbar
  navbar: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  navInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#16a34a',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 17, fontWeight: '700', color: '#111827', letterSpacing: -0.3 },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  signInText: { fontSize: 14, color: '#4b5563', fontWeight: '500' },
  getStartedBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  getStartedBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  // Hero
  hero: { paddingHorizontal: 20, paddingTop: 36, paddingBottom: 40 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
    marginBottom: 20,
  },
  badgeDot: { width: 6, height: 6, backgroundColor: '#22c55e', borderRadius: 999 },
  badgeText: { color: '#15803d', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  headline: { fontSize: 40, fontWeight: '800', color: '#111827', lineHeight: 46, marginBottom: 16 },
  headlineGreen: { color: '#16a34a' },
  heroSubtext: { fontSize: 16, color: '#6b7280', lineHeight: 24, marginBottom: 24 },
  heroBtns: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  primaryBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryBtnText: { color: '#374151', fontWeight: '600', fontSize: 15 },

  // Social proof
  socialProof: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32 },
  avatarStack: { flexDirection: 'row' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  avatarMore: { backgroundColor: '#e5e7eb', marginLeft: -10 },
  avatarMoreText: { color: '#6b7280', fontSize: 11, fontWeight: '700' },
  stars: { color: '#fbbf24', fontSize: 14, marginBottom: 2 },
  socialText: { fontSize: 13, color: '#6b7280' },
  socialBold: { fontWeight: '700', color: '#1f2937' },

  // Preview card
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
    marginTop: 8,
  },
  streakBadge: {
    position: 'absolute',
    top: -14,
    right: 12,
    backgroundColor: '#f97316',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    zIndex: 1,
  },
  streakBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardHeaderLabel: { fontSize: 12, color: '#9ca3af', fontWeight: '500' },
  cardHeaderDate: { fontSize: 13, fontWeight: '600', color: '#1f2937' },
  fireIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#fff7ed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCalories: { fontSize: 24, fontWeight: '700', color: '#111827' },
  ringGoal: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  ringLeft: { fontSize: 11, color: '#16a34a', fontWeight: '500', marginTop: 2 },
  macroRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  macroChip: { flex: 1, borderRadius: 12, padding: 10, alignItems: 'center' },
  macroLabel: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  macroValue: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  macroUnit: { fontSize: 11, fontWeight: '400', color: '#9ca3af' },
  waterSection: {},
  waterLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  waterLabel: { fontSize: 12, color: '#6b7280' },
  waterBarBg: { height: 10, backgroundColor: '#f3f4f6', borderRadius: 999, overflow: 'hidden' },
  waterBarFill: { height: 10, backgroundColor: '#22d3ee', borderRadius: 999 },
  goalBadge: {
    alignSelf: 'flex-start',
    marginTop: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  goalBadgeText: { fontSize: 12, fontWeight: '600', color: '#374151' },

  // Stats bar
  statsBar: {
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 20,
  },
  statItem: { width: (width - 60) / 2, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  statLabel: { fontSize: 13, color: '#bbf7d0', marginTop: 4 },

  // Section
  section: { paddingHorizontal: 20, paddingVertical: 48, backgroundColor: '#fff' },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },

  // Feature cards
  featureCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: { fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 8 },
  featureDesc: { fontSize: 14, color: '#6b7280', lineHeight: 21 },

  // Steps
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 28, position: 'relative' },
  stepConnector: {
    position: 'absolute',
    left: 24,
    top: 56,
    width: 2,
    height: 36,
    backgroundColor: '#bbf7d0',
  },
  stepNumber: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#bbf7d0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    flexShrink: 0,
  },
  stepNumberText: { fontSize: 20, fontWeight: '800', color: '#16a34a' },
  stepContent: { flex: 1, paddingTop: 4 },
  stepTitle: { fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 6 },
  stepDesc: { fontSize: 14, color: '#6b7280', lineHeight: 21 },

  // CTA
  ctaBanner: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 52,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 34,
  },
  ctaSubtitle: { fontSize: 15, color: '#bbf7d0', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  ctaBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaBtnText: { color: '#15803d', fontWeight: '700', fontSize: 16 },

  // Footer
  footer: { backgroundColor: '#111827', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 32 },
  footerLogo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  footerLogoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLogoText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  footerTagline: { color: '#9ca3af', fontSize: 13, lineHeight: 20, marginBottom: 24, maxWidth: 280 },
  footerLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  footerLinkItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
  },
  footerLinkText: { color: '#9ca3af', fontSize: 12 },
  footerDivider: { height: 1, backgroundColor: '#1f2937', marginBottom: 16 },
  footerCopy: { color: '#6b7280', fontSize: 12 },
});
