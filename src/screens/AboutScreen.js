import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const resources = [
  {
    id: '1',
    label: 'OWASP Mobile Top 10 2024',
    url: 'https://owasp.org/www-project-mobile-top-10/',
    icon: 'shield-checkmark',
  },
  {
    id: '2',
    label: 'MASVS 2.0',
    url: 'https://mas.owasp.org/MASVS/',
    icon: 'document-text',
  },
  {
    id: '3',
    label: 'Frida Dynamic Instrumentation',
    url: 'https://frida.re/docs/home/',
    icon: 'code-slash',
  },
  {
    id: '4',
    label: 'React Native Security Guide',
    url: 'https://reactnative.dev/docs/security',
    icon: 'phone-portrait',
  },
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}> about_</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.appName}>MobilePwn Lab</Text>
        <Text style={styles.version}>v1.0.0 — OWASP Mobile Top 10 2024</Text>
        <Text style={styles.description}>
          Laboratorio interactivo de seguridad móvil. Cada módulo demuestra
          una vulnerabilidad real en un entorno completamente aislado.
          Ningún dato real ni sistema externo es comprometido durante
          los ejercicios.
        </Text>
      </View>

      <View style={styles.disclaimerBox}>
        <Ionicons name="warning" size={16} color={colors.accent} />
        <Text style={styles.disclaimerText}>
          Esta app es exclusivamente para fines educativos. Las técnicas
          demostradas deben aplicarse únicamente en entornos de laboratorio
          con autorización explícita.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>// frameworks de referencia</Text>
      <View style={styles.badgeRow}>
        {['OWASP', 'MASVS 2.0', 'MASTG', 'CVE'].map((badge) => (
          <View key={badge} style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>// recursos externos</Text>
      {resources.map((r) => (
        <TouchableOpacity
          key={r.id}
          style={styles.resourceRow}
          onPress={() => Linking.openURL(r.url)}
        >
          <Ionicons name={r.icon} size={18} color={colors.primary} />
          <Text style={styles.resourceLabel}>{r.label}</Text>
          <Ionicons name="open-outline" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      ))}

      <Text style={styles.footer}>
        Construido con React Native + Expo{'\n'}
        Ancla Lab — 2025
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.primary,
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    gap: 6,
  },
  appName: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  version: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  disclaimerBox: {
    flexDirection: 'row',
    gap: 10,
    margin: 16,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    color: colors.accent,
    fontSize: 12,
    lineHeight: 18,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 13,
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  badge: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.primary,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resourceLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
  },
  footer: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 11,
    textAlign: 'center',
    padding: 24,
    lineHeight: 18,
  },
});