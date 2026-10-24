import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import {
  setCapturedImageUri,
  clearCapturedImageUri,
} from "./imageStore";

export default function CaptureScreen() {
  const [permission, requestPermission] =
    useCameraPermissions();

  const [captured, setCaptured] =
    useState(false);

  const [imageUri, setImageUri] =
    useState<string | null>(null);

  const [capturing, setCapturing] =
    useState(false);

  const cameraRef =
    useRef<CameraView | null>(null);

  const {
    centre,
    supplier,
    lotId,
    quantity,
    operator,
  } = useLocalSearchParams<{
    centre?: string;
    supplier?: string;
    lotId?: string;
    quantity?: string;
    operator?: string;
  }>();

  /* ============================================
     CAPTURE IMAGE
     ============================================ */

  const handleCapture = async () => {
    if (!cameraRef.current) {
      Alert.alert(
        "Camera unavailable",
        "Please wait for the camera to load."
      );
      return;
    }

    try {
      setCapturing(true);

      const photo =
        await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });

      if (!photo?.uri) {
        Alert.alert(
          "Capture Failed",
          "The image could not be captured. Please try again."
        );
        return;
      }

      console.log(
        "CAPTURED IMAGE URI:",
        photo.uri
      );

      /*
       * Store image locally in this screen.
       */
      setImageUri(photo.uri);

      /*
       * Store image outside Expo Router.
       *
       * This is important because we do not want
       * to pass the Android file:// URI as a
       * navigation parameter.
       */
      setCapturedImageUri(photo.uri);

      setCaptured(true);

      Alert.alert(
        "Sample Captured",
        "The onion image has been captured successfully."
      );

    } catch (error) {
      console.error(
        "Camera capture error:",
        error
      );

      Alert.alert(
        "Capture Failed",
        "Something went wrong while capturing the image."
      );

    } finally {
      setCapturing(false);
    }
  };

  /* ============================================
     RETAKE IMAGE
     ============================================ */

  const handleRetake = () => {
    /*
     * Clear the stored image first.
     */
    clearCapturedImageUri();

    /*
     * Clear local screen state.
     */
    setCaptured(false);
    setImageUri(null);
  };

  /* ============================================
     ANALYZE IMAGE
     ============================================ */

  const handleAnalyze = () => {
    if (!captured || !imageUri) {
      Alert.alert(
        "Capture Required",
        "Please capture an onion sample first."
      );
      return;
    }

    /*
     * IMPORTANT:
     *
     * We intentionally do NOT pass imageUri
     * through Expo Router.
     *
     * imageStore.ts handles the image URI.
     */

    router.push({
      pathname: "/analysis",
      params: {
        centre: centre ?? "",
        supplier: supplier ?? "",
        lotId: lotId ?? "",
        quantity: quantity ?? "",
        operator: operator ?? "",
      },
    });
  };

  /* ============================================
     CAMERA PERMISSION LOADING
     ============================================ */

  if (!permission) {
    return (
      <View className="flex-1 bg-[#0B1020] items-center justify-center px-6">

        <Text className="text-white text-xl font-bold">
          Loading camera...
        </Text>

      </View>
    );
  }

  /* ============================================
     CAMERA PERMISSION
     ============================================ */

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-[#0B1020] items-center justify-center px-6">

        <Text className="text-white text-2xl font-bold text-center">
          Camera Permission Required
        </Text>

        <Text className="text-slate-400 text-base text-center mt-3">
          OnionGrade needs camera access to capture
          the onion sample.
        </Text>

        <Pressable
          onPress={requestPermission}
          className="mt-6 rounded-2xl bg-violet-600 px-8 py-4"
        >
          <Text className="text-white font-bold text-base">
            Allow Camera Access
          </Text>
        </Pressable>

      </View>
    );
  }

  /* ============================================
     MAIN SCREEN
     ============================================ */

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

        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <View className="mb-6">

          <Text className="text-violet-400 text-sm font-semibold uppercase tracking-wider">
            IMAGE CAPTURE
          </Text>

          <Text className="text-white text-3xl font-bold mt-2">
            Capture Onion Sample
          </Text>

          <Text className="text-slate-400 text-base mt-2">
            Capture a clear image of the onion sample
            for AI-assisted inspection.
          </Text>

        </View>

        {/* ====================================== */}
        {/* ACTIVE PROCUREMENT LOT */}
        {/* ====================================== */}

        <View className="mb-6 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5">

          <Text className="text-violet-300 text-xs font-semibold uppercase tracking-wider">
            Active Procurement Lot
          </Text>

          <Text className="text-white text-xl font-bold mt-2">
            {lotId || "Lot ID unavailable"}
          </Text>

          <Text className="text-slate-300 text-base mt-2">
            {supplier || "Supplier unavailable"}
            {" • "}
            {quantity || "0"} kg
          </Text>

          <Text className="text-slate-400 text-sm mt-2">
            {centre || "Procurement centre unavailable"}
          </Text>

          <Text className="text-slate-500 text-sm mt-1">
            Inspector: {operator || "operator123"}
          </Text>

        </View>

        {/* ====================================== */}
        {/* CAMERA / CAPTURED IMAGE */}
        {/* ====================================== */}

        <View className="rounded-3xl overflow-hidden border border-violet-500/40 bg-[#111827]">

          {!captured ? (

            /* ================================== */
            /* CAMERA */
            /* ================================== */

            <View className="h-96">

              <CameraView
                ref={cameraRef}
                style={{
                  flex: 1,
                }}
                facing="back"
              />

              {/* Camera frame */}

              <View className="absolute inset-6 border-2 border-dashed border-violet-400/70 rounded-3xl" />

              {/* Camera instruction */}

              <View className="absolute bottom-5 left-0 right-0 items-center">

                <View className="rounded-full bg-black/60 px-5 py-3">

                  <Text className="text-white font-semibold">
                    Position onions inside the frame
                  </Text>

                </View>

              </View>

            </View>

          ) : (

            /* ================================== */
            /* CAPTURED IMAGE */
            /* ================================== */

            <View className="h-96">

              <Image
                source={{
                  uri: imageUri!,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="cover"
                onLoad={() => {
                  console.log(
                    "CAPTURE PREVIEW LOADED"
                  );
                }}
                onError={(error) => {
                  console.log(
                    "CAPTURE PREVIEW ERROR:",
                    error.nativeEvent.error
                  );
                }}
              />

              {/* Green frame */}

              <View className="absolute inset-6 border-2 border-emerald-400 rounded-3xl" />

              {/* Captured label */}

              <View className="absolute bottom-5 left-0 right-0 items-center">

                <View className="rounded-full bg-black/70 px-5 py-3">

                  <Text className="text-emerald-400 font-bold">
                    ✓ Sample captured
                  </Text>

                </View>

              </View>

            </View>

          )}

        </View>

        {/* ====================================== */}
        {/* GUIDELINES */}
        {/* ====================================== */}

        <View className="mt-6 rounded-2xl border border-slate-700 bg-[#111827] p-5">

          <Text className="text-white text-lg font-bold mb-5">
            Capture Guidelines
          </Text>

          <Guideline
            title="Good lighting"
            description="Avoid dark shadows and strong glare."
          />

          <Guideline
            title="Keep the camera steady"
            description="Hold the phone parallel to the sample."
          />

          <Guideline
            title="Clear visibility"
            description="Keep the onions clearly visible."
          />

          <Guideline
            title="Avoid obstruction"
            description="Do not cover the onions with your hand."
          />

        </View>

        {/* ====================================== */}
        {/* BUTTONS */}
        {/* ====================================== */}

        {!captured ? (

          /* ================================== */
          /* CAPTURE BUTTON */
          /* ================================== */

          <Pressable
            onPress={handleCapture}
            disabled={capturing}
            className="mt-6 rounded-2xl bg-violet-600 py-5 items-center"
          >

            <Text className="text-white text-lg font-bold">
              {capturing
                ? "Capturing..."
                : "Capture Sample"}
            </Text>

          </Pressable>

        ) : (

          /* ================================== */
          /* ANALYZE + RETAKE */
          /* ================================== */

          <View className="mt-6">

            {/* Analyze */}

            <Pressable
              onPress={handleAnalyze}
              className="rounded-2xl bg-violet-600 py-5 items-center"
            >

              <Text className="text-white text-lg font-bold">
                Analyze Sample →
              </Text>

            </Pressable>

            {/* Retake */}

            <Pressable
              onPress={handleRetake}
              className="mt-3 rounded-2xl border border-slate-700 py-5 items-center"
            >

              <Text className="text-slate-300 text-base font-bold">
                Retake Image
              </Text>

            </Pressable>

          </View>

        )}

      </ScrollView>

    </View>
  );
}

/* ============================================== */
/* GUIDELINE COMPONENT */
/* ============================================== */

function Guideline({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row mb-5">

      {/* Icon */}

      <View className="w-9 h-9 rounded-full bg-emerald-500/20 items-center justify-center mr-4">

        <Text className="text-emerald-400 font-bold">
          ✓
        </Text>

      </View>

      {/* Text */}

      <View className="flex-1">

        <Text className="text-slate-200 font-semibold text-base">
          {title}
        </Text>

        <Text className="text-slate-500 text-sm mt-1">
          {description}
        </Text>

      </View>

    </View>
  );
}