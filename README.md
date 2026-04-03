# 📊 Finance Data Processing and Access Control Backend

Hi there! Welcome to my backend assignment submission. This is a working financial backend built using **NestJS**, **Prisma**, and **PostgreSQL**. 

The main focus of this setup is secure Role-Based Access Control (RBAC), data safety, clean TypeScript code, and being easy to read.

---

## 🎯 Core Requirements Fulfilled
I have built out every core requirement requested in the assignment:
- **User & Role Management:** Full CRUD mapping for Users, making sure to handle `VIEWER`, `ANALYST`, and `ADMIN` roles using custom decorators.
- **Financial Records:** Complete tracking of transactions (amount, type, category, date, notes) with dynamic filtering.
- **Dashboard APIs:** Summary reporting for Net Balances, Recent Activity, and Category groupings.
- **Access Control:** `RolesGuard` firmly locks down write-access to Admins while restricting Viewers.
- **Data Persistence & Validation:** Fully integrated PostgreSQL database via Prisma, with helpful `class-validator` DTOs throwing `400 Bad Request` on invalid payloads (like wrong enums).

---

## ✨ Extra Features Implemented
I wanted to learn a few extra things and make my code stand out, so I added:
- **Stateless Mock JWT Auth:** Instead of heavy session cookies, I used header-based token authentication (`JwtAuthGuard`). 
- **Pagination:** Added `skip/take` logic for the records endpoint to handle lots of data smoothly.
- **Search:** Added case-insensitive searching to easily filter transaction notes.
- **Raw SQL Aggregations:** Used native PostgreSQL grouping for the Monthly Trends API instead of using slow JavaScript loops.
- **Swagger Auto-Docs:** Wired up a beautiful Swagger UI so you can test all my endpoints easily without opening Postman.

---

## 🛠️ Tech Stack
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL (with Prisma ORM)
- **Validation:** `class-validator` & Custom DTOs
- **Documentation:** `@nestjs/swagger`

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

---

## 🧪 Testing the APIs (The Easy Way)
I made reviewing this project super easy. Once the server is running, you don't even need Postman!

1. Open your browser and go to `http://localhost:3000/api`
2. Go to the `auth` section and use the token generator: `GET /auth/token?userId=first_user&role=ADMIN`
3. Copy the token string from the response.
4. Click the green **Authorize** padlock button at the top of the Swagger page and paste your token. 
5. You are now logged in as an ADMIN! You can click "Try it out" on any route to test the logic.

---

## 🤔 Assumptions & Trade-offs I Made

I made a few strategic decisions while building this to balance code quality with making it easy to test.

**1. Mocked Auth over Real Passwords**
- **The Assumption:** I figured that as reviewers, you just want to test the role logic (Viewers vs Admins) fast without having to register 5 different email/password accounts.
- **The Trade-off:** I skipped building a full password hashing system. Instead, the `/auth/token` route instantly hands you valid JWT tokens just by typing the role in the URL. This saves grading time while keeping the actual endpoint security super safe.

**2. The Database "Chicken and Egg" Problem**
- **The Assumption:** Normally, an empty database means nobody can log in to create the first Admin user. I didn't want you to have to run a complicated Raw SQL seeder script just to test my code.
- **The Trade-off:** Because the token generator is mocked, you can get an Admin token off an empty database, use Swagger to authorize yourself, and then just run `POST /users` to create the first user dynamically!

**3. Prisma vs Raw SQL**
- **The Assumption:** 95% of queries should be super safe to prevent SQL injection.
- **The Trade-off:** Using Prisma ORM abstracts the database, which adds backend overhead. However, the strong type checking it provides is totally worth it. For the 5% of queries that required complex mapping (like my Monthly Trends API), I used Raw Prisma SQL because using JavaScript loops to group data creates performance bottlenecks.

---

## 📂 Project Structure Overview
I kept the architecture modular exactly as NestJS is supposed to be:
- `src/auth/` - The JWT token generation service.
- `src/user/` - Stores the core user identities.
- `src/records/` - All financial CRUD operations, schema DTOs, and search logic.
- `src/dashboard/` - High-level endpoints calculating Aggregations, Net Balances, and Trends.
- `src/common/guards/` - Where my Bouncers live (`RolesGuard` & `JwtAuthGuard`).

Thank you for reviewing my code, I really enjoyed building this! ✌️
