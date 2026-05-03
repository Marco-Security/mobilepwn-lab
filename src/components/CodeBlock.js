import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function CodeBlock({ code, label }) {
  return (
    <View style={styles.codeWrapper}>
      {label && <Text style={styles.codeLabel}>{label}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.codeText}>{code}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  codeWrapper: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  codeLabel: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 11,
    marginBottom: 8,
  },
  codeText: {
    color: colors.textCode,
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 20,
  },
});