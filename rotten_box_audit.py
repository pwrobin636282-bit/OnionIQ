
from pathlib import Path
import csv
import statistics

# Dataset locations
DATASET = Path(r"C:\Users\pwrob\Downloads\onions.v3i.yolov11")
SPLITS = ["train", "valid", "test"]

# Class IDs from your data.yaml
CLASS_NAMES = {
    0: "cuts",
    1: "rotten",
    2: "sprout",
}

OUTPUT = Path(__file__).resolve().parent / "rotten_box_audit.csv"

rotten_boxes = []
all_counts = {split: 0 for split in SPLITS}
warnings = []

for split in SPLITS:
    label_dir = DATASET / split / "labels"

    if not label_dir.exists():
        warnings.append(f"Missing label directory: {label_dir}")
        continue

    for label_file in sorted(label_dir.glob("*.txt")):
        for line_number, line in enumerate(
            label_file.read_text(encoding="utf-8").splitlines(), start=1
        ):
            parts = line.split()

            if not parts:
                continue

            if len(parts) != 5:
                warnings.append(
                    f"{label_file.name}:{line_number}: expected 5 values"
                )
                continue

            try:
                cls, xc, yc, bw, bh = map(float, parts)
            except ValueError:
                warnings.append(
                    f"{label_file.name}:{line_number}: invalid numeric values"
                )
                continue

            all_counts[split] += 1

            if not cls.is_integer() or int(cls) not in CLASS_NAMES:
                warnings.append(
                    f"{label_file.name}:{line_number}: invalid class ID {cls}"
                )
                continue

            if not all(0 <= value <= 1 for value in (xc, yc, bw, bh)):
                warnings.append(
                    f"{label_file.name}:{line_number}: values outside [0, 1]"
                )
                continue

            if bw <= 0 or bh <= 0:
                warnings.append(
                    f"{label_file.name}:{line_number}: zero/negative box size"
                )
                continue

            if xc - bw / 2 < 0 or xc + bw / 2 > 1:
                warnings.append(
                    f"{label_file.name}:{line_number}: box extends beyond image horizontally"
                )

            if yc - bh / 2 < 0 or yc + bh / 2 > 1:
                warnings.append(
                    f"{label_file.name}:{line_number}: box extends beyond image vertically"
                )

            if int(cls) == 1:
                area_pct = bw * bh * 100
                box_w_pct = bw * 100
                box_h_pct = bh * 100

                flags = []

                # Heuristics for manual review, not automatic errors
                if area_pct < 0.5:
                    flags.append("VERY_SMALL_AREA")
                elif area_pct < 1.0:
                    flags.append("SMALL_AREA")

                if area_pct > 50:
                    flags.append("VERY_LARGE_AREA")

                if bw > 0.95 or bh > 0.95:
                    flags.append("NEAR_FULL_IMAGE_DIMENSION")

                rotten_boxes.append({
                    "split": split,
                    "image": label_file.stem,
                    "label_file": str(label_file),
                    "line": line_number,
                    "x_center": round(xc, 6),
                    "y_center": round(yc, 6),
                    "width_normalized": round(bw, 6),
                    "height_normalized": round(bh, 6),
                    "box_width_percent": round(box_w_pct, 3),
                    "box_height_percent": round(box_h_pct, 3),
                    "area_percent": round(area_pct, 4),
                    "review_flags": "; ".join(flags) if flags else "NONE",
                })

fields = [
    "split", "image", "label_file", "line",
    "x_center", "y_center",
    "width_normalized", "height_normalized",
    "box_width_percent", "box_height_percent",
    "area_percent", "review_flags",
]

with OUTPUT.open("w", newline="", encoding="utf-8-sig") as file:
    writer = csv.DictWriter(file, fieldnames=fields)
    writer.writeheader()
    writer.writerows(rotten_boxes)

print("\n=== ONIONIQ ROTTEN BOX AUDIT ===")
print(f"Rotten boxes found: {len(rotten_boxes)}")
print(f"CSV report saved to: {OUTPUT}")

for split in SPLITS:
    print(f"{split}: {all_counts[split]} total annotated boxes")

print("\nReview flags:")
flagged = [box for box in rotten_boxes if box["review_flags"] != "NONE"]
print(f"Boxes flagged for manual review: {len(flagged)}")

for box in flagged[:30]:
    print(
        f"{box['split']} | {box['image']} | "
        f"area={box['area_percent']}% | {box['review_flags']}"
    )

if len(flagged) > 30:
    print(f"...and {len(flagged) - 30} more flagged boxes in the CSV.")

if warnings:
    warning_path = OUTPUT.with_name("rotten_box_audit_warnings.txt")
    warning_path.write_text("\n".join(warnings), encoding="utf-8")
    print(f"\nStructural warnings: {len(warnings)}")
    print(f"Warning details saved to: {warning_path}")
else:
    print("\nNo structural label warnings detected.")

if rotten_boxes:
    areas = [box["area_percent"] for box in rotten_boxes]
    print(f"\nMedian rotten box area: {statistics.median(areas):.3f}%")
    print(f"Smallest rotten box area: {min(areas):.4f}%")
    print(f"Largest rotten box area: {max(areas):.3f}%")

print("\nIMPORTANT: Review flags identify unusual box sizes only.")
print("They do not prove that an annotation is incorrect.")
