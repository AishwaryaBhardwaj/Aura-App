import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../src/theme';

export default function DailyTrioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Daily Trio</Text>

      <View style={styles.cardContainer}>
        {/* Placeholder for 3 cards */}
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.card}>
            <View style={styles.imagePlaceholder} />
            <Text style={styles.cardName}>Match {item}</Text>
            <Text style={styles.cardBio}>Curated AI suggestion based on your personality.</Text>
            <TouchableOpacity style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.header,
    color: theme.colors.text,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  cardContainer: {
    flex: 1,
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  cardName: {
    ...theme.typography.title,
    color: theme.colors.primary,
  },
  cardBio: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginVertical: theme.spacing.sm,
  },
  connectButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  connectButtonText: {
    ...theme.typography.title,
    fontSize: 14,
    color: theme.colors.card,
  }
});
