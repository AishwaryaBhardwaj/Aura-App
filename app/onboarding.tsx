import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../src/theme';

export default function OnboardingScreen() {
    const router = useRouter();

    const handleComplete = () => {
        // Navigate to the main tabs, replacing the current stack
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Aura</Text>
            <Text style={styles.subtitle}>Discover your daily trio. Find your spark.</Text>

            <TouchableOpacity style={styles.button} onPress={handleComplete}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
    },
    title: {
        ...theme.typography.header,
        color: theme.colors.primary,
        fontSize: 48,
        marginBottom: theme.spacing.md,
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.xxl * 2,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.round,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        ...theme.typography.title,
        color: theme.colors.card,
    },
});
