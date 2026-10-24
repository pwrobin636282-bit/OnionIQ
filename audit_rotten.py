
from pathlib import Path
from collections import Counter
import random
import cv2

DATASET = Path(r"C:\Users\pwrob\Downloads\onions.v3i.yolov11")
SPLIT = "train"
CLASS_ID = 1  # rotten
SAMPLE_SIZE = 12

image_dir = DATASET / SPLIT / "images"
label_dir = DATASET / SPLIT / "labels"
output_dir = Path("runs/annotation_audit/rotten")
output_dir.mkdir(parents=True, exist_ok=True)

# Find images whose labels include rotten defects.
candidates = []

for label_file in label_dir.glob("*.txt"):
    lines = label_file.read_text(encoding="utf-8").splitlines()
    rotten_lines = [
        line for line in lines
        if line.strip() and int(line.split()[0]) == CLASS_ID
    ]

    if rotten_lines:
        candidates.append((label_file, rotten_lines))

random.seed(42)
sample = random.sample(candidates, min(SAMPLE_SIZE, len(candidates)))

print(f"Rotten-labelled images available: {len(candidates)}")
print(f"Images selected for review: {len(sample)}")

for label_file, rotten_lines in sample:
    image_path = None

    for extension in [".jpg", ".jpeg", ".png", ".webp"]:
        candidate = image_dir / (label_file.stem + extension)
        if candidate.exists():
            image_path = candidate
            break

    if image_path is None:
        print(f"Image not found for: {label_file.name}")
        continue

    image = cv2.imread(str(image_path))
    if image is None:
        print(f"Could not read: {image_path}")
        continue

    height, width = image.shape[:2]

    for line in rotten_lines:
        _, xc, yc, bw, bh = line.split()
        xc, yc, bw, bh = map(float, (xc, yc, bw, bh))

        x1 = max(0, int((xc - bw / 2) * width))
        y1 = max(0, int((yc - bh / 2) * height))
        x2 = min(width - 1, int((xc + bw / 2) * width))
        y2 = min(height - 1, int((yc + bh / 2) * height))

        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(
            image, "rotten", (x1, max(20, y1 - 6)),
            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2
        )

    output_path = output_dir / image_path.name
    cv2.imwrite(str(output_path), image)
    print(output_path)

print(f"\nAnnotated samples saved in: {output_dir.resolve()}")
