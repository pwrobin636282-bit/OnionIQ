
from pathlib import Path

import cv2
from ultralytics import YOLO

ROOT = Path(__file__).resolve().parent
DATASET = Path(r"C:\Users\pwrob\Downloads\onions.v3i.yolov11")

IMAGE_NAME = "img_va11_jpg.rf.d3a3ef7307ff7ffe89759cd54276f083.jpg"
IMAGE_PATH = DATASET / "valid" / "images" / IMAGE_NAME
LABEL_PATH = DATASET / "valid" / "labels" / f"{IMAGE_PATH.stem}.txt"

MODEL_PATH = (
    ROOT
    / "runs"
    / "detect"
    / "ai-model"
    / "defect_detector"
    / "onion_defects-improved-1"
    / "weights"
    / "best.pt"
)

CLASS_NAMES = {0: "cuts", 1: "rotten", 2: "sprout"}

image = cv2.imread(str(IMAGE_PATH))
if image is None:
    raise FileNotFoundError(f"Image not found: {IMAGE_PATH}")

height, width = image.shape[:2]

# Green = ground-truth annotations
if not LABEL_PATH.exists():
    raise FileNotFoundError(f"Ground-truth label file not found: {LABEL_PATH}")

for line in LABEL_PATH.read_text().splitlines():
    parts = line.split()
    if len(parts) != 5:
        continue

    cls, xc, yc, bw, bh = map(float, parts)
    x1 = int((xc - bw / 2) * width)
    y1 = int((yc - bh / 2) * height)
    x2 = int((xc + bw / 2) * width)
    y2 = int((yc + bh / 2) * height)

    label = CLASS_NAMES.get(int(cls), str(int(cls)))
    cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.putText(
        image, f"GT: {label}", (x1, max(20, y1 - 5)),
        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 0), 2
    )

# Red = model predictions
model = YOLO(str(MODEL_PATH))
result = model.predict(
    source=str(IMAGE_PATH),
    imgsz=640,
    conf=0.10,
    verbose=False
)[0]

for box in result.boxes:
    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
    cls = int(box.cls[0].item())
    confidence = float(box.conf[0].item())
    label = CLASS_NAMES.get(cls, str(cls))

    cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
    cv2.putText(
        image, f"Pred: {label} {confidence:.2f}",
        (x1, min(height - 5, y2 + 20)),
        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 0, 255), 2
    )

output_path = ROOT / "comparison_rotten_groundtruth.jpg"
if not cv2.imwrite(str(output_path), image):
    raise RuntimeError("Could not save comparison image.")

print(f"Comparison saved to: {output_path}")
print("GREEN = ground truth | RED = model predictions")
