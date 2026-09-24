import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInputProps,
} from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    secure?: boolean;
}

export function Input({ label, error, secure = false, style, ...rest }: InputProps) {
    const [hidden, setHidden] = useState(secure);
    const [focused, setFocused] = useState(false);

    return (
        <View style={styles.wrapper}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <View style={[styles.container, focused && styles.containerFocused, !!error && styles.containerError]}>
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor="#6B7280"
                    secureTextEntry={hidden}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    {...rest}
                />
                {secure && (
                    <TouchableOpacity onPress={() => setHidden(h => !h)} style={styles.toggle}>
                        <Text style={styles.toggleText}>{hidden ? '👁' : '🙈'}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { gap: 6 },
    label: {
        color: '#CCC3D8',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.03 * 12,
        textTransform: 'uppercase',
    },
    container: {
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111827',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 16,
    },
    containerFocused: {
        borderColor: '#7C3AED',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    containerError: {
        borderColor: '#EF4444',
    },
    input: {
        flex: 1,
        color: '#F3F4F6',
        fontSize: 16,
    },
    toggle: { padding: 4 },
    toggleText: { fontSize: 16 },
    error: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 2,
    },
});
