import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { theme } from '../theme';

interface AuraCloudsProps {
    count?: number;
}

const Cloud = ({ delay, startX, startY, scaleStart }: { delay: number, startX: number, startY: number, scaleStart: number }) => {
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(0.1);
    const scale = useSharedValue(scaleStart);

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Slow drifting across the screen
            translateX.value = withRepeat(
                withSequence(
                    withTiming(150, { duration: 25000 + Math.random() * 10000, easing: Easing.inOut(Easing.quad) }),
                    withTiming(-150, { duration: 25000 + Math.random() * 10000, easing: Easing.inOut(Easing.quad) })
                ),
                -1,
                true
            );

            // Gentle pulsing opacity
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.4, { duration: 4000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.1, { duration: 4000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
        }, delay);

        return () => clearTimeout(timeout);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { scale: scale.value }
        ],
        opacity: opacity.value,
        left: startX,
        top: startY,
    }));

    return <Animated.View style={[styles.cloud, animatedStyle]} />;
};

export default function AuraClouds({ count = 8 }: AuraCloudsProps) {
    const clouds = Array.from({ length: count }).map((_, i) => ({
        id: i,
        delay: Math.random() * 2000,
        x: Math.random() * 300 - 50, // spread across width
        y: Math.random() * 800 - 100, // spread across height
        scale: 0.8 + Math.random() * 1.5,
    }));

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {clouds.map((cloud) => (
                <Cloud
                    key={cloud.id}
                    delay={cloud.delay}
                    startX={cloud.x}
                    startY={cloud.y}
                    scaleStart={cloud.scale}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    cloud: {
        position: 'absolute',
        width: 200,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.accent, // Lavender Mist
        ...theme.shadows.bubble,
        filter: 'blur(10px)', // Experimental on some RN versions, fallback is the soft shadow
    }
});
