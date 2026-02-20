import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../src/theme';

export default function ChatScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Messages</Text>
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Your connections will appear here.</Text>
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
        marginBottom: theme.spacing.md,
    },
    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        ...theme.typography.body,
        color: theme.typography.caption.color,
    },
});
