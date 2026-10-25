# Medical Management System — Full Stack (React + Node/Express + PostgreSQL)

A role-based web app for managing patients, doctors, appointments, and
medical records.

Stack: **React** (frontend), **Node.js + Express** (backend API),
**PostgreSQL** (database) via the **Sequelize** ORM, **JWT** for auth.

---

## STEP-BY-STEP: GETTING IT RUNNING FROM ZERO

### Step 1 — Install prerequisites

You need these installed on your computer:
1. **Node.js** (v18 or higher) → download from nodejs.org. Check with `node -v`.
2. **PostgreSQL** (v14+) → download from postgresql.org, or use a free hosted one like [Neon](https://neon.tech) or [Supabase](https://supabase.com) if you don't want to install it locally (recommended if you're not comfortable with local DB setup — it's faster to get going).
3. A code editor — VS Code is fine.

### Step 2 — Unzip the project

Unzip `medical-management-system.zip` anywhere on your computer. You'll get:
```
medical-management-system/
├── backend/     ← the API server, put your database credentials here
├── frontend/    ← the React app
└── README.md    ← this file
```

### Step 3 — Create the database

If using local PostgreSQL, open a terminal and run:
```bash
psql -U postgres
```
Then inside the psql prompt:
```sql
CREATE DATABASE medical_management;
\q
```
If you're using Neon/Supabase instead, just create a project in their
dashboard — they give you a ready-made database and connection details, skip
this step.

### Step 4 — Configure and start the backend

```bash
cd medical-management-system/backend
npm install
```
This installs everything listed in `backend/package.json` (Express, Sequelize, pg, bcrypt, jsonwebtoken, etc).

Now create your real environment file:
```bash
cp .env.example .env
```
Open `backend/.env` in your editor and fill in your actual database
credentials:
```
PORT=5000
DB_NAME=medical_management
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=make_up_any_long_random_string_here
JWT_EXPIRES_IN=7d
```
(If using Neon/Supabase, they give you a host/user/password/db name to fill in instead of `localhost`.)

Start the server:
```bash
npm run dev
```
You should see:
```
PostgreSQL connected
Models synced
Server running on port 5000
```
"Models synced" means Sequelize just created the `users`, `appointments`,
`medical_records`, `symptoms`, and `prescriptions` tables for you
automatically — you don't need to write any SQL by hand.

Leave this terminal running. Open `http://localhost:5000` in a browser — you
should see "Medical Management System API is running".

### Step 5 — Start the frontend

Open a **second terminal** (keep the backend one running):
```bash
cd medical-management-system/frontend
npm install
npm start
```
This opens `http://localhost:3000` automatically with the React app.

### Step 6 — Try it out

1. Click **Register** → create a **doctor** account (pick "Doctor" from the role dropdown).
2. Register a second account, this time as a **patient**.
3. Log in as the patient → **Appointments** → book an appointment with the doctor you created.
4. Log in as the doctor → **Appointments** → change the status to "confirmed" then "completed".
5. Still as the doctor → **Medical Records** → select that patient → add a diagnosis.
6. Log back in as the patient → **Medical Records** → confirm you can see what the doctor wrote.

If all six steps work, your full stack is wired up correctly end to end.

---

## Where everything lives (so you know where to make changes)

```
backend/
├── config/db.js              ← database connection (Sequelize + PostgreSQL)
├── models/                   ← table definitions: User, Appointment, MedicalRecord, Symptom, Prescription
│   └── index.js               ← defines how tables relate to each other (foreign keys)
├── middleware/auth.js        ← checks the JWT on protected routes, checks user role
├── controllers/              ← the actual logic for each API endpoint
├── routes/                   ← maps URLs (e.g. POST /api/auth/login) to controller functions
└── server.js                 ← starts everything, mounts the routes

frontend/src/
├── api/axios.js              ← pre-configured HTTP client that auto-attaches your login token
├── context/AuthContext.jsx   ← holds "who is logged in" for the whole app
├── components/               ← Navbar, PrivateRoute (blocks pages if not logged in / wrong role)
├── pages/                    ← one file per screen (Login, Register, Dashboard, Patients, Appointments, MedicalRecords)
└── App.jsx                   ← defines which URL shows which page
```

To add a new feature, you'd typically touch: a model (if new data), a
controller (new logic), a route (expose it as a URL), and a frontend page
(a form/table to use it) — in that order.

## Data model (ERD in words)

- **users**: id, name, email, password (hashed), role (admin/doctor/patient), phone, specialization, dateOfBirth, gender, address
- **appointments**: id, patientId → users, doctorId → users, date, reason, status, notes
- **medical_records**: id, patientId → users, doctorId → users, appointmentId → appointments, diagnosis, notes
- **symptoms**: id, name, medicalRecordId → medical_records
- **prescriptions**: id, medicine, dosage, duration, medicalRecordId → medical_records

Draw this as a proper ERD diagram (draw.io / Lucidchart) for your report —
it's usually a required deliverable.

## How authentication works (for your viva/defense)

1. User registers or logs in → backend checks credentials, signs a JWT containing their user id, sends it back.
2. Frontend stores that token in `localStorage`.
3. Every subsequent API request automatically attaches it as an `Authorization: Bearer <token>` header (see `frontend/src/api/axios.js`).
4. Backend's `protect` middleware (`backend/middleware/auth.js`) verifies the token on every protected route and looks up the user.
5. `authorize('doctor', 'admin')` middleware then checks the role, if the route needs it.

Passwords are never stored in plain text — `bcryptjs` hashes them before
saving (see the `beforeSave` hook in `backend/models/User.js`).

## Ideas to extend for extra marks

- Email/SMS appointment reminders (Nodemailer/Twilio)
- File uploads for lab reports (Multer + cloud storage)
- Admin dashboard with charts (Chart.js/Recharts)
- Search, filter, and pagination on lists
- Automated tests (Jest + Supertest for the API, React Testing Library for the frontend)
- Replace `sequelize.sync()` with proper migrations (`sequelize-cli`) — more "production-grade," good to mention in your report

## Common viva/defense questions to prepare for

- Why role-based access control, and how is it enforced on both frontend and backend?
- How are passwords protected?
- Walk through the JWT flow end-to-end.
- Why did you pick PostgreSQL/SQL over a NoSQL database for this domain? (medical records have clear, fixed relationships — patients, doctors, appointments — which fits a relational model well; referential integrity — e.g. you can't have an appointment pointing to a doctor that doesn't exist — is enforced by the database itself via foreign keys)
- What would you change to scale this to thousands of users? (indexing on frequently-queried columns like email/patientId, pagination, connection pooling, caching)
