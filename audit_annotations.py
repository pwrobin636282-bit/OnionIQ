
from pathlib import Path
from collections import Counter

DATASET = Path(r"C:\Users\pwrob\Downloads\onions.v3i.yolov11")
CLASS_NAMES = {0: "cuts", 1: "rotten", 2: "sprout"}

print("ONIONIQ ANNOTATION AUDIT")
print("=" * 45)

for split in ["train", "valid", "test"]:
    image_dir = DATASET / split / "images"
    label_dir = DATASET / split / "labels"

    if not image_dir.exists() or not label_dir.exists():
        print(f"\n{split.upper()}: Missing images or labels directory")
        continue

    images = [
        p for p in image_dir.iterdir()
        if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
    ]

    counts = Counter()
    missing_labels = []
    empty_labels = []
    invalid_boxes = []
    total_boxes = 0

    for image_path in images:
        label_path = label_dir / f"{image_path.stem}.txt"

        if not label_path.exists():
            missing_labels.append(image_path.name)
            continue

        lines = [
            line.strip()
            for line in label_path.read_text(encoding="utf-8").splitlines()
            if line.strip()
        ]

        if not lines:
            empty_labels.append(image_path.name)
            continue

        for line_number, line in enumerate(lines, start=1):
            parts = line.split()

            try:
                if len(parts) != 5:
                    raise ValueError("Expected 5 values")

                class_id = int(parts[0])
                x, y, w, h = map(float, parts[1:])

                if class_id not in CLASS_NAMES:
                    invalid_boxes.append(
                        f"{label_path.name}:{line_number} unknown class {class_id}"
                    )
                    continue

                if not all(0 <= v <= 1 for v in (x, y, w, h)):
                    invalid_boxes.append(
                        f"{label_path.name}:{line_number} values outside 0-1"
                    )
                    continue

                if w <= 0 or h <= 0 or x - w / 2 < 0 or y - h / 2 < 0 \
                        or x + w / 2 > 1 or y + h / 2 > 1:
                    invalid_boxes.append(
                        f"{label_path.name}:{line_number} invalid box geometry"
                    )
                    continue

                counts[class_id] += 1
                total_boxes += 1

            except (ValueError, IndexError):
                invalid_boxes.append(
                    f"{label_path.name}:{line_number} malformed annotation"
                )

    print(f"\n{split.upper()}")
    print(f"Images: {len(images)}")
    print(f"Valid boxes: {total_boxes}")

    for class_id, name in CLASS_NAMES.items():
        print(f"  {name}: {counts[class_id]} boxes")

    print(f"Images without label files: {len(missing_labels)}")
    print(f"Empty label files: {len(empty_labels)}")
    print(f"Invalid annotations: {len(invalid_boxes)}")

    if missing_labels:
        print("  Missing-label examples:", missing_labels[:5])

    if empty_labels:
        print("  Empty-label examples:", empty_labels[:5])

    if invalid_boxes:
        print("  Invalid-annotation examples:", invalid_boxes[:10])

print("\nAudit complete. No files were modified.")
