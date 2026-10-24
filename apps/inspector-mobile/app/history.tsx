import React, { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import {
  getInspections,
  type Inspection,
} from "../lib/db/inspectionStore";

export default function HistoryScreen() {
  const [inspections, setInspections] = useState<Inspection[]>([]);

  const loadHistory = useCallback(() => {
    const data = getInspections();
    setInspections(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  return (
    <View className="flex-1 bg-[#0B1020]">

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 50,
        }}
        showsVerticalScrollIndicator={false}
      >

        <Pressable
          onPress={() => router.back()}
          className="mb-8"
        >
          <Text className="text-violet-400 text-base">
            ← Back
          </Text>
        </Pressable>

        <View className="mb-8">
          <Text className="text-violet-400 text-sm font-semibold">
            INSPECTION HISTORY
          </Text>

          <Text className="text-white text-3xl font-bold mt-2">
            Inspection History
          </Text>

          <Text className="text-slate-400 text-base mt-2">
            Review completed onion quality inspections and reports.
          </Text>
        </View>

        {inspections.length === 0 ? (
          <View className="rounded-3xl border border-slate-700 bg-[#111827] p-10 items-center">

            <Text className="text-5xl">
              🧅
            </Text>

            <Text className="text-white text-2xl font-bold mt-6 text-center">
              No inspection history
            </Text>

            <Text className="text-slate-500 text-base mt-2 text-center">
              Completed inspections will appear here.
            </Text>

            <Pressable
              onPress={() => router.push("/create-lot")}
              className="mt-7 rounded-2xl bg-violet-600 px-7 py-4"
            >
              <Text className="text-white font-bold">
                Start Inspection
              </Text>
            </Pressable>

          </View>
        ) : (
          <View className="gap-4">

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-slate-300 text-base font-semibold">
                {inspections.length} inspection
                {inspections.length === 1 ? "" : "s"}
              </Text>

              <Text className="text-slate-500 text-sm">
                Latest first
              </Text>
            </View>

            {inspections.map((inspection, index) => (
              <Pressable
                key={`${inspection.lotId}-${index}`}
                onPress={() =>
                  router.push({
                    pathname: "/result",
                    params: {
                      lotId: inspection.lotId,
                      supplier: inspection.supplier,
                      centre: inspection.centre,
                      quantity: inspection.quantity,
                      operator: inspection.operator,
                      grade: inspection.grade,
                      confidence: inspection.confidence,
                      gradeAPercentage:
                        inspection.gradeAPercentage,
                      ursPercentage:
                        inspection.ursPercentage,
                      otherPercentage:
                        inspection.otherPercentage,
                    },
                  })
                }
                className="rounded-3xl border border-slate-700 bg-[#111827] p-5"
              >

                <View className="flex-row items-center">

                  <View className="w-16 h-16 rounded-2xl bg-[#1B263B] items-center justify-center mr-4">
                    <Text className="text-3xl">
                      🧅
                    </Text>
                  </View>

                  <View className="flex-1">

                    <Text className="text-white text-lg font-bold">
                      {inspection.lotId}
                    </Text>

                    <Text className="text-slate-300 text-base mt-1">
                      {inspection.supplier}
                    </Text>

                    <Text className="text-slate-500 text-sm mt-1">
                      {inspection.centre} • {inspection.quantity} kg
                    </Text>

                  </View>

                  <View className="rounded-full bg-emerald-500/15 px-4 py-2">
                    <Text className="text-emerald-400 font-bold">
                      Grade {inspection.grade}
                    </Text>
                  </View>

                </View>

                <View className="h-px bg-slate-800 my-4" />

                <View className="flex-row justify-between">

                  <Text className="text-slate-500 text-sm">
                    Confidence
                  </Text>

                  <Text className="text-slate-300 text-sm font-semibold">
                    {inspection.confidence}%
                  </Text>

                </View>

                <View className="flex-row justify-between mt-2">

                  <Text className="text-slate-500 text-sm">
                    Grade A
                  </Text>

                  <Text className="text-slate-300 text-sm font-semibold">
                    {inspection.gradeAPercentage}%
                  </Text>

                </View>

                <Text className="text-violet-400 text-sm font-semibold text-right mt-4">
                  View report →
                </Text>

              </Pressable>
            ))}

          </View>
        )}

      </ScrollView>

    </View>
  );
}