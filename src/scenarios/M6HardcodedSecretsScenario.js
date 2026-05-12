import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

const events = [
  { id: '1', name: 'session_start', timestamp: '2026-05-11 09:14:02' },
  { id: '2', name: 'screen_view', timestamp: '2026-05-11 09:14:05' },
  { id: '3', name: 'transfer_initiated', timestamp: '2026-05-11 09:15:22' },
];

export default function M6HardcodedSecretsScenario() {
  const [synced, setSynced] = useState(false);

  async function handleSync() {
    setSynced(true);
  }

  return (
    <BankAppShell subtitle="Analytics">
      <Text style={styles.description}>
        Sincroniza los eventos de sesión con el servicio de analytics de AnclaBank.
      </Text>

      <Text style={styles.sectionLabel}>// eventos pendientes</Text>
      {events.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <Ionicons name="analytics" size={14} color={colors.primary} />
          <View style={styles.eventInfo}>
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventTime}>{event.timestamp}</Text>
          </View>
        </View>
      ))}

      {synced ? (
        <View style={styles.alertBox}>
          <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
          <Text style={styles.alertText}>
            3 eventos sincronizados con AnclaAnalytics. Servicio: production.
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
  sectionLabel: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 4,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventInfo: {
    flex: 1,
    gap: 2,
  },
  eventName: {
    color: colors.textPrimary,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  eventTime: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: 'monospace',
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