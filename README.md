# Yurrheeler Med Advisor

An evidence-based, clinical intelligence & AI medical triage platform powered by **17 specialized AI medical agents**, multimodal diagnostic vision, real-time speech acoustics, pharmacotherapy safety screening, and geospatial emergency care routing.

---

## 🌟 Key Features & Clinical AI Engines

### 1. Multimodal Diagnostic Vision & Lab OCR
- **Diagnostic Sample Scanning**: Upload or inspect dermatological lesions (ABCDE criteria), chest radiographs (CXR opacity/consolidation), 12-lead ECG rhythm strips (STEMI/arrhythmia), and comprehensive metabolic blood panels.
- **ROI & Biomarker Extraction**: Visual bounding boxes, automated reference-range flag classification (High/Normal/Low), and confidence-scored triage guidance.

### 2. Multi-Specialist Clinical Consensus Panel (Tumor Board Engine)
- **Concurrent Specialist Deliberation**: Convene roundtables across all 17 clinical AI agents (Cardiology, Pulmonology, Neurology, Oncology, Nephrology, Gastroenterology, etc.).
- **Diagnostic Concordance Matrix**: Cross-examines competing differentials, highlights clinical controversies, checks clinical guidelines (AHA, ACC, NICE, GOLD), and establishes prioritized Tier 1–3 action plans.

### 3. Real-Time Voice Consultation & Acoustic Cough Triage
- **Hands-Free Speech Dialogue**: Web Speech recognition transcript capture with real-time audio spectrum canvas visualizer and synthesized voice playback.
- **Respiratory Acoustic Mechanics**: Acoustic analysis differentiating dry/hacking, productive/wet, musical wheezing, and barking/stridor coughs with pulmonary distress markers.

### 4. Drug Interaction & Contraindication Safety Matrix
- **Pharmacotherapy Safety Screening**: Cross-examines prescription drugs, OTC medications, herbal supplements, patient comorbidities, and documented allergies.
- **High-Risk Cascade Detection**: Flags CYP450 enzyme competition, QT prolongation, cardiorenal "triple whammy" hazards, serotonin syndrome, and anticoagulant bleeding risks.

### 5. Geospatial Emergency Room & Urgent Care Locator
- **Triage Urgency Alignment**: Categorizes patient acuity into Critical Emergency (Level 1 Trauma/ED STAT), Urgent (Within 2-4h), Semi-Urgent (24h Walk-In), and Routine/Rx.
- **Geospatial Proximity**: GPS and ZIP-code search for accredited trauma centers, emergency departments, urgent care clinics, and 24/7 pharmacies with direct 911 dialing and pre-departure checklists.

### 6. 17 Specialized Medical AI Agents
- Dr. Aris Thorne (Pulmonology & Critical Care)
- Dr. Elena Vance (Cardiology & Electrophysiology)
- Dr. Noah Sterling (Neurology & Neurovascular)
- Dr. Maya Lin (Gastroenterology & Hepatology)
- Dr. Julian Mercer (Emergency & Trauma Medicine)
- Dr. Sophia Chen (Endocrinology & Metabolism)
- Dr. Marcus Brody (Orthopedic Surgery & Sports Med)
- Dr. Clara Oswald (Pediatrics & Adolescent Health)
- Dr. Samuel Bennett (Dermatology & Cutaneous Oncology)
- Dr. Sarah Mitchell (Internal Medicine & Rheumatology)
- Dr. Liam Gallagher (Infectious Disease & Global Health)
- Dr. Priya Patel (Immunology & Allergy)
- Dr. Robert Hayes (Nephrology & Renal Medicine)
- Dr. Vivienne Moreau (Oncology & Hematology)
- Dr. Isaac Clarke (Psychiatry & Behavioral Health)
- Dr. Hannah Abbott (Geriatrics & Palliative Care)
- Dr. David Kim (Radiology & Nuclear Medicine)

### 7. Interactive 3D Spatial Anatomical Mapping
- Visual interactive 3D human body atlas with anatomical region selection, symptom localization, organ system cross-referencing, and differential recommendations.

### 8. NEWS2 & Vital Biomarker Analytics
- National Early Warning Score 2 (NEWS2) calculation engine evaluating respiratory rate, SpO2, systolic BP, pulse rate, consciousness level, and temperature.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion (`motion/react`), Sonner Toasts
- **UI Components**: Radix UI headless primitives with custom Tailwind design system
- **Backend**: Node.js & Express API routes (`server.ts`)
- **AI Models & Engines**: Google Gemini API (`@google/genai`) for multimodal vision, clinical synthesis, and conversational intelligence
- **State & Persistence**: Firebase Firestore database & Client-side Clinical Store

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd yurrheeler-med-advisor

# Install dependencies
npm install
```

### Environment Variables
Create a `.env` file with your Gemini API key and Firebase configurations:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Development Server
```bash
# Start dev server on port 3000
npm run dev
```

### Production Build
```bash
# Build client and bundle server
npm run build

# Start production server
npm run start
```

---

## 🔒 Clinical Disclaimer
*Yurrheeler Med Advisor is an AI-assisted clinical decision support and educational tool. It does not replace professional clinical judgment, emergency medical services, or in-person medical evaluation. In case of a medical emergency, immediately contact local emergency services (911 in the US).*
