import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { theme } from '../theme';

interface FloatingBubbleProps {
    label: string;
    delay: number;
    onPress: () => void;
    selected: boolean;
}

export const FloatingBubble = ({ label, delay, onPress, selected }: FloatingBubbleProps) => {
    const floatY = useSharedValue(0);
    const floatX = useSharedValue(0); // Add horizontal float
    const scale = useSharedValue(0);

    React.useEffect(() => {
        // Initial Pop in
        scale.value = withTiming(1, { duration: 800 });

        // Continuous Floaty Physics Phase 9
        const timeout = setTimeout(() => {
            floatY.value = withRepeat(
                withSequence(
                    withTiming(-20, { duration: 2500 + Math.random() * 1500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(20, { duration: 2500 + Math.random() * 1500, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
            floatX.value = withRepeat(
                withSequence(
                    withTiming(-10, { duration: 3000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(10, { duration: 3000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
        }, delay);

        return () => clearTimeout(timeout);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const s = selected ? withSpring(1.2) : scale.value;
        return {
            transform: [
                { translateY: selected ? 0 : floatY.value },
                { translateX: selected ? 0 : floatX.value },
                { scale: s }
            ],
            opacity: selected ? 1 : interpolate(scale.value, [0, 1], [0, 1])
        };
    });

    return (
        <Animated.View style={[styles.bubbleContainer, animatedStyle]}>
            <TouchableOpacity
                style={[styles.bubble, selected && styles.bubbleSelected]}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Text style={[styles.bubbleText, selected && { color: theme.colors.card }]}>
                    {label}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    bubbleContainer: {
        margin: 10,
    },
    bubble: { // Phase 10 Soft Pastel Bubble
        width: 140,
        height: 140,
        borderRadius: 70, // Perfect circle
        backgroundColor: theme.colors.card, // Solid Clean White
        borderWidth: 1,
        borderColor: theme.colors.border, // Soft outline
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        ...theme.shadows.bubble, // Soft Drop Shadow
    },
    bubbleSelected: {
        backgroundColor: theme.colors.primary, // Valentine Red Highlight
    },
    bubbleText: {
        ...theme.typography.header, // Bold Serif Font
        fontSize: 18,
        textAlign: 'center',
        color: theme.colors.text,
    }
});
