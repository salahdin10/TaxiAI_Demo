cat > README.md << 'EOF'
# 🚖 TaxiAI

TaxiAI is a smart taxi management system powered by **Laravel** and **Python** for advanced **face recognition** and **license plate detection**. It ensures that only authorized drivers are operating registered taxis, and provides live monitoring, verification, and alerting features.

---

## 🔍 Features

- 🎯 Real-time **Face Recognition** using webcam
- 🚘 Live **License Plate Detection**
- 🛂 Identity Verification via National Card ID (CIN)
- ⚠️ Alert Logging for:
  - Unknown faces
  - Mismatched driver and license plate
- 📊 Admin Dashboard (Manage drivers & taxis)
- 👨‍✈️ Driver Portal (View profile, status)
- 🌐 Public Web Interface (Find nearby taxis)
- 🎥 External 4K webcam support

---

## 🛠️ Tech Stack

- **Frontend:** Inertia.js + React + Tailwind CSS
- **Backend:** Laravel 10 (PHP)
- **Python Scripts:** OpenCV, face recognition, license plate recognition
- **Database:** MySQL
- **Integration:** Python ↔ Laravel communication via JSON & endpoint bridging

---

## ⚙️ Installation

### Prerequisites

- PHP >= 8.1
- Composer
- Node.js & npm
- MySQL
- Python 3.x
- pip (Python package installer)

---

### Laravel Setup

\`\`\`bash
git clone https://github.com/salahdin10/TaxiAI_Demo.git
cd TaxiAI

# Install PHP dependencies
composer install

# Copy environment file and configure DB
cp .env.example .env
php artisan key:generate

# Configure your database credentials in .env
php artisan migrate

# Install frontend packages
npm install && npm run dev
\`\`\`

---

### Python Setup

\`\`\`bash
cd python-scripts/  # Adjust if your Python files are elsewhere

# Install required packages
pip install -r requirements.txt

# Or install manually:
pip install opencv-python face_recognition numpy mysql-connector-python
\`\`\`

---

### Running the Project

#### Laravel App:
\`\`\`bash
php artisan serve
\`\`\`

#### Python Script:
\`\`\`bash
py recognition_script.py  # Replace with the actual filename
\`\`\`

---

## 📌 Notes

- Rename driver face images to their **CIN** (National ID) for accurate matching.
- The recognition script compares detected data with the `drivers` table.
- If the face is unknown or the car doesn't match the driver, alerts are logged.
- Alert messages show the **driver’s full name** for clarity (not just the CIN).

---

## 📄 License

MIT License

---

