from io import BytesIO
from pathlib import Path
import io

import numpy as np
import tensorflow as tf
from PIL import Image
from ultralytics import YOLO
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="OnionGrade AI Backend",
    description="AI-assisted onion quality assessment backend",
    version="3.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# MODEL LOADING
# ============================================================

MODEL_PATH = (
    Path(__file__).resolve().parent / "onion_classifier.keras"
)

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("OnionGrade AI model loaded successfully.")
except Exception as error:
    model = None
    print("ERROR loading AI model:", error)


# Experimental YOLO visible-defect detector
DEFECT_MODEL_PATH = (
    Path(__file__).resolve().parent
    / "models"
    / "defect_model.pt"
)

try:
    defect_model = YOLO(str(DEFECT_MODEL_PATH))
    print("YOLO defect model loaded successfully:", defect_model.names)
except Exception as error:
    defect_model = None
    print("ERROR loading YOLO defect model:", error)


# ============================================================
# BASIC ROUTES
# ============================================================

@app.get("/")
def root():
    return {
        "message": "OnionGrade AI backend is running",
        "status": "ok",
        "model": "MobileNetV2",
        "version": "3.0.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "defect_model_loaded": defect_model is not None,
    }


# ============================================================
# IMAGE QUALITY CHECK
# ============================================================

def calculate_image_quality(image: Image.Image):

    rgb = image.convert("RGB")

    width, height = rgb.size

    image_array = np.asarray(
        rgb
    ).astype(np.float32)

    gray = (
        0.299 * image_array[:, :, 0]
        + 0.587 * image_array[:, :, 1]
        + 0.114 * image_array[:, :, 2]
    )

    # Brightness
    brightness = float(
        np.mean(gray)
    )

    # Contrast
    contrast = float(
        np.std(gray)
    )

    # Simple sharpness estimation
    horizontal_gradient = np.diff(
        gray,
        axis=1
    )

    vertical_gradient = np.diff(
        gray,
        axis=0
    )

    sharpness = float(
        (
            np.var(horizontal_gradient)
            + np.var(vertical_gradient)
        )
        / 2
    )

    # Basic thresholds
    brightness_ok = (
        brightness >= 40
        and brightness <= 220
    )

    contrast_ok = (
        contrast >= 20
    )

    sharpness_ok = (
        sharpness >= 20
    )

    resolution_ok = (
        width >= 300
        and height >= 300
    )

    checks = {

        "brightness": {
            "value": round(
                brightness,
                2
            ),
            "status":
                "PASS"
                if brightness_ok
                else "REVIEW",
        },

        "contrast": {
            "value": round(
                contrast,
                2
            ),
            "status":
                "PASS"
                if contrast_ok
                else "REVIEW",
        },

        "sharpness": {
            "value": round(
                sharpness,
                2
            ),
            "status":
                "PASS"
                if sharpness_ok
                else "REVIEW",
        },

        "resolution": {
            "width": width,
            "height": height,
            "status":
                "PASS"
                if resolution_ok
                else "REVIEW",
        },
    }

    overall_pass = all(
        [
            brightness_ok,
            contrast_ok,
            sharpness_ok,
            resolution_ok,
        ]
    )

    if overall_pass:

        overall_status = "PASS"

        message = (
            "Image quality is suitable for "
            "further visual inspection."
        )

    else:

        overall_status = "REVIEW"

        message = (
            "Image quality may affect inspection. "
            "Please review lighting, sharpness "
            "or framing."
        )

    return {
        "status": overall_status,
        "message": message,
        "checks": checks,
    }


# ============================================================
# ONION DETECTION
# ============================================================

def detect_onion(image_bytes: bytes):

    if model is None:
        raise RuntimeError(
            "AI model is not loaded."
        )

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    image = image.resize(
        (224, 224)
    )

    image_array = np.asarray(
        image,
        dtype=np.float32,
    )

    image_array = np.expand_dims(
        image_array,
        axis=0,
    )

    prediction = model.predict(
        image_array,
        verbose=0,
    )[0][0]

    prediction = float(
        prediction
    )

    print(
        f"RAW MODEL PREDICTION: "
        f"{prediction:.4f}"
    )

    if prediction >= 0.5:

        is_onion = True

        confidence = (
            prediction * 100
        )

        label = "ONION"

    else:

        is_onion = False

        confidence = (
            (1 - prediction) * 100
        )

        label = "NOT ONION"

    return {

        "is_onion":
            is_onion,

        "label":
            label,

        "confidence":
            round(
                confidence,
                2
            ),

        "raw_prediction":
            round(
                prediction,
                4
            ),
    }


# ============================================================
# EXPERIMENTAL VISIBLE-DEFECT DETECTION
# ============================================================

def detect_visible_defects(image: Image.Image) -> dict:
    """
    Detect visible cuts, rot, and sprouts.
    Results are experimental and must be reviewed by a person.
    """
    if defect_model is None:
        return {
            "model_status": "unavailable",
            "review_required": True,
            "detection_count": 0,
            "detections": [],
            "message": "YOLO defect model is not loaded.",
        }

    try:
        results = defect_model.predict(
            source=image.convert("RGB"),
            conf=0.25,
            iou=0.30,
            max_det=20,
            verbose=False,
        )

        detections = []
        defect_type_names = {
            "cuts": "cuts",
            "rotten": "rot",
            "sprout": "sprouting",
        }

        for result in results:
            if result.boxes is None:
                continue

            for box in result.boxes:
                class_id = int(box.cls[0].item())
                confidence = float(box.conf[0].item())
                class_name = defect_model.names[class_id]
                bbox = box.xyxy[0].tolist()

                detections.append({
                    "class": class_name,
                    "defect_type": defect_type_names.get(
                        class_name, class_name
                    ),
                    "confidence": round(confidence, 4),
                    "bbox": [
                        round(float(value), 2)
                        for value in bbox
                    ],
                    "status": "REQUIRES_REVIEW",
                })

        return {
            "model_status": "experimental",
            "review_required": True,
            "detection_count": len(detections),
            "detections": detections,
        }

    except Exception as error:
        print("YOLO DEFECT DETECTION ERROR:", str(error))
        return {
            "model_status": "error",
            "review_required": True,
            "detection_count": 0,
            "detections": [],
            "error": str(error),
        }


# ============================================================
# STRUCTURED QUALITY EVIDENCE
# ============================================================

def create_quality_evidence():

    return {

        "visible_defects": {

            "rot": {
                "status": "PENDING",
                "confidence": None,
            },

            "sprouting": {
                "status": "PENDING",
                "confidence": None,
            },

            "visible_roots": {
                "status": "PENDING",
                "confidence": None,
            },

            "skin_damage": {
                "status": "PENDING",
                "confidence": None,
            },

            "discoloration": {
                "status": "PENDING",
                "confidence": None,
            },

            "mechanical_damage": {
                "status": "PENDING",
                "confidence": None,
            },

            "skin_loss": {
                "status": "PENDING",
                "confidence": None,
            },

            "abnormal_shape": {
                "status": "PENDING",
                "confidence": None,
            },
        },

        "size_assessment": {

            "diameter_mm": None,

            "undersized":
                "PENDING",

            "status":
                "PENDING",

            "measurable":
                False,
        },

        "grading": {

            "grade":
                "PENDING",

            "grade_a_percentage":
                None,

            "urs_percentage":
                None,

            "other_percentage":
                None,

            "rule_version":
                None,

            "status":
                "PENDING",
        },
    }


# ============================================================
# COMPLETE IMAGE ANALYSIS
# ============================================================

def analyze_image(image_bytes: bytes):

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    # --------------------------------------------------------
    # IMAGE QUALITY
    # --------------------------------------------------------

    image_quality = calculate_image_quality(
        image
    )

    # --------------------------------------------------------
    # ONION DETECTION
    # --------------------------------------------------------

    onion_result = detect_onion(
        image_bytes
    )

    # --------------------------------------------------------
    # VISIBLE DEFECT DETECTION (EXPERIMENTAL)
    # --------------------------------------------------------

    defect_result = detect_visible_defects(image)

    quality_evidence = create_quality_evidence()
    quality_evidence["visible_defects"].update({
        "model_status": defect_result["model_status"],
        "review_required": defect_result["review_required"],
        "detection_count": defect_result["detection_count"],
        "detections": defect_result["detections"],
    })

    # ========================================================
    # NOT AN ONION
    # ========================================================

    if not onion_result["is_onion"]:

        quality_evidence[
            "grading"
        ] = {

            "grade":
                "NOT APPLICABLE",

            "grade_a_percentage":
                None,

            "urs_percentage":
                None,

            "other_percentage":
                None,

            "rule_version":
                None,

            "status":
                "BLOCKED",
        }

        reason = (
            "The trained AI model did not "
            "detect sufficient characteristics "
            "of an onion."
        )

        return {

            "success":
                True,

            # ------------------------------------------------
            # OLD FIELDS
            # Required by your existing Analysis UI
            # ------------------------------------------------

            "is_onion":
                False,

            "label":
                onion_result["label"],

            "confidence":
                onion_result["confidence"],

            "raw_prediction":
                onion_result["raw_prediction"],

            "reason":
                reason,

            # ------------------------------------------------
            # NEW STRUCTURED FIELDS
            # ------------------------------------------------

            "image_quality":
                image_quality,

            "onion_detection":
                onion_result,

            "visible_defects":
                quality_evidence[
                    "visible_defects"
                ],

            "size_assessment":
                quality_evidence[
                    "size_assessment"
                ],

            "grading":
                quality_evidence[
                    "grading"
                ],

            "inspection_status":
                "REJECTED_SAMPLE",
        }


    # ========================================================
    # ONION DETECTED
    # ========================================================

    reason = (
        "The trained AI model detected "
        "visual characteristics consistent "
        "with an onion."
    )

    return {

        "success":
            True,

        # ----------------------------------------------------
        # OLD FIELDS
        # Required by existing Analysis UI
        # ----------------------------------------------------

        "is_onion":
            True,

        "label":
            onion_result["label"],

        "confidence":
            onion_result["confidence"],

        "raw_prediction":
            onion_result["raw_prediction"],

        "reason":
            reason,

        # ----------------------------------------------------
        # NEW STRUCTURED FIELDS
        # ----------------------------------------------------

        "image_quality":
            image_quality,

        "onion_detection":
            onion_result,

        "visible_defects":
            quality_evidence[
                "visible_defects"
            ],

        "size_assessment":
            quality_evidence[
                "size_assessment"
            ],

        "grading":
            quality_evidence[
                "grading"
            ],

        "inspection_status":
            "ANALYSIS_PENDING",
    }


# ============================================================
# ANALYZE ENDPOINT
# ============================================================

@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...)
):

    image_bytes = await file.read()

    if not image_bytes:

        return {

            "success":
                False,

            "is_onion":
                False,

            "label":
                "ERROR",

            "confidence":
                0,

            "raw_prediction":
                None,

            "reason":
                "No image received.",
        }

    try:

        result = analyze_image(
            image_bytes
        )

        print(
            "AI RESULT:",
            result
        )

        return result

    except Exception as error:

        print(
            "ANALYSIS ERROR:",
            str(error)
        )

        return {

            "success":
                False,

            "is_onion":
                False,

            "label":
                "ERROR",

            "confidence":
                0,

            "raw_prediction":
                None,

            "reason":
                f"Could not analyze image: "
                f"{str(error)}",

            "inspection_status":
                "ERROR",
        }


# ============================================================
# QUALITY ASSESSMENT ENDPOINT
# ============================================================

@app.post("/quality-assessment")
async def quality_assessment(
    file: UploadFile = File(...)
):

    image_bytes = await file.read()

    if not image_bytes:

        return {

            "success":
                False,

            "is_onion":
                False,

            "label":
                "ERROR",

            "confidence":
                0,

            "raw_prediction":
                None,

            "reason":
                "No image received.",
        }

    try:

        result = analyze_image(
            image_bytes
        )

        return result

    except Exception as error:

        print(
            "QUALITY ASSESSMENT ERROR:",
            str(error)
        )

        return {

            "success":
                False,

            "is_onion":
                False,

            "label":
                "ERROR",

            "confidence":
                0,

            "raw_prediction":
                None,

            "reason":
                f"Quality assessment failed: "
                f"{str(error)}",

            "inspection_status":
                "ERROR",
        }