# OnionIQ 🌱
### AI-Assisted Onion Quality Assessment

OnionIQ is an AI-assisted onion inspection project designed to explore image-based onion quality assessment and visible defect detection through a mobile application and a Python backend.

The project combines a React Native mobile interface with a FastAPI backend and deep-learning models for image classification and defect detection.

> **Project status:** Under development. Model evaluation and defect-detection improvements are ongoing.

## ✨ Project Highlights

- Mobile application built with React Native and Expo.
- FastAPI backend for AI-assisted image processing.
- MobileNetV2 image classifier loaded from a Keras model.
- Experimental YOLO-based detector for visible onion defects.
- Health-check endpoints for backend and model status.
- Dataset auditing, model comparison, and confidence-threshold experiments.

## 🧰 Technology Stack

| Component | Technologies |
|---|---|
| Mobile application | React Native, Expo, Expo Router |
| Styling | NativeWind, Tailwind CSS |
| Backend API | Python, FastAPI |
| Image processing | Pillow, NumPy |
| Image classification | TensorFlow / Keras, MobileNetV2 |
| Defect detection | Ultralytics YOLO |
| Development tools | Git, GitHub, VS Code |

## 🏗️ Architecture

```text
Mobile Application
React Native + Expo
        |
        | Image/API requests
        v
FastAPI Backend
        |
        +---- MobileNetV2 Classifier
        |
        +---- YOLO Defect Detector
        |
        v
Image Processing and Results
```

The diagram represents the main project components. The exact inference flow depends on the backend endpoint implementation.

## 📁 Repository Structure

```text
OnionIQ/
├── apps/
│   └── inspector-mobile/  # Expo mobile application
├── backend/
│   ├── main.py            # FastAPI application
│   ├── models/            # YOLO model location
│   └── onion_classifier.keras
├── ai-model/              # Model development and training
├── docs/                  # Project documentation
├── runs/                  # Local experiment outputs (ignored)
├── .gitignore
└── README.md
```

Some model files and local experiment outputs are intentionally excluded from Git.

## 🚀 Getting Started

### Prerequisites

- Git
- Node.js and npm
- Python 3.10 or another version compatible with the installed TensorFlow and Ultralytics packages
- Expo-compatible development environment
- Trained model files required by the backend

### 1. Clone the repository

```bash
git clone https://github.com/pwrobin636282-bit/OnionIQ.git
cd OnionIQ
```

### 2. Set up the mobile application

```bash
cd apps/inspector-mobile
npm install
npx expo start
```

Follow the Expo terminal instructions to open the app on a supported device, emulator, or web browser.

### 3. Set up the backend

Open another terminal at the repository root.

Create and activate a virtual environment:

**Windows PowerShell**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```powershell
python -m pip install fastapi "uvicorn[standard]" python-multipart numpy tensorflow pillow ultralytics
```

Start the API:

```powershell
python -m uvicorn backend.main:app --reload
```

The API should be available at `http://127.0.0.1:8000`.

Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

> Dependency versions may need adjustment for your Python version and operating system. A reproducible dependency file should be added after the working environment is verified.

### 4. Configure model files

The backend expects these files:

- `backend/onion_classifier.keras`
- `backend/models/defect_model.pt`

The trained weights may need to be obtained separately if they are not distributed with the repository. The application cannot perform the corresponding inference when a required model fails to load.

### 5. Check backend health

Open these URLs after starting the backend:

- `http://127.0.0.1:8000/` — basic backend status.
- `http://127.0.0.1:8000/health` — reports whether the classifier and defect detector loaded.

## 🧪 Model Evaluation

The project includes scripts for evaluating model checkpoints, auditing annotations, and investigating confidence thresholds.

The defect detector uses three classes:

- `cuts`
- `rotten`
- `sprout`

An evaluation of the current improved checkpoint on a 53-image validation set produced the following results:

| Metric | Result |
|---|---:|
| Precision | 0.4104 |
| Recall | 0.4279 |
| mAP@50 | 0.4025 |
| mAP@50–95 | 0.2235 |

These are validation results, not guarantees of real-world performance. The validation set is small and class-imbalanced, and the rotten class remains a major area for improvement.

The project also contains experiments for comparing model checkpoints, checking dataset annotations, and examining confidence thresholds.

## 🔬 Current Limitations

- The available validation set is relatively small.
- Defect classes are imbalanced, especially the cuts class.
- Rotten-defect detection has low recall and requires further investigation.
- Confidence thresholds involve a precision–recall trade-off.
- Real-world performance across different lighting, backgrounds, onion varieties, and camera conditions has not yet been established.
- Backend and mobile integration should be tested end to end before deployment.

## 🗺️ Roadmap

- [ ] Improve dataset quality and annotation consistency.
- [ ] Collect more representative images for underrepresented defects.
- [ ] Compare model checkpoints using consistent evaluation settings.
- [ ] Improve rotten-defect recall while controlling false positives.
- [ ] Add reproducible dependency and model-version documentation.
- [ ] Test the complete mobile-to-backend workflow.
- [ ] Add genuine application screenshots and a project demonstration.
- [ ] Evaluate performance on an independent test set.

## 👨‍💻 Development

OnionIQ is an ongoing AI and mobile-development project. Model experiments and implementation details are being refined as evaluation progresses.

## 📄 License

See the repository's `LICENSE` file for licensing terms.
