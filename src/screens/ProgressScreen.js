import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { challenges } from '../data/challenges';

export default function ProgressScreen() {
  const completed = challenges.filter((c) => c.completed).length;
  const total = challenges.length;
  const percentage = Math.round((completed / total) * 100);
  const earnedPoints = challenges
    .filter((c) => c.completed)
    .reduce((sum, c) => sum + c.points, 0);
  const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}> progreso_</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{completed}</Text>
          <Text style={styles.statLabel}>completados</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{total - completed}</Text>
          <Text style={styles.statLabel}>pendientes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {percentage}%
          </Text>
          <Text style={styles.statLabel}>progreso</Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.pointsText}>
        {earnedPoints} / {totalPoints} pts
      </Text>

      <Text style={styles.sectionTitle}>// módulos</Text>
      {challenges.map((c) => (
        <View key={c.id} style={styles.moduleRow}>
          <Ionicons
            name={c.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={18}
            color={c.completed ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.moduleTitle,
              c.completed && { color: colors.primary },
            ]}
          >
            {c.title}
          </Text>
          <Text style={styles.modulePoints}>{c.points} pts</Text>
        </View>
      ))}
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
  },
  statBox: {
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  progressBarContainer: {
    marginHorizontal: 16,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  pointsText: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 12,
    textAlign: 'right',
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 13,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  moduleTitle: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
  },
  modulePoints: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 12,
  },
});