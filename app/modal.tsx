import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { theme } from '../src/theme';

export default function ModalScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [newStory, setNewStory] = useState('');
  const [isEvolving, setIsEvolving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const data = await AsyncStorage.getItem('@userAuraProfile');
      if (data) {
        setUserData(JSON.parse(data));
      }
    }
    loadProfile();
  }, []);

  const evolvePersona = async () => {
    if (!newStory.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsEvolving(true);

    // Mocking the AI Evolution Logic
    setTimeout(async () => {
      const evolvedData = {
        ...userData,
        vibeTags: ['#Spontaneous', '#Growth', '#NewBeginnings']
      };

      await AsyncStorage.setItem('@userAuraProfile', JSON.stringify(evolvedData));
      setUserData(evolvedData);
      setNewStory('');
      setIsEvolving(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  if (!userData) return null;

  return (
    <LinearGradient
      colors={[theme.colors.backgroundTop, theme.colors.backgroundBottom]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%', alignItems: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerBox}>
          <Text style={styles.title}>Persona Evolution</Text>
          <Text style={styles.subtitle}>Your aura is a living algorithm.</Text>
        </View>

        <View style={styles.identityCard}>
          <FontAwesome name={userData.fragments?.[userData.fragments?.length - 1] || 'user'} size={60} color={theme.colors.accentGold} style={{ marginBottom: 20 }} />
          <Text style={styles.personaTitle}>{userData.persona || 'The Wanderer'}</Text>

          <View style={styles.tagsContainer}>
            {userData.vibeTags?.map((tag: string) => (
              <View key={tag} style={styles.vibeTag}>
                <Text style={styles.vibeTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.evolutionBox}>
          <Text style={styles.evolutionHeader}>Update your Sunday Story</Text>
          <Text style={styles.evolutionSub}>As you change, so does your matchmaking orbit.</Text>

          <TextInput
            style={styles.textInput}
            placeholder="My Sundays have changed to..."
            placeholderTextColor={theme.colors.accent}
            value={newStory}
            onChangeText={setNewStory}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.evolveButton, !newStory.trim() && { opacity: 0.5 }]}
            disabled={!newStory.trim() || isEvolving}
            onPress={evolvePersona}
          >
            <Text style={styles.evolveButtonText}>
              {isEvolving ? "Realigning Aura..." : "Evolve Persona"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    ...theme.typography.script,
    fontSize: 42,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.primary,
  },
  identityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
    ...theme.shadows.cloud,
    borderWidth: 1,
    borderColor: 'rgba(247, 231, 206, 0.5)',
  },
  personaTitle: {
    ...theme.typography.header,
    fontSize: 28,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 15,
  },
  vibeTag: {
    backgroundColor: theme.colors.backgroundTop,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 127, 125, 0.2)',
  },
  vibeTagText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  evolutionBox: {
    width: '100%',
    backgroundColor: theme.colors.card,
    padding: 24,
    borderRadius: 30,
    ...theme.shadows.cloud,
  },
  evolutionHeader: {
    ...theme.typography.title,
    fontSize: 22,
    marginBottom: 5,
  },
  evolutionSub: {
    ...theme.typography.caption,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: theme.colors.backgroundTop,
    borderRadius: 20,
    padding: 20,
    height: 120,
    ...theme.typography.body,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  evolveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    ...theme.shadows.bubble,
  },
  evolveButtonText: {
    ...theme.typography.title,
    color: '#FFF',
  }
});
