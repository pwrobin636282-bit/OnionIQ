import React, { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  router,
  useFocusEffect,
} from "expo-router";
import {
  getInspections,
  Inspection,
} from "../../lib/db/inspectionStore";

export default function DashboardScreen() {
  const [inspections, setInspections] =
    useState<Inspection[]>([]);

  /*
   * Reload inspections whenever the dashboard
   * becomes active.
   */
  useFocusEffect(
    useCallback(() => {
      const loadInspections = () => {
        const saved = getInspections();
        setInspections(saved);
      };

      loadInspections();
    }, [])
  );

  /*
   * Dashboard shows ONLY the 3 latest inspections.
   */
  const recentInspections =
    inspections.slice(0, 3);

  /*
   * Start a new inspection.
   */
  const handleCreateInspection = () => {
    router.push("/create-lot");
  };

  /*
   * Open complete inspection history.
   */
  const handleViewHistory = () => {
    router.push("/history");
  };

  /*
   * Open an individual inspection report.
   */
  const handleViewInspection = (
    inspection: Inspection
  ) => {
    router.push({
      pathname: "/report",
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
    });
  };

  /*
   * Logout.
   *
   * This only returns the user to Login.
   * It does NOT delete inspection history.
   */
  const handleLogout = () => {
    router.replace("/");
  };

  return (
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
          paddingBottom: 60,
          backgroundColor: "#0B1020",
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* ================================================================ */}
        {/* HEADER                                                           */}
        {/* ================================================================ */}

        <View className="mb-7">

          <Text className="text-violet-400 text-sm font-semibold uppercase tracking-wider">
            ONIONGRADE AI
          </Text>

          <Text className="text-white text-3xl font-bold mt-2">
            Procurement Dashboard
          </Text>

          <Text className="text-slate-400 text-base mt-2">
            AI-assisted onion quality inspection and grading.
          </Text>

          {/* Logout */}
          <Pressable
            onPress={handleLogout}
            className="self-start mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-3 active:bg-red-500/20"
          >
            <Text className="text-red-400 font-semibold">
              Logout
            </Text>
          </Pressable>

        </View>

        {/* ================================================================ */}
        {/* NEW INSPECTION CTA                                               */}
        {/* ================================================================ */}

        <Pressable
          onPress={handleCreateInspection}
          className="rounded-3xl bg-violet-600 p-6 active:opacity-80"
        >

          <Text className="text-violet-200 text-sm font-semibold">
            NEW INSPECTION
          </Text>

          <Text className="text-white text-2xl font-bold mt-2">
            Start New Inspection
          </Text>

          <Text className="text-violet-100 text-sm mt-2">
            Create a procurement lot and begin AI-assisted quality assessment.
          </Text>

          <View className="mt-5 self-start rounded-xl bg-white/10 px-4 py-3">
            <Text className="text-white font-bold">
              Create New Lot →
            </Text>
          </View>

        </Pressable>

        {/* ================================================================ */}
        {/* TODAY'S OVERVIEW                                                 */}
        {/* ================================================================ */}

        <View className="mt-8">

          <Text className="text-white text-xl font-bold mb-4">
            Today&apos;s Overview
          </Text>

          <View className="flex-row gap-3">

            <OverviewCard
              label="Inspections"
              value={String(
                inspections.length
              )}
            />

            <OverviewCard
              label="Grade A"
              value={String(
                inspections.filter(
                  (inspection) =>
                    inspection.grade === "A"
                ).length
              )}
            />

            <OverviewCard
              label="Reports"
              value={String(
                inspections.length
              )}
            />

          </View>

        </View>

        {/* ================================================================ */}
        {/* RECENT INSPECTIONS                                               */}
        {/* ================================================================ */}

        <View className="mt-8">

          <View className="flex-row items-center justify-between mb-4">

            <Text className="text-white text-xl font-bold">
              Recent Inspections
            </Text>

            <Pressable
              onPress={handleViewHistory}
              className="active:opacity-70"
            >
              <Text className="text-violet-400 font-semibold">
                View history →
              </Text>
            </Pressable>

          </View>

          {recentInspections.length === 0 ? (

            <View className="rounded-3xl border border-slate-700 bg-[#111827] p-7 items-center">

              <Text className="text-4xl mb-3">
                🧅
              </Text>

              <Text className="text-white text-lg font-bold">
                No inspections yet
              </Text>

              <Text className="text-slate-500 text-sm text-center mt-2">
                Your completed inspections will appear here.
              </Text>

              <Pressable
                onPress={handleCreateInspection}
                className="mt-5 rounded-xl bg-violet-600 px-5 py-3"
              >
                <Text className="text-white font-bold">
                  Start Inspection
                </Text>
              </Pressable>

            </View>

          ) : (

            <View className="gap-5">

              {recentInspections.map(
                (inspection) => (
                  <InspectionCard
                    key={inspection.lotId}
                    inspection={inspection}
                    onPress={() =>
                      handleViewInspection(
                        inspection
                      )
                    }
                  />
                )
              )}

            </View>

          )}

        </View>

        {/* ================================================================ */}
        {/* WORKFLOW                                                         */}
        {/* ================================================================ */}

        <View className="mt-8">

          <Text className="text-white text-xl font-bold mb-4">
            Inspection Workflow
          </Text>

          <View className="rounded-3xl border border-slate-700 bg-[#111827] p-5">

            <WorkflowStep
              number="01"
              title="Create Lot"
              description="Enter supplier, centre and quantity."
            />

            <WorkflowStep
              number="02"
              title="Capture Sample"
              description="Capture a standardized onion sample."
            />

            <WorkflowStep
              number="03"
              title="AI Analysis"
              description="Detect visible defects and assess size."
            />

            <WorkflowStep
              number="04"
              title="Quality Report"
              description="Review the assessment and generate a report."
              last
            />

          </View>

        </View>

      </ScrollView>
    </View>
  );
}

/* ========================================================================= */
/* OVERVIEW CARD                                                            */
/* ========================================================================= */

function OverviewCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 rounded-2xl border border-slate-700 bg-[#111827] p-4">

      <Text className="text-slate-500 text-xs font-semibold uppercase">
        {label}
      </Text>

      <Text className="text-white text-2xl font-bold mt-2">
        {value}
      </Text>

    </View>
  );
}

/* ========================================================================= */
/* INSPECTION CARD                                                          */
/* ========================================================================= */

function InspectionCard({
  inspection,
  onPress,
}: {
  inspection: Inspection;
  onPress: () => void;
}) {
  return (
    <View className="rounded-3xl border border-slate-700 bg-[#111827] p-6">

      {/* Top section */}
      <View className="flex-row items-start">

        {/* Onion icon */}
        <View className="w-20 h-20 rounded-2xl bg-[#1A2740] items-center justify-center mr-5">

          <Text className="text-4xl">
            🧅
          </Text>

        </View>

        {/* Inspection information */}
        <View className="flex-1">

          <Text
            className="text-white text-2xl font-bold"
            numberOfLines={1}
          >
            {inspection.lotId}
          </Text>

          <Text
            className="text-slate-300 text-base mt-2"
            numberOfLines={1}
          >
            {inspection.supplier}
          </Text>

          <Text
            className="text-slate-500 text-sm mt-2"
            numberOfLines={1}
          >
            {inspection.centre} •{" "}
            {inspection.quantity} kg
          </Text>

        </View>

        {/* Grade */}
        <View className="rounded-full bg-emerald-500/15 px-4 py-2 ml-3">

          <Text className="text-emerald-400 font-bold">
            Grade {inspection.grade}
          </Text>

        </View>

      </View>

      {/* Divider */}
      <View className="h-px bg-slate-800 my-6" />

      {/* Bottom information */}
      <View className="flex-row items-center justify-between">

        <View>
          <Text className="text-slate-500 text-xs uppercase">
            Confidence
          </Text>

          <Text className="text-slate-200 text-lg font-bold mt-1">
            {inspection.confidence}%
          </Text>
        </View>

        <View>
          <Text className="text-slate-500 text-xs uppercase">
            Grade A
          </Text>

          <Text className="text-slate-200 text-lg font-bold mt-1">
            {inspection.gradeAPercentage}%
          </Text>
        </View>

        <Pressable
          onPress={onPress}
          className="active:opacity-70"
        >
          <Text className="text-violet-400 font-semibold">
            View →
          </Text>
        </Pressable>

      </View>

    </View>
  );
}

/* ========================================================================= */
/* WORKFLOW STEP                                                            */
/* ========================================================================= */

function WorkflowStep({
  number,
  title,
  description,
  last = false,
}: {
  number: string;
  title: string;
  description: string;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row ${
        !last
          ? "pb-5 mb-5 border-b border-slate-800"
          : ""
      }`}
    >

      <View className="w-10 h-10 rounded-xl bg-violet-500/15 items-center justify-center mr-4">

        <Text className="text-violet-400 font-bold">
          {number}
        </Text>

      </View>

      <View className="flex-1">

        <Text className="text-slate-200 font-semibold">
          {title}
        </Text>

        <Text className="text-slate-500 text-sm mt-1">
          {description}
        </Text>

      </View>

    </View>
  );
}