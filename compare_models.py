from ultralytics import YOLO
from pathlib import Path

data = r"C:\Users\pwrob\Downloads\onions.v3i.yolov11\data.yaml"

models = {
    "Original": r"ai-model\defect_detector\onion_defects-2\weights\best.pt",
    "Previous fine-tuned": r"runs\detect\ai-model\defect_detector\onion_defects-improved-1\weights\best.pt",
    "Colab GPU": r"onioniq_colab_tune1_best.pt",
}

for name, path in models.items():
    print(f"\n--- {name} ---")

    if not Path(path).exists():
        print(f"FILE NOT FOUND: {path}")
        continue

    model = YOLO(path)
    metrics = model.val(
        data=data,
        split="val",
        imgsz=640,
        batch=8,
        plots=False,
        verbose=False,
    )

    print(f"Precision: {metrics.box.mp:.4f}")
    print(f"Recall:    {metrics.box.mr:.4f}")
    print(f"mAP50:     {metrics.box.map50:.4f}")
    print(f"mAP50-95:  {metrics.box.map:.4f}")
