import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { generateNextLotId } from "../lib/db/inspectionStore";

export default function CreateLotScreen() {
  const [centre] = useState(
    "Visakhapatnam Procurement Centre"
  );

  const [supplier, setSupplier] = useState("");
  const [quantity, setQuantity] = useState("");
  const [operator] = useState("operator123");

  const handleContinue = () => {
    if (!supplier.trim() || !quantity.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter the supplier and quantity."
      );
      return;
    }

    // Generate a NEW ID every time Continue is pressed.
    const lotId = generateNextLotId();

    console.log("Creating new inspection:", lotId);

    router.push({
      pathname: "/capture",
      params: {
        centre,
        supplier: supplier.trim(),
        lotId,
        quantity: quantity.trim(),
        operator,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0B1020]"
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 60,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}

        <View className="mb-8">
          <Pressable
            onPress={() => router.back()}
            className="mb-6"
          >
            <Text className="text-violet-400 text-base">
              ← Back
            </Text>
          </Pressable>

          <Text className="text-white text-3xl font-bold">
            Create New Lot
          </Text>

          <Text className="text-slate-400 text-base mt-2">
            Enter procurement details before starting
            the inspection.
          </Text>
        </View>

        {/* FORM */}

        <View className="gap-5">

          {/* PROCUREMENT CENTRE */}

          <FormField
            label="Procurement Centre"
            value={centre}
            editable={false}
          />

          {/* SUPPLIER */}

          <FormField
            label="Supplier / Farmer Group"
            placeholder="Enter supplier name"
            value={supplier}
            onChangeText={setSupplier}
          />

          {/* LOT ID */}

          <View>
            <Text className="text-slate-200 text-sm font-semibold mb-2">
              Procurement Lot ID
            </Text>

            <View className="rounded-2xl border border-violet-500/30 bg-[#111827] px-4 py-4">
              <Text className="text-violet-300 text-base font-bold">
                Generated when inspection starts
              </Text>

              <Text className="text-slate-500 text-xs mt-1">
                A unique procurement ID will be assigned
                automatically.
              </Text>
            </View>
          </View>

          {/* QUANTITY */}

          <FormField
            label="Quantity (kg)"
            placeholder="e.g. 2500"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          {/* OPERATOR */}

          <FormField
            label="Operator"
            value={operator}
            editable={false}
          />
        </View>

        {/* INFORMATION CARD */}

        <View className="mt-7 rounded-2xl border border-slate-700 bg-[#111827] p-5">

          <Text className="text-white text-base font-bold mb-3">
            Procurement Record
          </Text>

          <Text className="text-slate-400 text-sm leading-6">
            A unique procurement lot identifier will be
            generated automatically when you continue to
            the capture stage.
          </Text>

          <View className="mt-4 rounded-xl bg-violet-500/10 border border-violet-500/20 p-4">

            <Text className="text-violet-300 text-xs font-semibold">
              IDENTIFIER FORMAT
            </Text>

            <Text className="text-white text-base font-bold mt-1">
              PSF-AP-VSKP-2026-XXXX
            </Text>

          </View>
        </View>

        {/* CONTINUE */}

        <Pressable
          onPress={handleContinue}
          className="mt-8 rounded-2xl bg-violet-600 py-4 items-center active:opacity-80"
        >
          <Text className="text-white text-base font-bold">
            Continue to Capture →
          </Text>
        </Pressable>

        <Text className="text-slate-500 text-xs text-center mt-4">
          Lot information will be stored locally for
          offline inspection.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  editable = true,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  keyboardType?: "default" | "numeric";
  editable?: boolean;
}) {
  return (
    <View>
      <Text className="text-slate-200 text-sm font-semibold mb-2">
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748B"
        keyboardType={keyboardType}
        editable={editable}
        className={`rounded-2xl border border-slate-700 bg-[#111827] px-4 py-4 text-white ${
          !editable ? "opacity-60" : ""
        }`}
      />
    </View>
  );
}