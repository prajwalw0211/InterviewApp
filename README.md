# Interview Enhancement System

An AI-powered web platform to help users practice and improve their interview skills through personalized mock interviews, real-time feedback, and performance analytics.

---

## Introduction

In today’s competitive job market, cracking interviews requires more than just knowledge — communication, confidence, and clarity of speech are equally important. The **Interview Enhancement System** is a web-based tool designed to simulate real interview scenarios and provide actionable feedback using modern AI technologies.

It allows users to:

* Select a job role and topics of interest
* Record voice answers to AI-generated questions
* Receive a detailed analysis of their performance including scores, filler word count, fluency, and keyword suggestions

The goal is to improve candidates' preparedness and boost confidence before facing real interviews.

---

## Features

* **Role-Based Question Generation** using Gemini AI
* **Voice Recording and Transcription** using React Hook Speech-to-Text
* **Real-Time Answer Evaluation**

  * Scoring by Gemini AI
  * Filler word detection via Whisper
  * Fluency & confidence scoring via Assembly AI
* **Performance Tracking Dashboard**
* **Secure User Authentication** via Clerk
* **Modern UI** with responsive React-based frontend

---

## Technologies Used

### Frontend

* **Next.js 15** – React-based framework for building modern, full-stack web applications.
* **Clerk** – Authentication and user management (sign-up, login, session handling).
* **Drizzle ORM + Neon DB** – Type-safe ORM for interacting with PostgreSQL hosted on Neon.
* **Tailwind CSS** – Utility-first CSS framework for styling.

### Backend

* **Python Flask** – Lightweight Python web framework to handle API requests.
* **OpenAI Whisper** – For transcribing audio and detecting filler words in user responses.
* **Flask-CORS** – To allow frontend-backend communication (cross-origin requests).

### Dev Tools & Services

* **PostgreSQL (Neon)** – Serverless, scalable cloud Postgres database.
* **Gemini API** – For question generation and feedback scoring.

---

## System Architecture

The project is a **full-stack AI-powered interview preparation platform** with the following major components:

### 1. **Frontend (Next.js + Clerk + Drizzle ORM)**

* Built with **Next.js** and **React**
* UI for job selection, mock interview, audio recording, feedback viewing
* **Clerk** handles **user authentication and session management**
* Uses **Drizzle ORM** for database operations
* Communicates with Flask backend and AI APIs for evaluation

### 2. **Backend (Python Flask)**

* Developed using **Flask**
* Handles audio processing and filler word detection
* Provides API endpoints consumed by the frontend
* **CORS enabled** to allow secure cross-origin requests
* Uses **Whisper (OpenAI)** for transcribing audio and detecting filler words like *"um"*, *"ah"*, *"uh"*

### 3. **AI Services**

* **Gemini API (Google)**:

  * Generates domain-specific interview questions
  * Evaluates user answers (semantic quality, relevance)
  * Returns feedback and keyword suggestions

* **Whisper (OpenAI)**:

  * Transcribes spoken audio
  * Identifies and counts **filler words** for fluency scoring

* *(Planned but not yet implemented)* **AssemblyAI**:

  * Intended for **confidence and emotion detection** in future versions

### 4. **Database (Neon + Drizzle ORM)**

* **Neon**: Scalable cloud PostgreSQL solution
* **Drizzle ORM**: Type-safe SQL toolkit for managing schema and migrations
* Stores:

  * User answers
  * Mock interview attempts
  * Feedback, ratings, and keywords
  * Interview history for progress tracking

---

## How to Use

### 1. Clone the repo and install dependencies

```bash
git clone https://github.com/your-username/interview-enhancement-system.git
cd interview-enhancement-system
npm install
```

### 2. **Frontend Setup (Next.js + Clerk + Drizzle + Neon)**

```bash
cd interview_app
npm install
```

Create a `.env.local` file inside the `interview_app` directory and add:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here   # Clerk Pushable key
CLERK_SECRET_KEY=your_key_here                    # Clerk Secret key

NEXT_PUBLIC_ASSEMBLYAI_API_KEY=your_key_here      # Assembly AI API key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

NEXT_PUBLIC_DRIZZLE_DB_URL=your_key_here          # Neon Postgres DB connection URL
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here          # Gemini API key

NEXT_PUBLIC_INFORMATION="To start your AI-generated mock interview, please enable your webcam and microphone. The interview consists of 10 questions. At the end, you'll receive a report based on your answers. Importantly, we never record your video, and you can disable webcam access at any time if desired. This format ensures a comprehensive assessment while maintaining your privacy and control."

NEXT_PUBLIC_QUESTION_NOTE="Click on Record Answer when you want to answer the question. At the end of interview we will give you the feedback along with correct answer for each of question and your answer to compare it"
```

Start the frontend server:

```bash
npm run dev
```

---

### 3. **Backend Setup (Flask + Whisper for Audio Analysis)**

```bash
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Start the Flask server:

```bash
python server.py
```

Ensure Flask runs at `http://localhost:5000` and has **CORS enabled** to allow communication with the frontend.

### 4. **Database Setup (Drizzle ORM + Neon DB)**

Neon is a fully managed PostgreSQL database in the cloud. Drizzle ORM connects to Neon using your connection string from `.env.local`.

Apply schema changes to your database:

```bash
npx drizzle-kit push
```

Launch the schema explorer UI (Drizzle Studio):

```bash
npx drizzle-kit studio
```

Update your `package.json` with custom scripts for convenience:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "db:push": "npx drizzle-kit push",
  "db:studio": "npx drizzle-kit studio"
}
```

### 5. **Usage Workflow**

* Register/Login using **Clerk**
* Select your job position and relevant skills
* Get AI-generated questions using **Gemini API**
* Record your answers via microphone
* Audio is sent to Flask backend, transcribed using **Whisper**
* Get feedback on:

  * Filler words
  * Confidence score
  * Quality of answers (via Gemini)
* View performance and feedback on the dashboard

---

## Project Team

- **Shubham Pandharinath Gunjal** 
- **Hariom Awanish Shukla**   
- **Prajwal Arun Waghmode** 
