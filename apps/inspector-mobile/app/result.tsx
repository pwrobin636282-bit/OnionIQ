import React, { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { addInspection } from "../lib/db/inspectionStore";

export default function ResultScreen() {
  const params = useLocalSearchParams<{
    lotId?: string;
    supplier?: string;
    centre?: string;
    quantity?: string;
    operator?: string;
  }>();

  const lotId = params.lotId || "PSF-AP-VSKP-2026-0001";
  const supplier = params.supplier || "Supplier not available";
  const centre = params.centre || "Visakhapatnam Procurement Centre";
  const quantity = params.quantity || "0";
  const operator = params.operator || "operator123";

  const grade = "A";
  const confidence = "92";
  const gradeAPercentage = "86";
  const ursPercentage = "9";
  const otherPercentage = "5";

  // Save inspection when the result is generated.
  // This happens before the user generates/exports the PDF.
  useEffect(() => {
    if (!lotId) return;

    addInspection({
      lotId,
      supplier,
      centre,
      quantity,
      operator,
      grade,
      confidence,
      gradeAPercentage,
      ursPercentage,
      otherPercentage,
    });
  }, [
    lotId,
    supplier,
    centre,
    quantity,
    operator,
  ]);

  const handleGenerateReport = () => {
    router.push({
      pathname: "/report",
      params: {
        lotId,
        supplier,
        centre,
        quantity,
        operator,
        grade,
        confidence,
        gradeAPercentage,
        ursPercentage,
        otherPercentage,
      },
    });
  };

  return (
    <>
      {/* Hide Expo Router default white header */}
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View
        className="flex-1"
        style={{
          backgroundColor: "#0B1020",
        }}
      >
        <ScrollView
          className="flex-1"
          style={{
            backgroundColor: "#0B1020",
          }}
          contentContainerStyle={{
            padding: 24,
            paddingBottom: 50,
            backgroundColor: "#0B1020",
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-8">
            <Text className="text-violet-400 text-sm font-semibold">
              INSPECTION RESULT
            </Text>

            <Text className="text-white text-3xl font-bold mt-2">
              Quality Assessment
            </Text>

            <Text className="text-slate-400 text-base mt-2">
              AI-assisted assessment of the captured onion sample.
            </Text>
          </View>

          {/* Lot Information */}
          <View
            className="rounded-3xl p-7"
            style={{
              backgroundColor: "#111827",
              borderWidth: 1,
              borderColor: "#334155",
            }}
          >
            <View className="flex-row justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-slate-500 text-xs font-semibold">
                  LOT ID
                </Text>

                <Text className="text-white text-2xl font-bold mt-2">
                  {lotId}
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-slate-500 text-xs font-semibold">
                  QUANTITY
                </Text>

                <Text className="text-white text-lg font-bold mt-2">
                  {quantity} kg
                </Text>
              </View>
            </View>

            <View className="h-px bg-slate-700 my-7" />

            <Text className="text-slate-300 text-lg font-semibold">
              {supplier}
            </Text>

            <Text className="text-slate-500 text-base mt-3">
              {centre}
            </Text>

            <Text className="text-slate-500 text-base mt-2">
              Inspector: {operator}
            </Text>
          </View>

          {/* Grade */}
          <View
            className="mt-6 rounded-3xl p-8 items-center"
            style={{
              backgroundColor: "#10291F",
              borderWidth: 1,
              borderColor: "#34D399",
            }}
          >
            <Text className="text-emerald-400 text-base font-bold">
              ASSESSED GRADE
            </Text>

            <Text
              className="text-8xl font-bold mt-2"
              style={{
                color: "#6EE7B7",
              }}
            >
              {grade}
            </Text>

            <View
              className="rounded-full px-6 py-3"
              style={{
                backgroundColor: "#164E3B",
              }}
            >
              <Text className="text-emerald-400 font-bold">
                {confidence}% CONFIDENCE
              </Text>
            </View>

            <Text className="text-slate-400 text-sm text-center mt-6">
              Based on visible characteristics in the captured sample.
            </Text>
          </View>

          {/* Lot Composition */}
          <View className="mt-7">
            <Text className="text-white text-xl font-bold mb-4">
              Lot Composition
            </Text>

            <View
              className="rounded-3xl p-6"
              style={{
                backgroundColor: "#111827",
                borderWidth: 1,
                borderColor: "#334155",
              }}
            >
              <CompositionRow
                label="Grade A"
                value={`${gradeAPercentage}%`}
                valueClass="text-emerald-400"
              />

              <CompositionRow
                label="URS"
                value={`${ursPercentage}%`}
                valueClass="text-amber-400"
              />

              <CompositionRow
                label="Other / Reject"
                value={`${otherPercentage}%`}
                valueClass="text-red-400"
                last
              />
            </View>
          </View>

          {/* Visible Characteristics */}
          <View className="mt-7">
            <Text className="text-white text-xl font-bold mb-4">
              Visible Characteristics
            </Text>

            <View
              className="rounded-3xl p-6"
              style={{
                backgroundColor: "#111827",
                borderWidth: 1,
                borderColor: "#334155",
              }}
            >
              <CharacteristicRow
                label="Healthy onions"
                value="86%"
              />

              <CharacteristicRow
                label="Sprouting"
                value="4%"
              />

              <CharacteristicRow
                label="Skin damage"
                value="3%"
              />

              <CharacteristicRow
                label="Visible rot"
                value="2%"
                last
              />
            </View>
          </View>

          {/* Prototype Notice */}
          <View
            className="mt-7 rounded-2xl p-5"
            style={{
              backgroundColor: "#211A0A",
              borderWidth: 1,
              borderColor: "#92400E",
            }}
          >
            <Text className="text-amber-300 font-bold">
              Prototype Result
            </Text>

            <Text className="text-slate-400 text-sm leading-6 mt-2">
              The current result uses simulated inspection values for the
              prototype. Production grading will use the computer vision
              model and deterministic grading rules.
            </Text>
          </View>

          {/* Generate Report */}
          <Pressable
            onPress={handleGenerateReport}
            className="mt-7 rounded-2xl bg-violet-600 py-5 items-center active:opacity-80"
          >
            <Text className="text-white text-lg font-bold">
              Generate Quality Report →
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
}

function CompositionRow({
  label,
  value,
  valueClass,
  last = false,
}: {
  label: string;
  value: string;
  valueClass: string;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center justify-between py-4 ${
        !last ? "border-b border-slate-800" : ""
      }`}
    >
      <Text className="text-slate-300 text-base">
        {label}
      </Text>

      <Text className={`text-lg font-bold ${valueClass}`}>
        {value}
      </Text>
    </View>
  );
}

function CharacteristicRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center justify-between py-4 ${
        !last ? "border-b border-slate-800" : ""
      }`}
    >
      <Text className="text-slate-400 text-base">
        {label}
      </Text>

      <Text className="text-slate-200 text-base font-bold">
        {value}
      </Text>
    </View>
  );
}