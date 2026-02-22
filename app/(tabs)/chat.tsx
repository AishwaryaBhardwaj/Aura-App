import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';

import { theme } from '../../src/theme';

const MOCK_MATCH = {
    persona: 'The Architect',
    vibeTag: '#SlowCoffee',
    fragmentPrompt: '"I love the smell of the first grind in the morning..."'
};

export default function ChatScreen() {
    const [messages, setMessages] = useState<{ id: string, text: string, isUser: boolean }[]>([]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage = { id: Date.now().toString(), text: inputText, isUser: true };
        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        // Mock a reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: 'That is exactly how I feel...',
                isUser: false
            }]);
        }, 1500);
    };

    // Phase 4: Intentional Unblur Logic. Start at 100, decrease by 25 per dual message exchange
    const blurIntensity = Math.max(0, 100 - (Math.floor(messages.length / 2) * 25));

    return (
        <LinearGradient
            colors={[theme.colors.backgroundTop, theme.colors.backgroundBottom]}
            style={styles.container}
        >
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarBase}>
                            <FontAwesome name="user" size={30} color={theme.colors.accentGold} />
                        </View>
                        {blurIntensity > 0 && (
                            <BlurView intensity={blurIntensity} tint="dark" style={styles.absoluteBlur} />
                        )}
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>{MOCK_MATCH.persona}</Text>
                        <Text style={styles.headerSub}>Bonding over {MOCK_MATCH.vibeTag}</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>
                    {/* The Prompt-First Enforcement */}
                    {messages.length === 0 && (
                        <Animated.View entering={FadeInDown.duration(800)} style={styles.promptContainer}>
                            <Text style={styles.promptHeader}>The Spark</Text>
                            <Text style={styles.promptQuote}>{MOCK_MATCH.fragmentPrompt}</Text>
                            <Text style={styles.promptInstruction}>
                                To initiate connection, your first message must relate to this fragment of their Sunday morning.
                            </Text>
                        </Animated.View>
                    )}

                    {messages.map((msg, index) => (
                        <Animated.View
                            key={msg.id}
                            entering={SlideInUp.duration(400)}
                            style={[styles.messageBubble, msg.isUser ? styles.messageUser : styles.messageMatch]}
                        >
                            <Text style={[styles.messageText, msg.isUser ? styles.messageTextUser : styles.messageTextMatch]}>
                                {msg.text}
                            </Text>
                        </Animated.View>
                    ))}
                </ScrollView>

                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={messages.length === 0 ? "Reply to their prompt..." : "Send a message..."}
                        placeholderTextColor={theme.colors.text}
                        value={inputText}
                        onChangeText={setInputText}
                        autoCorrect={true}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <FontAwesome name="paper-plane" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(247, 231, 206, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1A0A0A',
    },
    avatarBase: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.backgroundTop,
        justifyContent: 'center',
        alignItems: 'center',
    },
    absoluteBlur: {
        ...StyleSheet.absoluteFillObject,
    },
    headerTextContainer: {
        marginLeft: 15,
    },
    headerTitle: {
        ...theme.typography.title,
        fontSize: 20,
        color: theme.colors.text,
    },
    headerSub: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        marginTop: 2,
    },
    chatScroll: {
        padding: 20,
        paddingBottom: 40,
    },
    promptContainer: {
        backgroundColor: theme.colors.card,
        padding: 24,
        borderRadius: 20,
        marginBottom: 30,
        alignItems: 'center',
        ...theme.shadows.cloud,
    },
    promptHeader: {
        ...theme.typography.script,
        fontSize: 28,
        color: theme.colors.accentGold,
        marginBottom: 15,
    },
    promptQuote: {
        ...theme.typography.body,
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        color: theme.colors.text,
        marginBottom: 20,
    },
    promptInstruction: {
        ...theme.typography.caption,
        textAlign: 'center',
        color: theme.colors.primary,
    },
    messageBubble: {
        maxWidth: '80%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 10,
    },
    messageUser: {
        alignSelf: 'flex-end',
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 5,
    },
    messageMatch: {
        alignSelf: 'flex-start',
        backgroundColor: theme.colors.card,
        borderBottomLeftRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(247, 231, 206, 0.5)',
    },
    messageText: {
        ...theme.typography.body,
        fontSize: 16,
    },
    messageTextUser: {
        color: '#FFF',
    },
    messageTextMatch: {
        color: theme.colors.text,
    },
    inputArea: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(247, 231, 206, 0.5)',
    },
    textInput: {
        flex: 1,
        backgroundColor: theme.colors.card,
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        ...theme.typography.body,
        fontSize: 16,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(247, 231, 206, 0.5)',
    },
    sendButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.bubble,
    }
});
