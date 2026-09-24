import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

const MOCK_USER = 'operator123';
const MOCK_PASS = 'password';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        setLoading(true);
        // Simulate async check
        await new Promise(r => setTimeout(r, 600));
        if (username === MOCK_USER && password === MOCK_PASS) {
            router.replace('/(tabs)/');
        } else {
            setError('Invalid Inspector ID or password.');
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.root}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                {/* Brand header */}
                <View style={styles.header}>
                    <View style={styles.logoBadge}>
                        <Text style={styles.logoEmoji}>🧅</Text>
                    </View>
                    <Text style={styles.appName}>OnionGrade AI</Text>
                    <Text style={styles.tagline}>AI-Assisted Onion Quality Assessment</Text>
                    <View style={styles.statusBadge}>
                        <View style={styles.dot} />
                        <Text style={styles.statusText}>v2.4 Field Neural Net • Offline Ready</Text>
                    </View>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Input
                        label="Inspector ID"
                        placeholder="e.g. operator123"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <Input
                        label="Password"
                        placeholder="Enter password"
                        value={password}
                        onChangeText={setPassword}
                        secure
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <Button
                        label={loading ? '' : 'Login to Field Terminal →'}
                        onPress={handleLogin}
                        loading={loading}
                        disabled={!username || !password}
                        style={styles.loginBtn}
                    />
                    <Button
                        label="Face / Biometric Login"
                        onPress={() => { }}
                        variant="secondary"
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Field Unit ID: OG-MOBILE-001</Text>
                    <Text style={styles.footerText}>Facility: Default Packhouse</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#0B1020' },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 48,
    },
    header: { alignItems: 'center', marginBottom: 40 },
    logoBadge: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: 'rgba(124,58,237,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    logoEmoji: { fontSize: 36 },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#F3F4F6',
        letterSpacing: -0.015 * 28,
        marginBottom: 6,
    },
    tagline: {
        fontSize: 14,
        color: '#94A3B8',
        marginBottom: 12,
        textAlign: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16,185,129,0.1)',
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: 'rgba(16,185,129,0.3)',
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    statusText: { color: '#10B981', fontSize: 11, fontWeight: '600' },
    form: { gap: 16, marginBottom: 32 },
    errorText: {
        color: '#EF4444',
        fontSize: 13,
        textAlign: 'center',
    },
    loginBtn: { marginTop: 8 },
    footer: { alignItems: 'center', gap: 4 },
    footerText: { color: '#4B5563', fontSize: 11 },
});
