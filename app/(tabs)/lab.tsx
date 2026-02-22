import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { theme } from '../../src/theme';

type Message = {
    id: string;
    sender: 'ai' | 'user';
    text: string;
};

export default function LabScreen() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init_1',
            sender: 'ai',
            text: "Welcome to the Lab! I'm Aura. This is a safe space to practice intentional conversation before you send a real Spark.",
        },
        {
            id: 'init_2',
            sender: 'ai',
            text: "How about we start with something simple? What's a small thing that brought you joy today?",
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [showNudge, setShowNudge] = useState(false);
    const [userTags, setUserTags] = useState<string[]>([]);
    const scrollViewRef = useRef<ScrollView>(null);

    // Phase 10: Fetch Vibe Tags for Contextual Replies
    useEffect(() => {
        const loadTags = async () => {
            try {
                const profileStr = await AsyncStorage.getItem('@userAuraProfile');
                if (profileStr) {
                    const profile = JSON.parse(profileStr);
                    if (profile.vibeTags && profile.vibeTags.length > 0) {
                        setUserTags(profile.vibeTags);
                        // Phase 11: Dynamic Initiation
                        const randomTag = profile.vibeTags[Math.floor(Math.random() * profile.vibeTags.length)];
                        setMessages([
                            { id: 'init_1', sender: 'ai', text: "Welcome to the Lab! I'm Aura. This is a safe space to practice intentional conversation before you send a real Spark." },
                            { id: 'init_2', sender: 'ai', text: `Since you love ${randomTag}, what's a favorite memory or detail you associate with it?` }
                        ]);
                    }
                }
            } catch (e) {
                console.error("Failed to load tags for Lab", e);
            }
        };
        loadTags();

        // Phase 7: Mock Hope Nudge trigger on mount
        const timer = setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setShowNudge(true);
            setTimeout(() => setShowNudge(false), 5000); // Hide after 5 seconds
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    const handleSend = () => {
        if (!inputText.trim()) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const newUserMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputText.trim(),
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputText('');
        setShowNudge(false);

        // Phase 10: Dynamic Contextual AI Responses
        setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Generate a smart reply based on tags if available
            let replyText = "That's wonderful. Joy is often found in the small things. Notice how expressing that makes the conversation feel more grounded?";

            if (userTags.length > 0) {
                const randomTag = userTags[Math.floor(Math.random() * userTags.length)];
                const dynamicReplies = [
                    `I love that perspective. Since we both share ${randomTag}, do you find that it helps you stay grounded too?`,
                    `That honestly sounds so peaceful. Reminds me a bit of the energy around ${randomTag}. What do you think?`,
                    `Exactly! I feel the same way, especially when I'm enjoying ${randomTag}. Does that resonate with you?`,
                    `Such a great point. I was just thinking about how ${randomTag} brings a similar kind of joy.`
                ];
                replyText = dynamicReplies[Math.floor(Math.random() * dynamicReplies.length)];
            }

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: replyText,
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1500);
    };

    return (
        <LinearGradient
            colors={[theme.colors.backgroundTop, theme.colors.backgroundBottom]}
            style={styles.container}
        >
            {/* Phase 7: Hope Nudge UI */}
            {showNudge && (
                <Animated.View entering={FadeInDown.springify()} style={styles.nudgeContainer}>
                    <View style={styles.nudgeIconBox}>
                        <FontAwesome name="heart-o" size={24} color="#FFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.nudgeTitle}>Hope Nudge from Aura</Text>
                        <Text style={styles.nudgeText}>You haven't sent a Spark in 3 days. 'The Dreamer' is waiting for someone like you.</Text>
                    </View>
                </Animated.View>
            )}

            <View style={styles.header}>
                {/* Smiling Purple Cloud Avatar */}
                <View style={styles.avatarCloud}>
                    <FontAwesome name="cloud" size={50} color={theme.colors.accent} style={{ position: 'absolute' }} />
                    <View style={styles.faceRow}>
                        <View style={styles.eye} />
                        <View style={styles.eye} />
                    </View>
                    <View style={styles.smile} />
                </View>
                <Text style={styles.headerTitle}>The Lab</Text>
                <Text style={styles.headerSub}>Practice intentionality.</Text>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.messageScroll}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map((msg, index) => (
                        <Animated.View
                            key={msg.id}
                            entering={FadeInDown.delay(index * 100).duration(500)}
                            style={[
                                styles.messageBubble,
                                msg.sender === 'user' ? styles.userBubble : styles.aiBubble
                            ]}
                        >
                            <Text style={[styles.messageText, msg.sender === 'user' && { color: '#FFF' }]}>
                                {msg.text}
                            </Text>
                        </Animated.View>
                    ))}
                </ScrollView>

                <BlurView intensity={80} tint="light" style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your practice message..."
                        placeholderTextColor="rgba(0,0,0,0.4)"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <FontAwesome name="paper-plane" size={20} color="#FFF" />
                    </TouchableOpacity>
                </BlurView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    avatarCloud: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    faceRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 5,
        zIndex: 10,
    },
    eye: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.text,
    },
    smile: {
        width: 12,
        height: 6,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.text,
        borderRadius: 6,
        zIndex: 10,
    },
    headerTitle: {
        ...theme.typography.header,
        fontSize: 24,
        color: theme.colors.text,
    },
    headerSub: {
        ...theme.typography.caption,
        color: theme.colors.primary,
    },
    messageScroll: {
        padding: 20,
        paddingBottom: 40,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 16,
        borderRadius: 20,
        marginBottom: 15,
        ...theme.shadows.cloud,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderBottomLeftRadius: 5,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 5,
    },
    messageText: {
        ...theme.typography.body,
        fontSize: 16,
        color: theme.colors.text,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 15,
        paddingBottom: Platform.OS === 'ios' ? 30 : 15,
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.5)',
    },
    input: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingTop: 12,
        paddingBottom: 12,
        marginRight: 10,
        maxHeight: 100,
        ...theme.typography.body,
        ...theme.shadows.bubble,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.bubble,
    },
    nudgeContainer: { // Phase 7
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        ...theme.shadows.cloud,
        zIndex: 100,
    },
    nudgeIconBox: { // Phase 7
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nudgeTitle: { // Phase 7
        ...theme.typography.title,
        color: theme.colors.text,
        fontSize: 16,
    },
    nudgeText: { // Phase 7
        ...theme.typography.caption,
        color: theme.colors.text,
        opacity: 0.8,
        marginTop: 4,
    }
});
