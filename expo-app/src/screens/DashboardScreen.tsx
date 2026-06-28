import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

export default function DashboardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.icon}>
          <Text style={{ fontSize: 40 }}>📊</Text>
        </View>
        <Text style={styles.title}>Daily Dashboard</Text>
        <Text style={styles.subtitle}>
          Convert <Text style={styles.filename}>dashboard.html</Text> to fill this screen.{'\n'}
          Show: calorie ring, macro bars, meal log, and water tracker.
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Onboarding')}
        >
          <Text style={styles.btnText}>Back to Onboarding</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  back: { paddingHorizontal: 20, paddingVertical: 16 },
  backText: { color: '#16a34a', fontWeight: '600', fontSize: 15 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  icon: {
    width: 80,
    height: 80,
    backgroundColor: '#f0fdf4',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 36 },
  filename: { fontWeight: '700', color: '#16a34a' },
  btn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
