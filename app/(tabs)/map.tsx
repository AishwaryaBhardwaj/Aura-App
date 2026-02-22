import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    ZoomIn
} from 'react-native-reanimated';

import { theme } from '../../src/theme';

const { width, height } = Dimensions.get('window');

// Mock Clusters representing abstract groups based on Vibe Tags
const CLUSTERS = [
    { id: 1, tag: '#DeepTalks', top: height * 0.2, left: width * 0.2, size: 120, intensity: 0.9, color: theme.colors.primary },
    { id: 2, tag: '#VinylRecords', top: height * 0.5, left: width * 0.6, size: 90, intensity: 0.7, color: theme.colors.accentGold },
    { id: 3, tag: '#SlowCoffee', top: height * 0.4, left: width * 0.15, size: 150, intensity: 1, color: theme.colors.accent },
    { id: 4, tag: '#SundayBaking', top: height * 0.65, left: width * 0.25, size: 110, intensity: 0.8, color: '#FFB6C1' },
    { id: 5, tag: '#Poetry', top: height * 0.3, left: width * 0.7, size: 80, intensity: 0.6, color: '#E6E6FA' },
];

export default function MapScreen() {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    return (
        <LinearGradient
            colors={[theme.colors.backgroundTop, theme.colors.backgroundBottom]}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Aura Map</Text>
                <Text style={styles.headerSub}>Discover souls drifting in your orbit.</Text>
            </View>

            <View style={styles.mapArea}>
                {CLUSTERS.map((cluster) => (
                    <AuraCluster
                        key={cluster.id}
                        cluster={cluster}
                        onPress={() => setSelectedTag(cluster.tag)}
                    />
                ))}
            </View>

            {/* Phase 10: Glassmorphic Interactive Modal */}
            <Modal
                transparent={true}
                visible={!!selectedTag}
                animationType="fade"
                onRequestClose={() => setSelectedTag(null)}
            >
                <BlurView intensity={70} tint="light" style={styles.modalOverlay}>
                    <Animated.View entering={ZoomIn.duration(400)} exiting={FadeOut.duration(200)} style={styles.glassModal}>
                        <Text style={styles.modalTitle}>{selectedTag}</Text>
                        <Text style={styles.modalBody}>
                            10 souls nearby are vibing with {selectedTag}.
                        </Text>
                        <View style={styles.eventBox}>
                            <Text style={styles.eventTitle}>Upcoming Event</Text>
                            <Text style={styles.eventDetails}>Midnight Poetry Slam, 9:00 PM</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setSelectedTag(null)}
                        >
                            <Text style={styles.closeButtonText}>Close Orbit</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </BlurView>
            </Modal>

        </LinearGradient>
    );
}

function AuraCluster({ cluster, onPress }: { cluster: any, onPress: () => void }) {
    const pulseScore = useSharedValue(1);

    useEffect(() => {
        // Asynchronous, randomized breathing cycle for each cluster
        const randomDuration = 2000 + Math.random() * 2000;
        pulseScore.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: randomDuration, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.95, { duration: randomDuration, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScore.value }],
    }));

    return (
        <Animated.View
            entering={ZoomIn.duration(1500).delay(Math.random() * 500)}
            style={[
                styles.clusterBase,
                pulseStyle,
                {
                    top: cluster.top,
                    left: cluster.left,
                    width: cluster.size,
                    height: cluster.size,
                    borderRadius: cluster.size / 2,
                    backgroundColor: cluster.color,
                    opacity: cluster.intensity * 0.6 // Keep it ethereal
                }
            ]}
        >
            <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center' }]}>
                <View style={styles.centerDot}>
                    <Text style={styles.tagText}>{cluster.tag}</Text>
                </View>
            </TouchableOpacity>
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
        alignItems: 'center',
        zIndex: 10,
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
    mapArea: {
        ...StyleSheet.absoluteFillObject,
    },
    clusterBase: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.cloud,
        shadowRadius: 30, // Extremely soft, glowing edges
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.5,
    },
    centerDot: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        ...theme.shadows.bubble,
    },
    tagText: {
        ...theme.typography.caption,
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Soft pastel overlay
    },
    glassModal: {
        width: width * 0.85,
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Glassmorphism
        borderRadius: theme.borderRadius.lg,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 1)',
        ...theme.shadows.cloud,
    },
    modalTitle: {
        ...theme.typography.script,
        fontSize: 28,
        color: theme.colors.primary,
        marginBottom: 10,
    },
    modalBody: {
        ...theme.typography.body,
        textAlign: 'center',
        color: theme.colors.text,
        marginBottom: 20,
    },
    eventBox: {
        backgroundColor: theme.colors.accent,
        padding: 15,
        borderRadius: theme.borderRadius.md,
        width: '100%',
        alignItems: 'center',
        marginBottom: 25,
    },
    eventTitle: {
        ...theme.typography.caption,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    eventDetails: {
        ...theme.typography.body,
        color: theme.colors.text,
        marginTop: 5,
    },
    closeButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: theme.borderRadius.xl,
        ...theme.shadows.bubble,
    },
    closeButtonText: {
        ...theme.typography.body,
        color: '#FFFFFF',
    }
});
