
from pathlib import Path
from collections import Counter

dataset = Path(r"C:\Users\pwrob\Downloads\onions.v3i.yolov11")
classes = ["cuts", "rotten", "sprout"]

print("DATASET CLASS DISTRIBUTION", flush=True)

for split in ["train", "valid", "test"]:
    label_dir = dataset / split / "labels"

    if not label_dir.exists():
        print(f"Missing labels folder: {label_dir}")
        continue

    counts = Counter()
    images_with_class = Counter()
    files = list(label_dir.glob("*.txt"))

    for file in files:
        seen = set()

        for line in file.read_text(encoding="utf-8").splitlines():
            parts = line.split()
            if not parts:
                continue

            class_id = int(parts[0])
            counts[class_id] += 1
            seen.add(class_id)

        for class_id in seen:
            images_with_class[class_id] += 1

    print(f"\n{split.upper()}: {len(files)} label files")

    for class_id, name in enumerate(classes):
        print(
            f"  {name}: {counts[class_id]} instances "
            f"in {images_with_class[class_id]} images"
        )
