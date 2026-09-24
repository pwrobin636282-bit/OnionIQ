import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: Variant;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({
    label,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.82}
            style={[styles.base, styles[variant], isDisabled && styles.disabled, style]}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
                <Text style={[styles.label, styles[`${variant}Label`], textStyle]}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        height: 52,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    // Variants
    primary: {
        backgroundColor: '#7C3AED',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    secondary: {
        backgroundColor: 'rgba(6, 182, 212, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(6, 182, 212, 0.4)',
    },
    danger: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.4)',
    },
    ghost: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    disabled: {
        opacity: 0.45,
    },
    // Labels
    label: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.02 * 14,
    },
    primaryLabel: { color: '#FFFFFF' },
    secondaryLabel: { color: '#06B6D4' },
    dangerLabel: { color: '#EF4444' },
    ghostLabel: { color: '#94A3B8' },
});
