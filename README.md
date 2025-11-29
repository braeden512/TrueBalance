# personal-finance-tracker

TrueBalance helps you take control of your finances with ease and clarity.

You can securely enter your purchases, recurring bills, and sources of income which are all stored in a reliable database. We track your financial activity in real time, giving you clear insights into your spending, saving, and overall financial health.

With statistics and visual reports, you’ll always know where your money is going and how to plan ahead. Whether it’s budgeting for the month, managing recurring expenses, or analyzing your income trends, our goal is to make personal finance simple, transparent, and actionable.

# How to run

### Step 1: Clone the repository onto your local machine

### Step 2: Navigate to the outer folder labeled 'personal-finance-tracker'

### Step 3: Go to backend/config/init.sql to upload the `init.sql` file to MySQLWorkBench to create the database

### Step 4: Go to your terminal and write:

#### 1. `cd backend`

- create `.env.development` file & copy and paste below (fill out info)

```
    DB_HOST= # fil out
    DB_USER= # fil out
    DB_PASSWORD= # fill out
    DB_NAME=truebalance
    DB_CONNECTION_LIMIT=10
    JWT_SECRET=devsecret123
    PORT=5001
    OPENAI_API_KEY= # fill out
```

- run 'npm install'

#### 2. `cd ../frontend`

- create `.env.development` file & copy and paste below

```
  NEXT_PUBLIC_API_URL=http://localhost:5001
```

- run 'npm install'

#### 3. `cd ..

- Run 'npm install'
- Run 'npm start'
- The project should be running.

<img width="2878" height="1560" alt="image" src="https://github.com/user-attachments/assets/444dbc46-065b-4355-bf87-692d81caa883" />

<img width="1440" height="778" alt="image" src="https://github.com/user-attachments/assets/9a52a3f7-3e4e-4afa-bece-725a819f5ff1" />

<img width="1435" height="779" alt="image" src="https://github.com/user-attachments/assets/eadf41b3-2e05-40e3-89af-85841bebc342" />

<img width="1440" height="714" alt="image" src="https://github.com/user-attachments/assets/4bc8a7ab-f627-425d-8552-b1fe9e5edf17" />

<img width="1440" height="522" alt="image" src="https://github.com/user-attachments/assets/4e168cfe-d0fd-48ee-9495-1991473164a7" />
