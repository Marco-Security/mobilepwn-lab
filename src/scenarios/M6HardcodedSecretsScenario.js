import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import BankAppShell from '../components/BankAppShell';


// VULNERABILIDAD INTENCIONAL: API key hardcodeada en el bundle JS.
// El desarrollador la dejó en producción "temporalmente" durante el desarrollo.
// Cualquier atacante que extraiga el bundle puede encontrarla con strings + grep.
const ANALYTICS_CONFIG = {
  service: 'AnclaAnalytics',
  endpoint: 'https://analytics.anclabank.io/v2/track',
  apiKey: 'ANCLA-PROD-sk-live-x9f2mK8nQpL3rT7w',
  environment: 'production',
};

const dataBeforeSync = [
  { label: 'Sesiones', value: 847, max: 2000 },
  { label: 'Transferencias', value: 234, max: 600 },
  { label: 'Conversión', value: 68, max: 100, suffix: '%' },
];

const dataAfterSync = [
  { label: 'Sesiones', value: 1891, max: 2000 },
  { label: 'Transferencias', value: 518, max: 600 },
  { label: 'Conversión', value: 82, max: 100, suffix: '%' },
];

export default function M6HardcodedSecretsScenario() {
  const [synced, setSynced] = useState(false);
  const currentData = synced ? dataAfterSync : dataBeforeSync;
  const animatedWidths = useRef(dataBeforeSync.map((item) => new Animated.Value(item.value / item.max))).current;

  useEffect(() => {
    Animated.parallel(
      dataBeforeSync.map((item, i) =>
        Animated.timing(animatedWidths[i], {
          toValue: item.value / item.max,
          duration: 800,
          useNativeDriver: false,
        })
      )
    ).start();
  }, []);

  async function handleSync() {
    Animated.parallel(
      dataAfterSync.map((item, i) =>
        Animated.timing(animatedWidths[i], {
          toValue: item.value / item.max,
          duration: 800,
          useNativeDriver: false,
        })
      )
    ).start();
    setSynced(true);
  }

  return (
    <BankAppShell subtitle="Analytics">
      <Text style={styles.description}>
        Sincroniza los eventos de sesión con el servicio de analytics de AnclaBank.
      </Text>
      {currentData.map((item, index) => (
        <View key={item.label} style={styles.metricRow}>
          <Text style={styles.metricLabel}>{item.label}</Text>
          <View style={styles.barContainer}>
            <Text style={styles.metricValue}>{item.value}{item.suffix || ''}</Text>
            <View style={styles.barTrack}>
              <Animated.View style={[styles.barFill,{width: animatedWidths[index].interpolate({inputRange: [0, 1],outputRange: ['0%', '100%'],})}]}/>
            </View>
          </View>
        </View>
      ))}
      {synced ? (
        <View style={styles.alertBox}>
          <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
          <Text style={styles.alertText}>
            Sincronizado con AnclaAnalytics. Servicio: production.
          </Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSync}>
          <Text style={styles.buttonText}>Sincronizar analytics</Text>
        </TouchableOpacity>
      )}
    </BankAppShell>
  );
}

const styles = StyleSheet.create({
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  metricRow: {
    gap: 4,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricValue: {
    color: colors.textPrimary,
    fontFamily: 'monospace',
    fontSize: 13,
    width: 50, // ancho fijo para que las barras queden alineadas
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  alertBox: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    backgroundColor: colors.card,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'flex-start',
  },
  alertText: {
    flex: 1,
    color: colors.primary,
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: 14,
  },
});