import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function TabButton({ label, active, locked, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={locked ? null : onPress}
      disabled={locked}
    >
      {locked && (
        <Ionicons name="lock-closed" size={11} color={colors.textSecondary} />
      )}
      <Text
        style={[
          styles.tabLabel,
          active && styles.tabLabelActive,
          locked && styles.tabLabelLocked,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabLabelLocked: {
    color: colors.border,
  },
});