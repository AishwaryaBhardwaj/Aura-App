import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
    BounceIn,
    FadeIn,
    FadeInDown,
    FadeOut,
    FadeOutUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    ZoomIn
} from 'react-native-reanimated';

import AuraClouds from '../components/AuraClouds';
import { FloatingBubble } from '../components/IntentBubbles';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

// Phase 8: The Dynamic Soul Interview Bank
const INTERVIEW_QUESTIONS = [
    { text: "If your heart was a landscape, what would it look like?", id: "q1", fragmentDesc: "The Wanderer" },
    { text: "What is a truth you've learned about love?", id: "q2", fragmentDesc: "The Sage" },
    { text: "Describe the feeling of coming home.", id: "q3", fragmentDesc: "The Guardian" },
    { text: "What song feels like falling in love?", id: "q4", fragmentDesc: "The Romantic" },
    { text: "If you could pause one memory forever, which one is it?", id: "q5", fragmentDesc: "The Dreamer" },
    { text: "What is the most beautiful thing you've seen today?", id: "q6", fragmentDesc: "The Muse" },
    { text: "How do you know when you trust someone?", id: "q7", fragmentDesc: "The Architect" },
    { text: "What does 'casual magic' mean to you?", id: "q8", fragmentDesc: "The Mystic" },
    { text: "What is a conversation you wish you could have?", id: "q9", fragmentDesc: "The Firebrand" },
    { text: "What makes you lose track of time?", id: "q10", fragmentDesc: "The Alchemist" }
];

// Phase 8: Hand-drawn Fragment Icons (mapping to FontAwesome proxies for now)
const FRAGMENT_ICONS = ['heart-o', 'star-o', 'hand-paper-o', 'moon-o', 'leaf', 'fire'];

// Phase 10: Pulsing Aura Orb for Soul Capture (replacing Googly Eyes)
const PulsingAuraOrb = ({ isActive }: { isActive: boolean }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.7);

    useEffect(() => {
        if (isActive) {
            // Stronger, rhythmic pulse when listening
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.3, { duration: 600 }),
                    withTiming(1.0, { duration: 600 })
                ),
                -1,
                true
            );
            opacity.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 600 }),
                    withTiming(0.6, { duration: 600 })
                ),
                -1,
                true
            );
        } else {
            // Soft, breathing idle state
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.05, { duration: 2000 }),
                    withTiming(0.95, { duration: 2000 })
                ),
                -1,
                true
            );
            opacity.value = withTiming(0.7, { duration: 1000 });
        }
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.auraOrbContainer, animatedStyle]}>
            <LinearGradient
                colors={[theme.colors.accent, theme.colors.primary]}
                style={styles.auraOrbGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <View style={styles.auraOrbInnerGlow} />
        </Animated.View>
    );
};

const BUBBLE_INTENTS = [
    'Marriage-Minded',
    'Serious',
    'Casual Magic',
    'Friendship',
    'Undecided'
];

type JourneyStep =
    | 'QUOTE'
    | 'SOUL_INTERVIEW_1'
    | 'SOUL_INTERVIEW_2'
    | 'SOUL_INTERVIEW_3'
    | 'HOBBY_CANVAS'
    | 'SEAL_NAME'
    | 'SEAL_AGE'
    | 'SEAL_GENDER'
    | 'SEAL_INTENT'
    | 'REVEAL';

export default function OnboardingScreen() {
    const router = useRouter();

    const [step, setStep] = useState<JourneyStep>('QUOTE');
    const [userData, setUserData] = useState({
        name: '',
        age: 25,
        gender: '',
        intent: '',
        persona: '',
        vibeTags: [] as string[],
        fragments: [] as string[],
    });

    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showFragment, setShowFragment] = useState(false);

    // Phase 8: Dynamic Interview & Entrance States
    const [interviewQuestions, setInterviewQuestions] = useState<any[]>([]);
    const [showLogo, setShowLogo] = useState(true);
    const [showQuote, setShowQuote] = useState(false);
    const [showScript, setShowScript] = useState(false);

    useEffect(() => {
        // Initialize randomized questions on mount
        if (interviewQuestions.length === 0) {
            const shuffled = [...INTERVIEW_QUESTIONS].sort(() => 0.5 - Math.random());
            setInterviewQuestions(shuffled.slice(0, 3));
        }

        if (step === 'QUOTE') {
            // 0-2s: Logo, 2-5s: Quote, 5-7s: Script -> transition
            const tLogo = setTimeout(() => { setShowLogo(false); setShowQuote(true); }, 2000);
            const tScript = setTimeout(() => setShowScript(true), 5000);
            const tNext = setTimeout(() => setStep('SOUL_INTERVIEW_1'), 7500);

            return () => { clearTimeout(tLogo); clearTimeout(tScript); clearTimeout(tNext); };
        }

        // Voice Triggers for AI Interview
        if (step === 'SOUL_INTERVIEW_1' && interviewQuestions[0]) {
            Speech.speak(interviewQuestions[0].text);
        }
        if (step === 'SOUL_INTERVIEW_2' && interviewQuestions[1]) {
            Speech.speak(interviewQuestions[1].text);
        }
        if (step === 'SOUL_INTERVIEW_3' && interviewQuestions[2]) {
            Speech.speak(interviewQuestions[2].text);
        }
        if (step === 'HOBBY_CANVAS') {
            Speech.speak("Describe your favorite Sunday morning.");
        }
    }, [step, interviewQuestions.length]);

    // Mock Audio Recording & Reanimated Persona Fragment Reveal
    const handleInterviewRecording = (nextStep: JourneyStep, extractPersona: string, fragmentIcon: string) => {
        setIsRecording(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        setTimeout(() => {
            setIsRecording(false);
            setIsAnalyzing(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Speech.stop();

            setTimeout(() => {
                setIsAnalyzing(false);
                setShowFragment(true);
                setUserData(prev => ({
                    ...prev,
                    persona: extractPersona,
                    fragments: [...prev.fragments, fragmentIcon]
                }));
                Speech.speak("Fascinating...");

                // Show the fragment for 2.5 seconds before moving to the next question
                setTimeout(() => {
                    setShowFragment(false);
                    setStep(nextStep);
                }, 2500);

            }, 2000); // 2 second mock processing time
        }, 3000); // 3 second mock talk time
    };

    const handleHobbyRecording = () => {
        setIsRecording(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        setTimeout(() => {
            setIsRecording(false);
            setUserData(prev => ({
                ...prev,
                vibeTags: ['#SlowCoffee', '#SundayBaking', '#VinylRecords']
            }));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            setTimeout(() => {
                setStep('SEAL_NAME'); // Move to Identity Seal after Hobby Canvas
            }, 3000);
        }, 3000);
    };

    const completeOnboarding = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Save state definitively closing the Auth Loop securely
        try {
            await AsyncStorage.setItem('@hasCompletedOnboarding', 'true');
            await AsyncStorage.setItem('@userAuraProfile', JSON.stringify(userData));
        } catch (e) {
            console.error(e);
        }
        router.replace('/(tabs)');
    }

    return (
        <LinearGradient
            colors={[theme.colors.backgroundTop, theme.colors.backgroundBottom]}
            style={styles.container}
        >
            <AuraClouds count={6} />

            {/* PRELUDE: PHASE 9 ARTISTIC ENTRANCE */}
            {step === 'QUOTE' && (
                <View style={styles.centerBox}>
                    {showLogo && (
                        <Animated.Text entering={ZoomIn.duration(1500).springify()} exiting={FadeOut.duration(500)} style={[styles.title, { color: theme.colors.text, fontSize: 50, letterSpacing: 8 }]}>
                            AURA
                        </Animated.Text>
                    )}
                    {showQuote && (
                        <Animated.Text entering={FadeIn.duration(1500)} exiting={FadeOutUp.duration(1000)} style={[styles.quoteText, { color: theme.colors.text }]}>
                            "Love is the beauty of the soul."
                        </Animated.Text>
                    )}
                    {showScript && (
                        <Animated.Text entering={FadeInDown.duration(1000)} style={[styles.quoteAuthor, { ...theme.typography.script, fontSize: 24, position: 'absolute', bottom: 100, color: theme.colors.text }]}>
                            Your heart is safe in this sanctuary.
                        </Animated.Text>
                    )}
                </View>
            )}

            {/* AI SOUL INTERVIEWS: DYNAMIC SHUFFLE */}
            {(step === 'SOUL_INTERVIEW_1' || step === 'SOUL_INTERVIEW_2' || step === 'SOUL_INTERVIEW_3') && (
                <Animated.View entering={FadeInDown.duration(800)} style={styles.formContainer}>
                    {/* Phase 10: Glowing Aura Orb replacing Googly Eyes */}
                    <PulsingAuraOrb isActive={isRecording} />

                    <Text style={[styles.promptSub, { ...theme.typography.script, fontSize: 24, fontStyle: 'italic', textAlign: 'center', color: theme.colors.text, marginVertical: 40 }]}>
                        {step === 'SOUL_INTERVIEW_1' && interviewQuestions[0]?.text}
                        {step === 'SOUL_INTERVIEW_2' && interviewQuestions[1]?.text}
                        {step === 'SOUL_INTERVIEW_3' && interviewQuestions[2]?.text}
                    </Text>

                    <View style={styles.canvasArea}>
                        {isAnalyzing ? (
                            <View style={styles.analyzingContainer}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                                <Text style={styles.analyzingText}>Analyzing your soul...</Text>
                            </View>
                        ) : showFragment ? (
                            <Animated.View entering={BounceIn.duration(800)} style={styles.fragmentRevealBox}>
                                <Text style={styles.personaText}>
                                    {userData.persona}
                                </Text>
                            </Animated.View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.micButton, isRecording && styles.micButtonRecording]}
                                onPressIn={() => {
                                    if (step === 'SOUL_INTERVIEW_1') handleInterviewRecording('SOUL_INTERVIEW_2', interviewQuestions[0].fragmentDesc, "0");
                                    if (step === 'SOUL_INTERVIEW_2') handleInterviewRecording('SOUL_INTERVIEW_3', interviewQuestions[1].fragmentDesc, "1");
                                    if (step === 'SOUL_INTERVIEW_3') handleInterviewRecording('HOBBY_CANVAS', interviewQuestions[2].fragmentDesc, "2");
                                }}
                                activeOpacity={0.8}
                            >
                                <FontAwesome name="microphone" size={40} color={isRecording ? '#FFF' : theme.colors.primary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {!isAnalyzing && !showFragment && (
                        <Animated.View style={{ alignItems: 'center', marginTop: 10 }}>
                            {isRecording ? (
                                <Animated.View entering={ZoomIn.duration(400)}>
                                    <FontAwesome name="heart" size={28} color={theme.colors.primary} />
                                </Animated.View>
                            ) : (
                                <Text style={[styles.captionText, { color: theme.colors.text }]}>Tap to speak your truth</Text>
                            )}
                        </Animated.View>
                    )}
                </Animated.View>
            )}

            {/* HOBBY CANVAS (Phase 9: Digital Art Canvas) */}
            {
                step === 'HOBBY_CANVAS' && (
                    <Animated.View entering={FadeInDown.duration(800)} style={styles.formContainer}>
                        <Text style={[styles.promptHeader, { color: theme.colors.text }]}>The Digital Canvas</Text>

                        <View style={[styles.canvasArea, { backgroundColor: theme.colors.card, borderWidth: 2, borderColor: theme.colors.border, borderStyle: 'dashed', padding: 20, minHeight: 300, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[styles.promptSub, { ...theme.typography.script, fontSize: 32, color: theme.colors.primary, marginVertical: 20, textAlign: 'center' }]}>
                                Describe your favorite Sunday morning.
                            </Text>

                            {userData.vibeTags.length > 0 ? (
                                <View style={[styles.tagsContainer, { flex: 1, alignItems: 'center', justifyContent: 'center', alignContent: 'center' }]}>
                                    {/* Centered layout for Vibe Tags */}
                                    {userData.vibeTags.map((tag, idx) => (
                                        <Animated.View
                                            key={tag}
                                            entering={ZoomIn.delay(idx * 300).springify()}
                                            style={[
                                                styles.vibeTagCard,
                                                {
                                                    margin: 8,
                                                    backgroundColor: idx % 2 === 0 ? theme.colors.accent : theme.colors.card,
                                                    borderWidth: 1,
                                                    borderColor: theme.colors.border
                                                }
                                            ]}
                                        >
                                            <Text style={[styles.vibeTagText, { color: theme.colors.text }]}>{tag}</Text>
                                        </Animated.View>
                                    ))}
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.micButton, isRecording && styles.micButtonRecording, { borderWidth: 3, borderColor: theme.colors.text }]}
                                    onPressIn={handleHobbyRecording}
                                    activeOpacity={0.8}
                                >
                                    <FontAwesome name="microphone" size={40} color={isRecording ? '#FFF' : theme.colors.primary} />
                                </TouchableOpacity>
                            )}
                        </View>
                        {!userData.vibeTags.length && (
                            <Text style={[styles.captionText, { color: theme.colors.text }]}>{isRecording ? "Listening to your story..." : "Tap to paint your vibe"}</Text>
                        )}
                    </Animated.View>
                )
            }

            {/* IDENTITY SEAL: NAME */}
            {
                step === 'SEAL_NAME' && (
                    <Animated.View entering={FadeInDown.duration(800)} style={styles.formContainer}>
                        <Text style={styles.promptHeader}>The Identity Seal</Text>
                        <Text style={[styles.promptSub, { ...theme.typography.script, fontSize: 32 }]}>What is your given name?</Text>
                        <View style={styles.card}>
                            <TextInput
                                style={styles.nameInput}
                                placeholder="Name"
                                placeholderTextColor={theme.colors.text}
                                value={userData.name}
                                onChangeText={(t) => setUserData(prev => ({ ...prev, name: t }))}
                                cursorColor={theme.colors.primary}
                                autoFocus
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.primaryButton, !userData.name && { opacity: 0.5 }]}
                            disabled={!userData.name}
                            onPress={() => {
                                Haptics.selectionAsync();
                                setStep('SEAL_AGE');
                            }}
                        >
                            <Text style={styles.primaryButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )
            }

            {/* IDENTITY SEAL: AGE */}
            {
                step === 'SEAL_AGE' && (
                    <Animated.View entering={FadeIn.duration(500)} style={styles.formContainer}>
                        <Text style={[styles.promptHeader, { ...theme.typography.script, fontSize: 36, marginBottom: 40 }]}>
                            How many summers have you seen?
                        </Text>

                        <View style={styles.ageInputContainer}>
                            <TextInput
                                style={styles.ageTextInput}
                                placeholder="Age"
                                placeholderTextColor={theme.colors.text}
                                value={userData.age ? userData.age.toString() : ''}
                                onChangeText={(t) => {
                                    const parsed = parseInt(t.replace(/[^0-9]/g, ''), 10);
                                    setUserData(prev => ({ ...prev, age: isNaN(parsed) ? 18 : parsed }));
                                }}
                                keyboardType="numeric"
                                cursorColor={theme.colors.primary}
                                autoFocus
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.primaryButton, userData.age < 18 && { opacity: 0.5 }]}
                            disabled={userData.age < 18}
                            onPress={() => {
                                Haptics.selectionAsync();
                                setStep('SEAL_GENDER');
                            }}
                        >
                            <Text style={styles.primaryButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )
            }

            {/* IDENTITY SEAL: GENDER */}
            {
                step === 'SEAL_GENDER' && (
                    <Animated.View entering={FadeIn.duration(500)} style={styles.formContainer}>
                        <Text style={[styles.promptHeader, { ...theme.typography.script, fontSize: 36, marginBottom: 40 }]}>
                            How do you express your essence?
                        </Text>

                        <View style={styles.bubbleGrid}>
                            {['Masculine', 'Feminine', 'Non-Binary', 'Other'].map((g, idx) => (
                                <FloatingBubble
                                    key={g}
                                    label={g}
                                    delay={idx * 150}
                                    selected={userData.gender === g}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setUserData(prev => ({ ...prev, gender: g }));
                                        setTimeout(() => setStep('SEAL_INTENT'), 600);
                                    }}
                                />
                            ))}
                        </View>
                    </Animated.View>
                )
            }

            {/* INTENTIONALITY GATE */}
            {
                step === 'SEAL_INTENT' && (
                    <Animated.View entering={FadeInDown.duration(800)} style={styles.formContainer}>
                        <Text style={[styles.promptHeader, { marginBottom: 40 }]}>Your Intentions...</Text>
                        <Text style={styles.promptSub}>Choose the path you seek.</Text>

                        <View style={styles.bubbleGrid}>
                            {BUBBLE_INTENTS.map((intent, idx) => (
                                <FloatingBubble
                                    key={intent}
                                    label={intent}
                                    delay={idx * 200}
                                    selected={userData.intent === intent}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setUserData(prev => ({ ...prev, intent }));
                                        setTimeout(() => setStep('REVEAL'), 800);
                                    }}
                                />
                            ))}
                        </View>
                    </Animated.View>
                )
            }

            {/* THE REVEAL */}
            {
                step === 'REVEAL' && (
                    <Animated.View entering={FadeIn.duration(1500)} style={styles.revealContainer}>
                        <View style={styles.avatarGlass}>
                            <Text style={styles.promptHeader}>The Soul Seal is Forged</Text>

                            <View style={styles.avatarPlaceholder}>
                                <PulsingAuraOrb isActive={true} />
                            </View>

                            <Text style={styles.usernameText}>{userData.persona || "The Soul Searcher"}</Text>
                            <Text style={[styles.promptSub, { marginTop: 10 }]}>{userData.vibeTags.length > 0 ? `Aligned with ${userData.vibeTags.join(', ')}` : 'A new beginning awaits.'}</Text>

                            <TouchableOpacity
                                style={[styles.primaryButton, { marginTop: 40, width: '100%' }]}
                                onPress={completeOnboarding}
                            >
                                <Text style={styles.primaryButtonText}>Enter the Daily Trio</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )
            }
        </LinearGradient >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: { // Added for Phase 8 Entrance
        ...theme.typography.script,
        color: theme.colors.accentGold,
        fontSize: 50,
        letterSpacing: 8,
        textAlign: 'center',
        marginBottom: 20,
    },
    centerBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    quoteText: {
        ...theme.typography.script,
        color: theme.colors.text,
        fontSize: 32,
        lineHeight: 44,
        textAlign: 'center',
        marginBottom: 20,
    },
    quoteAuthor: {
        ...theme.typography.caption,
        fontSize: 16,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    formContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: 24,
    },
    promptHeader: {
        ...theme.typography.header,
        textAlign: 'center',
        marginBottom: 10,
    },
    promptSub: {
        ...theme.typography.body,
        textAlign: 'center',
        opacity: 0.8,
        marginBottom: 40,
    },
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.xl,
        padding: 24,
        width: '100%',
        marginBottom: 40,
        ...theme.shadows.cloud,
    },
    nameInput: { // Phase 9 Neobrutalist Input
        ...theme.typography.header,
        fontSize: 32,
        textAlign: 'center',
        paddingVertical: 15,
        borderBottomWidth: 4,
        borderBottomColor: theme.colors.text,
        color: theme.colors.text,
        minWidth: '80%',
    },
    ageInputContainer: {
        width: '100%',
        marginBottom: 40,
        paddingHorizontal: 40,
    },
    ageTextInput: { // Phase 9 Neobrutalist Input
        ...theme.typography.header,
        fontSize: 48,
        textAlign: 'center',
        paddingVertical: 15,
        borderBottomWidth: 4,
        borderBottomColor: theme.colors.text,
        color: theme.colors.text,
        minWidth: 100,
    },
    primaryButton: {
        backgroundColor: theme.colors.primary, // Valentine Red
        paddingVertical: 18,
        paddingHorizontal: 48,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 2,
        borderColor: theme.colors.text, // Thick black outline
        ...theme.shadows.bubble,
    },
    primaryButtonText: {
        ...theme.typography.title,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    bubbleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
        width: '100%',
    },
    canvasArea: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    micButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.cloud,
    },
    micButtonRecording: {
        backgroundColor: theme.colors.primary,
        transform: [{ scale: 1.1 }],
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
    },
    vibeTagCard: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: theme.borderRadius.xl,
        ...theme.shadows.bubble,
    },
    vibeTagText: {
        ...theme.typography.body,
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    captionText: {
        ...theme.typography.caption,
        marginTop: 20,
        marginBottom: 60,
    },
    analyzingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    analyzingText: {
        ...theme.typography.body,
        color: theme.colors.primary,
        marginTop: 20,
    },
    fragmentRevealBox: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        padding: 40,
        borderRadius: 100,
        ...theme.shadows.cloud,
    },
    personaText: {
        ...theme.typography.header,
        color: theme.colors.text,
        marginTop: 20,
        fontSize: 22,
    },
    revealContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    avatarGlass: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 40,
        padding: 40,
        width: '100%',
        alignItems: 'center',
        ...theme.shadows.bubble,
        shadowRadius: 30,
    },
    avatarPlaceholder: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: theme.colors.backgroundTop,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 30,
        ...theme.shadows.cloud,
    },
    usernameText: {
        ...theme.typography.header,
        color: theme.colors.primary,
        fontSize: 32,
    },
    avatarBox: { // Added for Phase 8
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 30,
    },
    auraOrbContainer: { // Phase 10: Soul Capture Orb
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40,
        width: 120,
        height: 120,
    },
    auraOrbGradient: {
        width: 120,
        height: 120,
        borderRadius: 60,
        position: 'absolute',
        ...theme.shadows.cloud,
    },
    auraOrbInnerGlow: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.4)', // Soft inner shine
    },
});
