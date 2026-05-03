import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

/**
 * BankAppShell — UI compartida tipo "mini-app bancaria"
 *
 * Envuelve el contenido específico de cada scenario con la apariencia
 * visual de AnclaBank. Cada scenario solo escribe su lógica única;
 * la cáscara visual viene gratis.
 *
 * Props:
 *   - title: nombre mostrado en el header (default: "AnclaBank")
 *   - subtitle: texto secundario opcional bajo el título
 *   - children: el contenido específico del scenario
 */
export default function BankAppShell({ title, subtitle, children }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🏦 {title || 'AnclaBank'}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 12,
    marginTop: 8,
  },
  header: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  content: {
    gap: 12,
  },
});