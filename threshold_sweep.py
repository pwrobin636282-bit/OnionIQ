
from pathlib import Path
import csv

from ultralytics import YOLO

ROOT = Path(__file__).resolve().parent

MODEL_PATH = (
    ROOT / "runs" / "detect" / "ai-model" / "defect_detector"
    / "onion_defects-improved-1" / "weights" / "best.pt"
)

DATA_PATH = Path(
    r"C:\Users\pwrob\Downloads\onions.v3i.yolov11\data.yaml"
)

THRESHOLDS = [0.10, 0.15, 0.20, 0.25, 0.30]
OUTPUT_CSV = ROOT / "threshold_sweep_results.csv"

if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

if not DATA_PATH.exists():
    raise FileNotFoundError(f"Dataset config not found: {DATA_PATH}")

model = YOLO(str(MODEL_PATH))
results = []

for threshold in THRESHOLDS:
    print(f"\nEvaluating confidence threshold: {threshold:.2f}")

    metrics = model.val(
        data=str(DATA_PATH),
        split="val",
        imgsz=640,
        conf=threshold,
        iou=0.45,
        plots=False,
        verbose=False,
        project=str(ROOT / "runs" / "detect"),
        name=f"threshold-{int(threshold * 100):02d}",
        exist_ok=True,
    )

    row = {
        "confidence_threshold": threshold,
        "precision": float(metrics.box.mp),
        "recall": float(metrics.box.mr),
        "mAP50": float(metrics.box.map50),
        "mAP50_95": float(metrics.box.map),
    }
    results.append(row)

    print(
        f"Precision: {row['precision']:.4f} | "
        f"Recall: {row['recall']:.4f} | "
        f"mAP50: {row['mAP50']:.4f} | "
        f"mAP50-95: {row['mAP50_95']:.4f}"
    )

with OUTPUT_CSV.open("w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=results[0].keys())
    writer.writeheader()
    writer.writerows(results)

print(f"\nExperiment complete. Results saved to:\n{OUTPUT_CSV}")
print("\nUse precision and recall to compare operating thresholds.")
print("For standard mAP comparison, evaluate with the default low conf threshold.")
