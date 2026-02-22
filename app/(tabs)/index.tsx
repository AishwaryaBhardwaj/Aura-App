import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, Settings, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '../../src/theme';

const { width } = Dimensions.get('window');

// 1. Mock Database of 10 Profiles
const MOCK_PROFILES = [
  { id: '1', persona: 'The Architect', intent: 'Serious', vibeTags: ['#DeepTalks', '#SlowCoffee', '#Museums'], unlocked: false },
  { id: '2', persona: 'The Wanderer', intent: 'Casual Magic', vibeTags: ['#VinylRecords', '#SpontaneousRoadtrips', '#Thrifting'], unlocked: false },
  { id: '3', persona: 'The Romantic', intent: 'Marriage-Minded', vibeTags: ['#SundayBaking', '#Poetry', '#Picnics'], unlocked: false },
  { id: '4', persona: 'The Firebrand', intent: 'Friendship', vibeTags: ['#Activism', '#LiveMusic', '#Debates'], unlocked: false },
  { id: '5', persona: 'The Mystic', intent: 'Casual Magic', vibeTags: ['#Astrology', '#Incense', '#Tarot'], unlocked: false },
  { id: '6', persona: 'The Guardian', intent: 'Marriage-Minded', vibeTags: ['#HomeCooking', '#Dogs', '#QuietEvenings'], unlocked: false },
  { id: '7', persona: 'The Alchemist', intent: 'Serious', vibeTags: ['#Mixology', '#Jazz', '#LateNights'], unlocked: false },
  { id: '8', persona: 'The Muse', intent: 'Undecided', vibeTags: ['#ArtGalleries', '#Painting', '#IndieFilms'], unlocked: false },
  { id: '9', persona: 'The Sage', intent: 'Serious', vibeTags: ['#Philosophy', '#NatureWalks', '#Meditation'], unlocked: false },
  { id: '10', persona: 'The Catalyst', intent: 'Friendship', vibeTags: ['#Networking', '#Startups', '#CoffeeShops'], unlocked: false },
];

export default function DailyTrioScreen() {
  const [trio, setTrio] = useState<any[]>([]);

  useEffect(() => {
    // 4. Data Persistence (Reading Settings)
    const userAuraProfile = Settings.get('userAuraProfile') || {};

    // 1. The Matching Algorithm
    const calculateAuraMatch = (userProfile: any, profile: any) => {
      let base = 65;

      // Intent match (heavy priority)
      if (userProfile.intent === profile.intent) base += 15;
      else if (['Undecided', 'Casual Magic'].includes(profile.intent)) base += 5;

      // Persona match
      if (userProfile.persona === profile.persona) base += 10;
      else base += 5; // Complementary bonus

      // Vibe Tags match (granular overlapping)
      const matchingTags = profile.vibeTags.filter((t: string) => userProfile.vibeTags?.includes(t));
      base += matchingTags.length * 6;

      // Deterministic randomness based on ID length so scores aren't identical
      const uniqueBonus = (profile.persona.length * 3) % 10;

      return Math.min(99, base + uniqueBonus);
    };

    const scoredProfiles = MOCK_PROFILES.map(p => ({
      ...p,
      matchPercent: calculateAuraMatch(userAuraProfile, p)
    }));

    // Sort descending by match percentage to find the Daily Trio
    scoredProfiles.sort((a, b) => b.matchPercent - a.matchPercent);
    setTrio(scoredProfiles.slice(0, 3));
  }, []);

  const handleUnlock = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTrio(prev => prev.map(m => m.id === id ? { ...m, unlocked: true } : m));
  };

  if (!trio.length) return null;

  return (
    <LinearGradient
      colors={[theme.colors.backgroundTop, theme.colors.backgroundBottom]}
      style={styles.container}
    >
      <Animated.View entering={ZoomIn.duration(1200).springify().damping(15)} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>The Daily Trio</Text>
          <Text style={styles.headerSub}>Three souls aligned with your aura.</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {trio.map((match, index) => (
            <MatchCard
              key={match.id}
              match={match}
              delay={index * 200}
              onUnlock={() => handleUnlock(match.id)}
            />
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}

// ------------------------------------------------------------------
// MATCH CARD COMPONENT
// ------------------------------------------------------------------
function MatchCard({ match, delay, onUnlock }: { match: any, delay: number, onUnlock: () => void }) {
  const pulseScore = useSharedValue(1);

  React.useEffect(() => {
    pulseScore.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScore.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(800)} style={styles.cardContainer}>
      {/* Phase 10 The Image Area / Shimmer Reveal */}
      <View style={styles.imageBox}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${match.id}/400/500` }}
          style={StyleSheet.absoluteFillObject}
        />
        {!match.unlocked ? (
          <BlurView intensity={80} tint="dark" style={styles.mysteriousBlur}>
            <LinearGradient
              colors={['rgba(230, 92, 123, 0.4)', 'transparent']}
              style={StyleSheet.absoluteFillObject}
            />
            <FontAwesome name="lock" size={32} color={theme.colors.accentGold} style={{ marginBottom: 10 }} />
            <Text style={styles.lockedText}>Connect to Reveal</Text>
          </BlurView>
        ) : null}

        <Animated.View style={[styles.matchBadge, pulseStyle]}>
          <Text style={styles.matchBadgeText}>{match.matchPercent}%</Text>
          <Text style={styles.matchBadgeLabel}>SOUl MATCH</Text>
        </Animated.View>
      </View>

      {/* The Soul Details */}
      <View style={styles.cardInfo}>
        <Text style={styles.personaTitle}>Aura Fragment: {match.persona}</Text>

        <View style={styles.tagsContainer}>
          {match.vibeTags.map((tag: string) => (
            <View key={tag} style={styles.vibeTag}>
              <Text style={styles.vibeTagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {!match.unlocked ? (
          <TouchableOpacity style={styles.connectButton} onPress={onUnlock}>
            <Text style={styles.connectButtonText}>Send a Spark</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.messageButton}>
            <FontAwesome name="envelope" size={16} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.connectButtonText}>Message</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.script,
    fontSize: 42,
    color: theme.colors.text,
  },
  headerSub: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontSize: 16,
    marginTop: 5,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  cardContainer: { // Phase 10 Soft Pastel Overhaul
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.cloud,
  },
  imageBox: {
    width: '100%',
    height: 280,
    backgroundColor: theme.colors.accent, // Soft pink base behind images
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  mysteriousBlur: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    ...theme.typography.body,
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  unlockedImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: theme.colors.primary, // Soft Magenta
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.round,
    flexDirection: 'column',
    alignItems: 'center',
    ...theme.shadows.bubble,
  },
  matchBadgeText: {
    ...theme.typography.header,
    color: '#FFFFFF',
    fontSize: 22,
  },
  matchBadgeLabel: {
    ...theme.typography.caption,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 2,
  },
  cardInfo: {
    padding: 24,
  },
  personaTitle: {
    ...theme.typography.header,
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 25,
  },
  vibeTag: {
    backgroundColor: theme.colors.backgroundTop,
    paddingVertical: 13, // Increased padding
    paddingHorizontal: 19, // Increased padding
    borderRadius: 20, // Increased radius for height
    borderWidth: 1,
    borderColor: 'rgba(255, 127, 125, 0.2)',
  },
  vibeTagText: {
    ...theme.typography.caption,
    color: theme.colors.text, // Deep Charcoal text so it isn't hidden by pink
    fontWeight: 'bold',
  },
  connectButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    ...theme.shadows.cloud,
  },
  messageButton: {
    backgroundColor: theme.colors.accentGold,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.cloud,
  },
  connectButtonText: {
    ...theme.typography.title,
    color: '#FFF',
  }
});
