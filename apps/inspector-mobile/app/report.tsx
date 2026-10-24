import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function ReportScreen() {
  const params = useLocalSearchParams<{
    lotId?: string;
    supplier?: string;
    centre?: string;
    quantity?: string;
    operator?: string;

    detection?: string;
    confidence?: string;
    rawPrediction?: string;
    reason?: string;

    grade?: string;
    gradeAPercentage?: string;
    ursPercentage?: string;
    otherPercentage?: string;

    defectStatus?: string;
    sizeStatus?: string;
  }>();

  // =====================================================
  // INSPECTION DETAILS
  // =====================================================

  const lotId =
    params.lotId ||
    "PSF-AP-VSKP-2026-0001";

  const supplier =
    params.supplier ||
    "Supplier not available";

  const centre =
    params.centre ||
    "Visakhapatnam Procurement Centre";

  const quantity =
    params.quantity ||
    "0";

  const operator =
    params.operator ||
    "operator123";


  // =====================================================
  // AI RESULT
  // =====================================================

  const detection =
    params.detection ||
    "Pending";

  const confidence =
    params.confidence ||
    "Pending";

  const rawPrediction =
    params.rawPrediction ||
    "Pending";

  const reason =
    params.reason ||
    "AI image analysis completed.";


  // =====================================================
  // QUALITY ASSESSMENT
  // =====================================================

  const grade =
    params.grade ||
    "Pending";

  const gradeAPercentage =
    params.gradeAPercentage ||
    "Pending";

  const ursPercentage =
    params.ursPercentage ||
    "Pending";

  const otherPercentage =
    params.otherPercentage ||
    "Pending";


  // =====================================================
  // REPORT ID
  // =====================================================

  const reportId =
    `OGA-${new Date().getFullYear()}-${Date.now()
      .toString()
      .slice(-6)}`;


  // =====================================================
  // EXPORT REPORT
  // =====================================================

  const handleExportReport = async () => {
    try {
      if (Platform.OS === "web") {
        window.print();
        return;
      }

      const html = `
        <!DOCTYPE html>

        <html>

          <head>

            <meta charset="UTF-8" />

            <title>
              OnionGrade Quality Assessment Report
            </title>

            <style>

              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                color: #111827;
              }

              h1 {
                margin-bottom: 5px;
              }

              h2 {
                margin-top: 30px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 8px;
              }

              .header {
                border-bottom: 3px solid #7c3aed;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }

              .subtitle {
                color: #6b7280;
              }

              .grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
              }

              .card {
                border: 1px solid #ddd;
                border-radius: 12px;
                padding: 18px;
                margin-top: 12px;
              }

              .label {
                color: #6b7280;
                font-size: 12px;
                text-transform: uppercase;
              }

              .value {
                font-size: 18px;
                font-weight: bold;
                margin-top: 6px;
              }

              .assessment {
                border: 2px solid #f59e0b;
                border-radius: 16px;
                padding: 25px;
                margin-top: 25px;
                text-align: center;
                background: #fffbeb;
              }

              .assessment-title {
                color: #92400e;
                font-weight: bold;
              }

              .grade {
                font-size: 52px;
                font-weight: bold;
                color: #d97706;
                margin-top: 10px;
              }

              .row {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #eee;
              }

              .status {
                color: #d97706;
                font-weight: bold;
              }

              .footer {
                margin-top: 40px;
                color: #6b7280;
                font-size: 12px;
              }

            </style>

          </head>


          <body>

            <div class="header">

              <h1>
                OnionGrade AI
              </h1>

              <div class="subtitle">
                Digital Onion Quality Assessment Report
              </div>

              <div class="subtitle">
                Report ID: ${reportId}
              </div>

            </div>


            <h2>
              Inspection Details
            </h2>


            <div class="grid">

              <div class="card">
                <div class="label">
                  Lot ID
                </div>

                <div class="value">
                  ${lotId}
                </div>
              </div>


              <div class="card">
                <div class="label">
                  Supplier / Farmer Group
                </div>

                <div class="value">
                  ${supplier}
                </div>
              </div>


              <div class="card">
                <div class="label">
                  Procurement Centre
                </div>

                <div class="value">
                  ${centre}
                </div>
              </div>


              <div class="card">
                <div class="label">
                  Quantity
                </div>

                <div class="value">
                  ${quantity} kg
                </div>
              </div>


              <div class="card">
                <div class="label">
                  Inspector
                </div>

                <div class="value">
                  ${operator}
                </div>
              </div>

            </div>


            <h2>
              Sample Verification
            </h2>


            <div class="card">

              <div class="row">

                <span>
                  AI Sample Classification
                </span>

                <strong>
                  ${detection}
                </strong>

              </div>


              <div class="row">

                <span>
                  Detection Confidence
                </span>

                <strong>
                  ${confidence}%
                </strong>

              </div>


              <div class="row">

                <span>
                  Raw Model Output
                </span>

                <strong>
                  ${rawPrediction}
                </strong>

              </div>

            </div>


            <h2>
              External Quality Assessment
            </h2>


            <div class="card">

              <div class="row">

                <span>
                  Visible Rot
                </span>

                <strong class="status">
                  PENDING
                </strong>

              </div>


              <div class="row">

                <span>
                  Sprouting / Visible Roots
                </span>

                <strong class="status">
                  PENDING
                </strong>

              </div>


              <div class="row">

                <span>
                  Skin Damage / Cuts
                </span>

                <strong class="status">
                  PENDING
                </strong>

              </div>


              <div class="row">

                <span>
                  Discoloration
                </span>

                <strong class="status">
                  PENDING
                </strong>

              </div>


              <div class="row">

                <span>
                  Mechanical Damage
                </span>

                <strong class="status">
                  PENDING
                </strong>

              </div>


              <div class="row">

                <span>
                  Skin Loss
                </span>

                <strong class="status">
                  PENDING
                </strong>

              </div>


              <div class="row">

                <span>
                  Abnormal Shape
                </span>

                <strong class="status">
                  PENDING
                </strong>

              </div>


              <div class="row">

                <span>
                  Undersized Bulb
                </span>

                <strong class="status">
                  PENDING
                </strong>

              </div>

            </div>


            <h2>
              Size Assessment
            </h2>


            <div class="card">

              <div class="row">

                <span>
                  Bulb Diameter
                </span>

                <strong class="status">
                  PENDING
                </strong>

              </div>


              <div class="row">

                <span>
                  Size Distribution
                </span>

                <strong class="status">
                  PENDING
                </strong>

              </div>


              <div class="row">

                <span>
                  Undersized Percentage
                </span>

                <strong class="status">
                  PENDING
                </strong>

              </div>

            </div>


            <h2>
              Quality Composition
            </h2>


            <div class="card">

              <div class="row">

                <span>
                  Grade A
                </span>

                <strong>
                  ${gradeAPercentage}%
                </strong>

              </div>


              <div class="row">

                <span>
                  URS
                </span>

                <strong>
                  ${ursPercentage}%
                </strong>

              </div>


              <div class="row">

                <span>
                  Other / Rejected
                </span>

                <strong>
                  ${otherPercentage}%
                </strong>

              </div>

            </div>


            <div class="assessment">

              <div class="assessment-title">
                CURRENT QUALITY ASSESSMENT
              </div>

              <div class="grade">
                ${grade}
              </div>

              <div>
                Final grading will be performed after
                defect and size assessment are available.
              </div>

            </div>


            <h2>
              Assessment Note
            </h2>


            <div class="card">

              <p>
                ${reason}
              </p>

              <p>
                The current prototype performs the
                initial image-based sample analysis.
                External defect detection, size
                estimation and deterministic grading
                are separate quality-assessment stages.
              </p>

            </div>


            <div class="footer">

              OnionGrade AI Prototype —
              Digital Quality Assessment Report.

              <br /><br />

              The report is intended to provide
              traceable computer-vision evidence
              for onion procurement assessment.

            </div>


          </body>

        </html>
      `;


      const result =
        await Print.printToFileAsync({
          html,
        });


      if (
        await Sharing.isAvailableAsync()
      ) {

        await Sharing.shareAsync(
          result.uri,
          {
            mimeType:
              "application/pdf",

            dialogTitle:
              "Share OnionGrade Quality Report",

            UTI:
              "com.adobe.pdf",
          }
        );

      } else {

        Alert.alert(
          "Report Generated",
          "The PDF report was generated successfully."
        );

      }

    } catch (error) {

      console.error(
        "Report generation error:",
        error
      );

      Alert.alert(
        "Report Error",
        "Unable to generate the report. Please try again."
      );

    }
  };


  // =====================================================
  // DASHBOARD
  // =====================================================

  const handleDashboard = () => {

    router.replace(
      "/(tabs)"
    );

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <View
      className="flex-1 bg-[#0B1020]"
    >

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <View
          className="mb-8"
        >

          <Text
            className="text-violet-400 text-sm font-semibold uppercase tracking-wider"
          >
            DIGITAL REPORT
          </Text>


          <Text
            className="text-white text-3xl font-bold mt-2"
          >
            Onion Quality Assessment
          </Text>


          <Text
            className="text-slate-400 text-base mt-2 leading-6"
          >
            AI-assisted external quality inspection
            for procurement assessment.
          </Text>

        </View>


        {/* =================================================
            REPORT STATUS
        ================================================= */}

        <View
          className="rounded-3xl border border-violet-500/40 bg-violet-500/10 p-6"
        >

          <View
            className="flex-row items-center justify-between"
          >

            <View>

              <Text
                className="text-slate-400 text-xs font-semibold"
              >
                REPORT ID
              </Text>


              <Text
                className="text-white text-lg font-bold mt-2"
              >
                {reportId}
              </Text>

            </View>


            <View
              className="rounded-full bg-violet-500/20 px-4 py-2"
            >

              <Text
                className="text-violet-300 font-bold"
              >
                IN REVIEW
              </Text>

            </View>

          </View>

        </View>


        {/* =================================================
            INSPECTION DETAILS
        ================================================= */}

        <View
          className="mt-7"
        >

          <Text
            className="text-white text-xl font-bold mb-4"
          >
            Inspection Details
          </Text>


          <View
            className="rounded-3xl border border-slate-700 bg-[#111827] p-6"
          >

            <DetailRow
              label="Lot ID"
              value={lotId}
            />


            <DetailRow
              label="Supplier / Farmer Group"
              value={supplier}
            />


            <DetailRow
              label="Procurement Centre"
              value={centre}
            />


            <DetailRow
              label="Quantity"
              value={`${quantity} kg`}
            />


            <DetailRow
              label="Inspector"
              value={operator}
              last
            />

          </View>

        </View>


        {/* =================================================
            SAMPLE VERIFICATION
        ================================================= */}

        <View
          className="mt-7"
        >

          <Text
            className="text-white text-xl font-bold mb-4"
          >
            Sample Verification
          </Text>


          <View
            className="rounded-3xl border border-slate-700 bg-[#111827] p-6"
          >

            <DetailRow
              label="AI Sample Classification"
              value={detection}
              valueClass={
                detection === "ONION"
                  ? "text-emerald-400"
                  : "text-amber-400"
              }
            />


            <DetailRow
              label="Detection Confidence"
              value={`${confidence}%`}
            />


            <DetailRow
              label="Raw Model Output"
              value={rawPrediction}
              last
            />

          </View>

        </View>


        {/* =================================================
            QUALITY ASSESSMENT
        ================================================= */}

        <View
          className="mt-7"
        >

          <Text
            className="text-white text-xl font-bold mb-2"
          >
            Quality Assessment
          </Text>


          <Text
            className="text-slate-500 text-sm mb-4 leading-5"
          >
            Visible external characteristics that
            contribute to onion quality classification.
          </Text>


          <View
            className="rounded-3xl border border-slate-700 bg-[#111827] p-6"
          >

            <AssessmentRow
              title="Visible Rot"
              description="External signs of rotting or decay"
            />


            <AssessmentRow
              title="Sprouting / Visible Roots"
              description="Visible sprouts or root growth"
            />


            <AssessmentRow
              title="Skin Damage / Cuts"
              description="Cuts, cracks or exposed tissue"
            />


            <AssessmentRow
              title="Discoloration"
              description="Abnormal colour or visible spots"
            />


            <AssessmentRow
              title="Mechanical Damage"
              description="Bruising or handling damage"
            />


            <AssessmentRow
              title="Skin Loss"
              description="Missing or damaged outer skin"
            />


            <AssessmentRow
              title="Abnormal Shape"
              description="Irregular bulb shape"
            />


            <AssessmentRow
              title="Undersized Bulb"
              description="Bulbs below configured size threshold"
              last
            />

          </View>

        </View>


        {/* =================================================
            SIZE ASSESSMENT
        ================================================= */}

        <View
          className="mt-7"
        >

          <Text
            className="text-white text-xl font-bold mb-2"
          >
            Size Assessment
          </Text>


          <Text
            className="text-slate-500 text-sm mb-4"
          >
            Measurements required for lot-level grading.
          </Text>


          <View
            className="rounded-3xl border border-slate-700 bg-[#111827] p-6"
          >

            <AssessmentRow
              title="Bulb Diameter"
              description="Estimated diameter of detected bulbs"
            />


            <AssessmentRow
              title="Size Distribution"
              description="Distribution of bulbs across size ranges"
            />


            <AssessmentRow
              title="Undersized Percentage"
              description="Percentage of bulbs below threshold"
              last
            />

          </View>

        </View>


        {/* =================================================
            FINAL ASSESSMENT
        ================================================= */}

        <View
          className="mt-7"
        >

          <Text
            className="text-white text-xl font-bold mb-4"
          >
            Final Quality Assessment
          </Text>


          <View
            className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-8 items-center"
          >

            <Text
              className="text-amber-400 text-sm font-bold"
            >
              CURRENT STATUS
            </Text>


            <Text
              className="text-amber-300 text-6xl font-bold mt-3"
            >
              {grade}
            </Text>


            <View
              className="rounded-full bg-amber-500/20 px-5 py-3 mt-4"
            >

              <Text
                className="text-amber-300 font-bold"
              >
                GRADING PENDING
              </Text>

            </View>


            <Text
              className="text-slate-400 text-sm text-center mt-5 leading-6"
            >
              Final Grade A / URS / Other-Reject
              percentages require the defect and
              size assessment stages.
            </Text>

          </View>

        </View>


        {/* =================================================
            QUALITY COMPOSITION
        ================================================= */}

        <View
          className="mt-7"
        >

          <Text
            className="text-white text-xl font-bold mb-4"
          >
            Quality Composition
          </Text>


          <View
            className="rounded-3xl border border-slate-700 bg-[#111827] p-6"
          >

            <DetailRow
              label="Grade A"
              value={`${gradeAPercentage}%`}
              valueClass="text-emerald-400"
            />


            <DetailRow
              label="URS"
              value={`${ursPercentage}%`}
              valueClass="text-amber-400"
            />


            <DetailRow
              label="Other / Reject"
              value={`${otherPercentage}%`}
              valueClass="text-red-400"
              last
            />

          </View>

        </View>


        {/* =================================================
            FINDINGS
        ================================================= */}

        <View
          className="mt-7"
        >

          <Text
            className="text-white text-xl font-bold mb-4"
          >
            Findings
          </Text>


          <View
            className="rounded-3xl border border-slate-700 bg-[#111827] p-6"
          >

            <FindingRow
              title="Image Quality"
              description="Image successfully received and processed."
            />


            <FindingRow
              title="Sample Verification"
              description={
                detection === "ONION"
                  ? "The AI model classified the sample as an onion."
                  : "The current AI model did not classify the sample as an onion."
              }
            />


            <FindingRow
              title="Visible Quality Defects"
              description="Rot, sprouting, roots, cuts, discoloration, mechanical damage and skin loss assessment are pending."
            />


            <FindingRow
              title="Size Assessment"
              description="Bulb diameter, size distribution and undersized percentage assessment are pending."
              last
            />

          </View>

        </View>


        {/* =================================================
            EVIDENCE TRAIL
        ================================================= */}

        <View
          className="mt-7"
        >

          <Text
            className="text-white text-xl font-bold mb-4"
          >
            Evidence Trail
          </Text>


          <View
            className="rounded-3xl border border-slate-700 bg-[#111827] p-6 flex-row flex-wrap"
          >

            <EvidenceTag
              text="Sample Captured"
            />


            <EvidenceTag
              text="Image QA Passed"
            />


            <EvidenceTag
              text="AI Analysis Complete"
            />


            <EvidenceTag
              text="Defect Analysis Pending"
            />


            <EvidenceTag
              text="Size Assessment Pending"
            />


            <EvidenceTag
              text="Grading Pending"
            />

          </View>

        </View>


        {/* =================================================
            IMPORTANT NOTE
        ================================================= */}

        <View
          className="mt-7 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5"
        >

          <Text
            className="text-amber-300 font-bold"
          >
            Assessment Status
          </Text>


          <Text
            className="text-slate-400 text-sm leading-6 mt-2"
          >
            The current prototype has completed the
            initial image analysis stage. Visible defect
            detection, size estimation and rule-based
            grading are separate stages that are still
            under development.
          </Text>

        </View>


        {/* =================================================
            EXPORT
        ================================================= */}

        <Pressable
          onPress={
            handleExportReport
          }
          className="mt-7 rounded-2xl bg-violet-600 py-5 items-center active:opacity-80"
        >

          <Text
            className="text-white text-lg font-bold"
          >
            Generate Quality Report →
          </Text>

        </Pressable>


        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Pressable
          onPress={
            handleDashboard
          }
          className="mt-4 rounded-2xl border border-slate-700 bg-[#111827] py-5 items-center active:opacity-80"
        >

          <Text
            className="text-white text-base font-bold"
          >
            Return to Dashboard
          </Text>

        </Pressable>


      </ScrollView>

    </View>

  );
}


// =====================================================
// DETAIL ROW
// =====================================================

function DetailRow({
  label,
  value,
  valueClass = "text-slate-200",
  last = false,
}: {
  label: string;
  value: string;
  valueClass?: string;
  last?: boolean;
}) {

  return (

    <View
      className={`py-4 ${
        !last
          ? "border-b border-slate-800"
          : ""
      }`}
    >

      <Text
        className="text-slate-500 text-xs font-semibold uppercase"
      >
        {label}
      </Text>


      <Text
        className={`text-base font-semibold mt-2 ${valueClass}`}
      >
        {value}
      </Text>

    </View>

  );
}


// =====================================================
// QUALITY ASSESSMENT ROW
// =====================================================

function AssessmentRow({
  title,
  description,
  last = false,
}: {
  title: string;
  description: string;
  last?: boolean;
}) {

  return (

    <View
      className={`py-4 ${
        !last
          ? "border-b border-slate-800"
          : ""
      }`}
    >

      <View
        className="flex-row items-center justify-between"
      >

        <Text
          className="text-slate-200 text-base font-semibold flex-1 pr-3"
        >
          {title}
        </Text>


        <View
          className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1"
        >

          <Text
            className="text-amber-400 text-xs font-bold"
          >
            PENDING
          </Text>

        </View>

      </View>


      <Text
        className="text-slate-500 text-sm mt-2 leading-5"
      >
        {description}
      </Text>

    </View>

  );
}


// =====================================================
// FINDING ROW
// =====================================================

function FindingRow({
  title,
  description,
  last = false,
}: {
  title: string;
  description: string;
  last?: boolean;
}) {

  return (

    <View
      className={`py-4 ${
        !last
          ? "border-b border-slate-800"
          : ""
      }`}
    >

      <Text
        className="text-slate-400 text-sm font-semibold"
      >
        {title}
      </Text>


      <Text
        className="text-slate-200 text-sm mt-2 leading-5"
      >
        {description}
      </Text>

    </View>

  );
}


// =====================================================
// EVIDENCE TAG
// =====================================================

function EvidenceTag({
  text,
}: {
  text: string;
}) {

  return (

    <View
      className="rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-2 mr-2 mb-2"
    >

      <Text
        className="text-violet-300 text-xs font-semibold"
      >
        {text}
      </Text>

    </View>

  );
}