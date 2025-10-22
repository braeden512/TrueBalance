# personal-finance-tracker

TrueBalance helps you take control of your finances with ease and clarity.

You can securely enter your purchases, recurring bills, and sources of income which are all stored in a reliable database. We track your financial activity in real time, giving you clear insights into your spending, saving, and overall financial health.

With statistics and visual reports, you’ll always know where your money is going and how to plan ahead. Whether it’s budgeting for the month, managing recurring expenses, or analyzing your income trends, our goal is to make personal finance simple, transparent, and actionable.

# How to run

### Step 1: Clone the repository onto your local machine

### Step 2: Navigate to the outer folder labeled 'personal-finance-tracker'

### Step 3: Go to backend/config/init.sql to upload the `init.sql` file to MySQLWorkBench to create the database

### Step 4: Go to your terminal and write:

#### 1. cd frontend

- create `.env.development` file & copy and paste below (fill out info)

```
    DB_HOST= # fil out
    DB_USER= # fil out
    DB_PASSWORD= # fill out
    DB_NAME=truebalance
    DB_CONNECTION_LIMIT=10
    JWT_SECRET=devsecret123
    PORT=5001
```

- run 'npm install'

#### 2. cd ../backend

- create `.env.development` file & copy and paste below

```
  NEXT_PUBLIC_API_URL=http://localhost:5001
```

- run 'npm install'

#### 3. cd ..

- Run 'npm install'
- Run 'npm start'
- The project should be running.

# Pictures

<img width="1916" height="908" alt="image" src="https://github.com/user-attachments/assets/eaa93420-64fb-4ce0-9740-92fe252e7dee" />

<img width="1916" height="905" alt="image" src="https://github.com/user-attachments/assets/b8a99d9f-4411-476e-8cd1-a10cf0a779e9" />
