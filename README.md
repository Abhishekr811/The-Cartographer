# RSE — Knowledge Engine

> **Research State Engine:** Transforms research queries into structured intelligence.

RSE is a full-stack application designed to analyze academic research, map out complex problem statements, and identify critical knowledge gaps. It breaks down complex topics into claims, maps their relationships, and evaluates evidence to determine if a concept is established, debated, or unknown.

## ✨ Core Features

* **Intelligent Querying:** Submit research topics (e.g., "rapamycin longevity") to generate structured state cards and summary metrics.
* **Claim & Evidence Tracking:** Analyzes specific claims, measuring their confidence, supporting evidence, and opposition.
* **Relational Mapping:** Maps the source-to-target relationships between different research claims to visualize knowledge graphs.
* **Synthesis & Archiving:** Synthesizes multiple claims into cohesive summaries and archives previous research states for later retrieval.
* **Editorial UI Design:** Features a bespoke, asymmetric editorial layout utilizing a Newsreader/Work Sans typography system and subtle color-coded states (Green for Established, Amber for Debated, Blue for Unknown).

## 🛠️ Tech Stack

**Frontend**
* React 19
* Vite (with HMR and ESLint integration)
* React Router DOM
* Modular CSS / CSS Custom Properties

**Backend**
* Python 
* FastAPI
* Uvicorn (Development Server)
* httpx (For testing and external requests)

## 🚀 Getting Started

To run RSE locally, you will need to start both the FastAPI backend and the Vite React frontend.

### Prerequisites
* Python 3.8+
* Node.js & npm (or Yarn/pnpm)

### 1. Start the Backend (FastAPI)
The backend runs on port `8000` and provides the core API endpoints.

```bash
# Navigate to the backend directory (where main.py is located)
# Install dependencies (assuming you have a requirements.txt or pipenv)
pip install fastapi uvicorn httpx

# Start the server
uvicorn main:app --reload
