import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { fetch as expoFetch } from "expo/fetch";
import { File } from "expo-file-system";

import { getCapturedImageUri } from "./imageStore";


// =====================================================
// BACKEND
// =====================================================

const BACKEND_URL = "http://192.168.1.13:8000";


// =====================================================
// TYPES
// =====================================================

type AnalysisResult = {
  success: boolean;
  is_onion: boolean;
  label?: string;
  confidence: number;
  raw_prediction?: number;
  reason: string;
};


// =====================================================
// MAIN SCREEN
// =====================================================

export default function AnalysisScreen() {

  const [progress, setProgress] = useState(0);

  const [currentStep, setCurrentStep] =
    useState(0);

  const [complete, setComplete] =
    useState(false);

  const [isOnion, setIsOnion] =
    useState<boolean | null>(null);

  const [backendResult, setBackendResult] =
    useState<AnalysisResult | null>(null);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [imageUri, setImageUri] =
    useState<string | null>(null);


  const params =
    useLocalSearchParams<{
      centre?: string;
      supplier?: string;
      lotId?: string;
      quantity?: string;
      operator?: string;
      imageUri?: string;
    }>();


  // ===================================================
  // START
  // ===================================================

  useEffect(() => {

    const storedImage =
      getCapturedImageUri();

    const finalImage =
      storedImage ||
      params.imageUri ||
      null;

    console.log(
      "ANALYSIS IMAGE:",
      finalImage
    );

    setImageUri(finalImage);

    if (!finalImage) {

      Alert.alert(
        "No Image",
        "No captured image was found.",
        [
          {
            text: "OK",
            onPress: () =>
              router.back(),
          },
        ]
      );

      return;
    }

    startAnalysis(finalImage);

  }, []);


  // ===================================================
  // ANALYSIS
  // ===================================================

  const startAnalysis =
    async (uri: string) => {

      if (analyzing) {
        return;
      }

      setAnalyzing(true);

      setProgress(0);

      setCurrentStep(0);

      setComplete(false);

      setIsOnion(null);

      setBackendResult(null);


      try {

        // =============================================
        // STEP 1
        // =============================================

        setCurrentStep(1);

        setProgress(20);

        await delay(500);


        // =============================================
        // STEP 2
        // ONION DETECTION
        // =============================================

        setCurrentStep(2);

        setProgress(40);


        console.log(
          "================================="
        );

        console.log(
          "STARTING ONION DETECTION"
        );

        console.log(
          "Platform:",
          Platform.OS
        );

        console.log(
          "Image:",
          uri
        );

        console.log(
          "Backend:",
          BACKEND_URL
        );

        console.log(
          "================================="
        );


        let result: AnalysisResult;


        // =============================================
        // WEB
        // =============================================

        if (Platform.OS === "web") {

          console.log(
            "Using WEB upload"
          );


          const imageResponse =
            await fetch(uri);


          if (!imageResponse.ok) {

            throw new Error(
              "Could not read the captured image."
            );

          }


          const blob =
            await imageResponse.blob();


          if (!blob.size) {

            throw new Error(
              "Captured image is empty."
            );

          }


          console.log(
            "Browser image size:",
            blob.size
          );


          console.log(
            "Browser image type:",
            blob.type
          );


          const formData =
            new FormData();


          formData.append(
            "file",
            blob,
            "onion-sample.jpg"
          );


          console.log(
            "Sending browser image to backend..."
          );


          const response =
            await fetch(
              `${BACKEND_URL}/analyze`,
              {
                method: "POST",
                body: formData,
              }
            );


          console.log(
            "Backend status:",
            response.status
          );


          if (!response.ok) {

            const errorText =
              await response.text();

            throw new Error(
              `Backend returned HTTP ${response.status}: ${errorText}`
            );

          }


          result =
            await response.json();

        }


        // =============================================
        // ANDROID / IOS
        // =============================================

        else {

          console.log(
            "Using NATIVE upload"
          );


          const file =
            new File(uri);


          console.log(
            "File exists:",
            file.exists
          );


          console.log(
            "File size:",
            file.size
          );


          console.log(
            "File type:",
            file.type
          );


          if (!file.exists) {

            throw new Error(
              "Captured image file was not found."
            );

          }


          if (!file.size || file.size <= 0) {

            throw new Error(
              "Captured image file is empty."
            );

          }


          const formData =
            new FormData();


          formData.append(
            "file",
            file as any
          );


          console.log(
            "Sending native image to backend..."
          );


          const response =
            await expoFetch(
              `${BACKEND_URL}/analyze`,
              {
                method: "POST",
                body: formData,
              }
            );


          console.log(
            "Backend status:",
            response.status
          );


          if (!response.ok) {

            const errorText =
              await response.text();

            throw new Error(
              `Backend returned HTTP ${response.status}: ${errorText}`
            );

          }


          result =
            await response.json();

        }


        // =============================================
        // RESULT
        // =============================================

        console.log(
          "================================="
        );

        console.log(
          "AI RESULT:",
          result
        );

        console.log(
          "================================="
        );


        if (!result || !result.success) {

          throw new Error(
            result?.reason ||
            "AI analysis failed."
          );

        }


        setBackendResult(result);

        setIsOnion(
          result.is_onion
        );


        await delay(700);


        // =============================================
        // IF NOT ONION
        // =============================================

        if (!result.is_onion) {

          setProgress(40);

          setCurrentStep(2);

          setComplete(true);

          setAnalyzing(false);

          return;
        }


        // =============================================
        // STEP 3
        // VISIBLE DEFECTS
        // =============================================

        setCurrentStep(3);

        setProgress(60);

        await delay(700);


        // =============================================
        // STEP 4
        // SIZE
        // =============================================

        setCurrentStep(4);

        setProgress(80);

        await delay(700);


        // =============================================
        // STEP 5
        // QUALITY CLASSIFICATION
        // =============================================

        setCurrentStep(5);

        setProgress(100);

        await delay(500);


        setComplete(true);

        setAnalyzing(false);

      } catch (error) {

        console.error(
          "================================="
        );

        console.error(
          "ANALYSIS ERROR:",
          error
        );

        console.error(
          "================================="
        );


        setAnalyzing(false);


        const message =
          error instanceof Error
            ? error.message
            : String(error);


        Alert.alert(
          "Analysis Error",
          message
        );

      }

    };


  // ===================================================
  // GENERATE QUALITY REPORT
  // ===================================================

  const handleGenerateReport =
    () => {

      if (!backendResult) {

        Alert.alert(
          "Analysis Not Complete",
          "Please wait for the AI analysis to finish."
        );

        return;
      }


      router.push({
        pathname: "/report",

        params: {

          centre:
            String(
              params.centre ?? ""
            ),

          supplier:
            String(
              params.supplier ?? ""
            ),

          lotId:
            String(
              params.lotId ?? ""
            ),

          quantity:
            String(
              params.quantity ?? ""
            ),

          operator:
            String(
              params.operator ?? ""
            ),

          detection:
            String(
              backendResult.label ??
              (
                backendResult.is_onion
                  ? "ONION"
                  : "NOT ONION"
              )
            ),

          confidence:
            String(
              backendResult.confidence
            ),

          rawPrediction:
            String(
              backendResult.raw_prediction ??
              ""
            ),

          reason:
            String(
              backendResult.reason ??
              ""
            ),

          defectStatus:
            "Pending",

          sizeStatus:
            "Pending",

          grade:
            "Pending",

          gradeAPercentage:
            "Pending",

          ursPercentage:
            "Pending",

          otherPercentage:
            "Pending",
        },

      });

    };


  // ===================================================
  // VIEW RESULT
  // ===================================================

  const handleViewResult =
    () => {

      if (!backendResult) {
        return;
      }


      handleGenerateReport();

    };


  // ===================================================
  // UI
  // ===================================================

  return (

    <View
      className="flex-1 bg-[#0B1020]"
    >

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 50,
        }}
        showsVerticalScrollIndicator={false}
      >


        {/* ============================================
            HEADER
        ============================================ */}

        <View
          className="mb-7"
        >

          <Text
            className="text-violet-400 text-sm font-semibold uppercase tracking-wider"
          >
            AI INSPECTION
          </Text>


          <Text
            className="text-white text-3xl font-bold mt-2"
          >
            Analyzing Sample
          </Text>


          <Text
            className="text-slate-400 text-base mt-2"
          >
            Our inspection engine is analyzing
            the captured onion sample.
          </Text>

        </View>


        {/* ============================================
            ACTIVE LOT
        ============================================ */}

        <View
          className="mb-6 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5"
        >

          <Text
            className="text-violet-300 text-xs font-semibold uppercase tracking-wider"
          >
            Active Procurement Lot
          </Text>


          <Text
            className="text-white text-xl font-bold mt-2"
          >
            {params.lotId ||
              "Lot ID unavailable"}
          </Text>


          <Text
            className="text-slate-300 text-base mt-2"
          >
            {params.supplier ||
              "Supplier unavailable"}

            {" • "}

            {params.quantity ||
              "0"}{" "}
            kg
          </Text>


          <Text
            className="text-slate-400 text-sm mt-2"
          >
            {params.centre ||
              "Procurement centre unavailable"}
          </Text>


          <Text
            className="text-slate-500 text-sm mt-1"
          >
            Inspector:{" "}
            {params.operator ||
              "operator123"}
          </Text>

        </View>


        {/* ============================================
            IMAGE
        ============================================ */}

        <View
          className="rounded-3xl border border-violet-500/40 bg-[#111827] overflow-hidden"
        >

          {imageUri ? (

            <View
              className="relative"
            >

              <Image
                source={{
                  uri: imageUri,
                }}
                className="w-full h-80"
                resizeMode="cover"
              />


              <View
                className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-3"
              >

                <Text
                  className="text-emerald-400 font-bold"
                >
                  ✓ Sample image loaded
                </Text>

              </View>

            </View>

          ) : (

            <View
              className="h-80 items-center justify-center"
            >

              <Text
                className="text-white text-lg font-bold"
              >
                No Image Available
              </Text>


              <Text
                className="text-slate-500 mt-2"
              >
                Captured image was not
                passed to analysis.
              </Text>

            </View>

          )}

        </View>


        {/* ============================================
            PROGRESS
        ============================================ */}

        <View
          className="mt-7"
        >

          <View
            className="flex-row justify-between mb-3"
          >

            <Text
              className="text-slate-300 font-semibold"
            >
              Analysis Progress
            </Text>


            <Text
              className="text-violet-400 font-bold"
            >
              {progress}%
            </Text>

          </View>


          <View
            className="h-3 rounded-full bg-slate-800 overflow-hidden"
          >

            <View
              className="h-full bg-violet-600 rounded-full"
              style={{
                width:
                  `${progress}%`,
              }}
            />

          </View>


          <Text
            className="text-slate-500 text-sm mt-3"
          >
            {analyzing
              ? "Analyzing sample..."
              : complete
              ? isOnion
                ? "Analysis completed."
                : "Image was processed by the AI model."
              : "Preparing analysis..."}
          </Text>

        </View>


        {/* ============================================
            PIPELINE
        ============================================ */}

        <View
          className="mt-7 rounded-2xl border border-slate-700 bg-[#111827] p-5"
        >

          <Text
            className="text-white text-lg font-bold mb-6"
          >
            Inspection Pipeline
          </Text>


          <AnalysisStep
            title="Image Quality Check"
            description="Checking lighting, blur and visibility"
            active={currentStep >= 1}
            completed={currentStep > 1}
          />


          <AnalysisStep
            title="Onion Detection"
            description="Identifying individual onion bulbs"
            active={currentStep >= 2}
            completed={
              complete &&
              isOnion === true
            }
            failed={
              complete &&
              currentStep === 2 &&
              isOnion === false
            }
          />


          <AnalysisStep
            title="Visible Defect Detection"
            description="Checking for rot, sprouting and skin damage"
            active={
              currentStep >= 3 &&
              isOnion === true
            }
            completed={false}
          />


          <AnalysisStep
            title="Size Assessment"
            description="Estimating bulb size and undersized samples"
            active={
              currentStep >= 4 &&
              isOnion === true
            }
            completed={false}
          />


          <AnalysisStep
            title="Quality Classification"
            description="Preparing deterministic grading inputs"
            active={
              currentStep >= 5 &&
              isOnion === true
            }
            completed={false}
            last
          />

        </View>


        {/* ============================================
            AI RESULT
        ============================================ */}

        {backendResult && (

          <View
            className={`mt-6 rounded-2xl border p-5 ${
              backendResult.is_onion
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-red-500/40 bg-red-500/10"
            }`}
          >

            <Text
              className={`text-lg font-bold ${
                backendResult.is_onion
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >

              {backendResult.is_onion
                ? "✓ Onion Detected"
                : "✕ Image Not Classified as Onion"}

            </Text>


            <Text
              className="text-slate-300 text-sm mt-3"
            >
              Detection Confidence:{" "}
              {String(
                backendResult.confidence
              )}
              %
            </Text>


            {backendResult.raw_prediction !==
              undefined && (

              <Text
                className="text-slate-500 text-sm mt-2"
              >
                Raw Model Output:{" "}
                {String(
                  backendResult.raw_prediction
                )}
              </Text>

            )}


            <View
              className="mt-4 rounded-xl bg-black/20 p-4"
            >

              <Text
                className="text-slate-300 text-sm leading-6"
              >
                {String(
                  backendResult.reason ??
                  "AI analysis completed."
                )}
              </Text>

            </View>

          </View>

        )}


        {/* ============================================
            NOT ONION
        ============================================ */}

        {complete &&
          isOnion === false && (

          <View
            className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-5"
          >

            <Text
              className="text-red-400 text-lg font-bold"
            >
              Image Review Required
            </Text>


            <Text
              className="text-slate-400 text-sm mt-2 leading-6"
            >
              The current detection model did
              not classify this image as an onion.
              Defect and size assessment were
              therefore not continued.
            </Text>


            <Pressable
              onPress={() =>
                router.back()
              }
              className="mt-5 rounded-2xl border border-red-500/40 bg-red-500/10 py-4 items-center"
            >

              <Text
                className="text-red-300 font-bold"
              >
                Capture Another Sample
              </Text>

            </Pressable>

          </View>

        )}


        {/* ============================================
            SUCCESS
        ============================================ */}

        {complete &&
          isOnion === true && (

          <View
            className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5"
          >

            <Text
              className="text-emerald-400 text-lg font-bold"
            >
              Analysis Complete
            </Text>


            <Text
              className="text-slate-400 text-sm mt-2 leading-6"
            >
              Onion detected successfully.
              The sample is ready for the
              quality assessment report.
            </Text>

          </View>

        )}


        {/* ============================================
            GENERATE REPORT
        ============================================ */}

        {complete && (

          <Pressable
            onPress={
              handleGenerateReport
            }
            className="mt-6 rounded-2xl bg-violet-600 py-5 items-center active:opacity-80"
          >

            <Text
              className="text-white text-lg font-bold"
            >
              Generate Quality Report →
            </Text>

          </Pressable>

        )}


        {/* ============================================
            BACK
        ============================================ */}

        <Pressable
          onPress={() =>
            router.back()
          }
          className="mt-4 rounded-2xl border border-slate-700 bg-[#111827] py-4 items-center"
        >

          <Text
            className="text-slate-300 font-bold"
          >
            Back
          </Text>

        </Pressable>


      </ScrollView>

    </View>
  );
}


// =====================================================
// PIPELINE STEP
// =====================================================

function AnalysisStep({
  title,
  description,
  active,
  completed,
  failed = false,
  last = false,
}: {
  title: string;
  description: string;
  active: boolean;
  completed: boolean;
  failed?: boolean;
  last?: boolean;
}) {

  let circleClass =
    "bg-slate-800";

  let iconClass =
    "text-slate-500";

  let titleClass =
    "text-slate-500";

  let statusClass =
    "text-slate-600";

  let statusText =
    "PENDING";


  if (failed) {

    circleClass =
      "bg-red-500/20";

    iconClass =
      "text-red-400";

    titleClass =
      "text-red-300";

    statusClass =
      "text-red-400";

    statusText =
      "NOT DETECTED";

  } else if (completed) {

    circleClass =
      "bg-emerald-500/20";

    iconClass =
      "text-emerald-400";

    titleClass =
      "text-slate-200";

    statusClass =
      "text-emerald-400";

    statusText =
      "COMPLETED";

  } else if (active) {

    circleClass =
      "bg-violet-500/20";

    iconClass =
      "text-violet-400";

    titleClass =
      "text-slate-200";

    statusClass =
      "text-violet-400";

    statusText =
      "PROCESSING";
  }


  return (

    <View
      className="flex-row"
    >

      <View
        className="items-center mr-4"
      >

        <View
          className={`w-9 h-9 rounded-full items-center justify-center ${circleClass}`}
        >

          <Text
            className={`font-bold ${iconClass}`}
          >
            {failed
              ? "✕"
              : completed
              ? "✓"
              : active
              ? "●"
              : "○"}
          </Text>

        </View>


        {!last && (

          <View
            className="w-px flex-1 bg-slate-700 my-1"
          />

        )}

      </View>


      <View
        className={`flex-1 ${
          last
            ? "pb-1"
            : "pb-6"
        }`}
      >

        <Text
          className={`text-base font-semibold ${titleClass}`}
        >
          {title}
        </Text>


        <Text
          className="text-slate-500 text-sm mt-1"
        >
          {description}
        </Text>


        <Text
          className={`text-xs font-bold mt-2 ${statusClass}`}
        >
          {statusText}
        </Text>

      </View>

    </View>

  );
}


// =====================================================
// DELAY
// =====================================================

function delay(
  milliseconds: number
) {

  return new Promise(
    (resolve) => {

      setTimeout(
        resolve,
        milliseconds
      );

    }
  );

}