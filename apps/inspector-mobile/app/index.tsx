import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { loginUser } from "../lib/db/authStore";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    const trimmedUsername =
      username.trim();

    if (!trimmedUsername || !password) {
      setError(
        "Enter your Inspector ID and password."
      );
      return;
    }

    setLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    /*
     * DEMO AUTHENTICATION
     *
     * For the prototype, any non-empty
     * Inspector ID + password is accepted.
     *
     * The backend will replace this with
     * real authentication later.
     */

    loginUser(trimmedUsername);

    setLoading(false);

    router.replace("/(tabs)/dashboard");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#080B14]"
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-[520px] self-center">

          {/* Brand */}
          <View className="items-center mb-10">
            <View className="w-16 h-16 rounded-2xl bg-violet-600 items-center justify-center mb-5">
              <Text className="text-3xl">
                🧅
              </Text>
            </View>

            <Text className="text-white text-3xl font-bold tracking-tight">
              OnionGrade
            </Text>

            <Text className="text-slate-400 text-sm mt-2 text-center">
              AI-assisted onion quality assessment
            </Text>
          </View>

          {/* Login Card */}
          <View className="rounded-3xl border border-slate-800 bg-[#111522] p-6">

            <View className="mb-7">
              <Text className="text-white text-2xl font-bold">
                Welcome back
              </Text>

              <Text className="text-slate-400 mt-2">
                Sign in to your inspection workspace.
              </Text>
            </View>

            {/* Inspector ID */}
            <View className="mb-5">
              <Text className="text-slate-200 text-sm font-semibold mb-2">
                Inspector ID
              </Text>

              <TextInput
                value={username}
                onChangeText={(value) => {
                  setUsername(value);
                  setError("");
                }}
                placeholder="operator123"
                placeholderTextColor="#64748B"
                autoCapitalize="none"
                autoCorrect={false}
                className="h-14 rounded-xl border border-slate-700 bg-[#0B1020] px-4 text-white"
              />
            </View>

            {/* Password */}
            <View className="mb-5">
              <Text className="text-slate-200 text-sm font-semibold mb-2">
                Password
              </Text>

              <TextInput
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setError("");
                }}
                placeholder="Enter password"
                placeholderTextColor="#64748B"
                secureTextEntry
                className="h-14 rounded-xl border border-slate-700 bg-[#0B1020] px-4 text-white"
              />
            </View>

            {/* Error */}
            {error ? (
              <View className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 mb-5">
                <Text className="text-red-400 text-sm">
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Login */}
            <Pressable
              onPress={handleLogin}
              disabled={loading}
              className="h-14 rounded-xl bg-violet-600 items-center justify-center active:opacity-80"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Enter Inspection Workspace →
                </Text>
              )}
            </Pressable>
          </View>

          {/* Status */}
          <View className="flex-row items-center justify-center mt-6">
            <View className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />

            <Text className="text-slate-500 text-xs">
              Field system online • Offline inspection supported
            </Text>
          </View>

          {/* Demo credentials */}
          <View className="mt-8 items-center">
            <Text className="text-slate-600 text-xs">
              Demo Mode
            </Text>

            <Text className="text-slate-500 text-xs mt-1 text-center">
              Any Inspector ID and password can be used
            </Text>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}