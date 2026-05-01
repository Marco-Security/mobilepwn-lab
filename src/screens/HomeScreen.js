import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { challenges } from '../data/challenges';

function ChallengeCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconContainer, { borderColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={[styles.difficulty, { color: item.color }]}>
            {item.difficulty}
          </Text>
          <Text style={styles.points}>{item.points} pts</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {'> '} {challenges.length} módulos disponibles
        </Text>
        <Text style={styles.headerPoints}>{totalPoints} pts totales</Text>
      </View>

      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ChallengeCard
            item={item}
            onPress={() =>
              navigation.navigate('Challenge', {
                id: item.id,
                title: item.title,
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  headerPoints: {
    color: colors.primary,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardCategory: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  difficulty: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  points: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: 'monospace',
  },
});