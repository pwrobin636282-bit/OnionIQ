from pathlib import Path
import cv2

image_path = Path(
    r"C:\Users\pwrob\Downloads\onions.v3i.yolov11\valid\images"
    r"\img_va11_jpg.rf.d3a3ef7307ff7ffe89759cd54276f083.jpg"
)
label_path = Path(
    r"C:\Users\pwrob\Downloads\onions.v3i.yolov11\valid\labels"
    r"\img_va11_jpg.rf.d3a3ef7307ff7ffe89759cd54276f083.txt"
)

image = cv2.imread(str(image_path))
if image is None:
    raise FileNotFoundError(f"Image not found: {image_path}")

h, w = image.shape[:2]
names = {0: "cuts", 1: "rotten", 2: "sprout"}

for line in label_path.read_text().splitlines():
    parts = line.split()
    class_id = int(parts[0])
    xc, yc, bw, bh = map(float, parts[1:5])

    x1 = int((xc - bw / 2) * w)
    y1 = int((yc - bh / 2) * h)
    x2 = int((xc + bw / 2) * w)
    y2 = int((yc + bh / 2) * h)

    cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.putText(
        image, names[class_id], (x1, max(y1 - 8, 20)),
        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2
    )

output = Path("annotation_check.jpg")
cv2.imwrite(str(output), image)
print(f"Saved annotated image to: {output.resolve()}")