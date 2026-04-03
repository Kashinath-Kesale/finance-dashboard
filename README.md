# 📊 Finance Data Processing and Access Control Backend

Hi there! Welcome to my backend assignment submission. This is a working financial backend built using **NestJS**, **Prisma**, and **PostgreSQL**. 

The main focus of this setup is secure Role-Based Access Control (RBAC), data safety, clean TypeScript code, and being easy to read.

<br/>

---

## 🎯 Core Requirements Fulfilled

I have built out every core requirement requested in the assignment:

- **User & Role Management:** 
  Full CRUD mapping for Users, making sure to handle `VIEWER`, `ANALYST`, and `ADMIN` roles using custom decorators.

- **Financial Records:** 
  Complete tracking of transactions (amount, type, category, date, notes) with dynamic filtering.

- **Dashboard APIs:** 
  Summary reporting for Net Balances, Recent Activity, and Category groupings.

- **Access Control:** 
  `RolesGuard` firmly locks down write-access to Admins while restricting Viewers.

- **Data Persistence & Validation:** 
  Fully integrated PostgreSQL database via Prisma, with helpful `class-validator` DTOs throwing `400 Bad Request` on invalid payloads (like wrong enums).

<br/>

---

## ✨ Extra Features Implemented

I wanted to learn a few extra things and make my code stand out, so I added:

- **Stateless Mock JWT Auth:** Instead of heavy session cookies, I used header-based token authentication (`JwtAuthGuard`). 

- **Pagination:** Added `skip/take` logic for the records endpoint to handle lots of data smoothly.

- **Search:** Added case-insensitive searching to easily filter transaction notes.

- **Raw SQL Aggregations:** Used native PostgreSQL grouping for the Monthly Trends API instead of using slow JavaScript loops.

- **Swagger Auto-Docs:** Wired up a beautiful Swagger UI so you can test all my endpoints easily without opening Postman.

<br/>

---

## 🛠️ Tech Stack & Architecture

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL (with Prisma ORM)
- **Validation:** `class-validator` & Custom DTOs
- **Documentation:** `@nestjs/swagger`

<br/>

---

## 🗄️ Database Schema Design

The data is modeled relationally to enforce strict integrity at the database layer rather than just the application layer:

- **`User` (1) ──► (Many) `FinancialRecord`**
  Enforced via a Foreign Key constraint. If a record is posted without a valid `User.id` payload, the database instantly rejects the transaction.

- **Enums at the DB Level**
  User Roles (`ADMIN`, `ANALYST`, `VIEWER`) and Record Types (`INCOME`, `EXPENSE`) are strictly enforced at the Postgres level.

<br/>

---

## ⚙️ How to Setup & Run Locally

1. **Clone the Repo and enter the backend folder:**
   ```bash
   cd backend
   npm install
   ```

2. **Setup your Environment:**
   Create a `.env` file in the root of the `backend` folder and add your Postgres URL:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"
   PORT=3000
   ```

3. **Run Prisma Migrations (builds the tables):**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start the Server:**
   ```bash
   npm run start:dev
   ```

<br/>

---

## 🧪 Testing the APIs (The Easy Way)

I made reviewing this project super easy. You don't even need Postman or a local database because it is deployed live on Render!

1. Open your browser and go to the live Swagger Dashboard: 
   👉 `https://finance-dashboard-u9x9.onrender.com/api`

2. Go to the `auth` section and use the token generator: 
   `GET /auth/token?userId=first_user&role=ADMIN`

3. Copy the token string from the response.

4. Click the green **Authorize** padlock button at the top of the Swagger page and paste your token. 

5. You are now logged in as an ADMIN! You can click "Try it out" on any route to test the logic.

> ⚠️ **Crucial Database Note:** Because the first token you generated was linked to a fake ID (`"first_user"`), you can safely use it to test `POST /users`. However, before you try to create a *Financial Record* (`POST /records`), you must grab the real UUID of the Admin you just created, generate a *new* token using that real UUID, and update your Swagger Authorization. Otherwise, Postgres will block the record creation because the ID `"first_user"` does not actually exist in the User table!

<br/>

---

## 🤔 Assumptions & Trade-offs I Made

I made a few strategic decisions while building this to balance code quality with making it easy to test:

- **Mocked Auth over Passwords**
  - *Assume:* Reviewers want to test RBAC logic fast without registering 5 different email accounts.
  - *Trade-off:* Skipped `bcrypt`. The `/auth/token` route instantly hands out valid JWTs so testing time drops to zero while keeping security guards fully intact.

- **The Database "Chicken and Egg"**
  - *Assume:* Reviewers don't want to run a complicated CLI seeder script on an empty database.
  - *Trade-off:* Used the mocked token generator to bypass the locked database, get an Admin token, and organically `POST` the first real Admin user directly through Swagger.

- **Prisma vs. Raw SQL (The Trends API)**
  - *Assume:* 95% of queries should prioritize safety (`Prisma`), but analytics endpoints should prioritize speed (`Raw SQL`).
  - *Trade-off:* Prisma ORM guarantees strict type protection. However, using JavaScript to group monthly data scales terribly. For the Trends API, I explicitly used raw Postgres `TO_CHAR` aggregations for maximum performance.

<br/>

---

## 📂 Project Structure Overview

I kept the architecture cleanly separated:

- `src/auth/` - Token generation service.
- `src/user/` - Stores core user identities.
- `src/records/` - Financial CRUD operations, DTOs, and search logic.
- `src/dashboard/` - High-level endpoints calculating Aggregations, Net Balances, and Trends.
- `src/common/guards/` - Where my Bouncers live (`RolesGuard` & `JwtAuthGuard`).

Thank you for reviewing my code, I really enjoyed building this! 
