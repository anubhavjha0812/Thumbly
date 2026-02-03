# Server Setup Guide

```bash
mkdir server
cd server
npm init -y
npm install express
npm install -D typescript tsx @types/node ts-node @types/express nodemon
npx tsc --init
```

## Fix the tsconfig.json

Ensure your `tsconfig.json` is properly configured for a Node.js + Express + TypeScript setup.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

## Fix the package.json

```json
{
  "name": "server",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "nodemon": "^3.0.0",
    "ts-node": "^10.9.1",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Install Additional Dependencies

```bash
npm install cors dotenv
npm install -D @types/cors
```

## Database Configuration

* **Database Password:** `qJc7v3**********`
* **Important:** Make sure to update the **IP Access List** of the database to **Allow Access from Anywhere (0.0.0.0/0)**.

```bash
npm install mongoose
```

## Create Config Folder

Create a `config` folder and add a basic boilerplate to connect with the database and export it.

```ts
// src/config/db.ts
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
```

## Import DB Config in Server

```ts
// src/index.ts
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

const app = express();

await connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
```

## Configure CORS

```ts
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);
```

## Authentication Using Session

```bash
npm install express-session
npm install -D @types/express-session
```

## Password Encryption

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

## Session Store with MongoDB

```bash
npm install connect-mongo
```

Use `MongoStore` from `connect-mongo` to store session data in MongoDB.

```ts
import session from "express-session";
import MongoStore from "connect-mongo";

app.use(
  session({
    name: "session-id",
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI as string
    }),
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);
```

## Controllers Setup

Create a `controller` folder.

### User Registration Controller

```ts
// src/controller/register.controller.ts
import bcrypt from "bcrypt";

// user registration logic (config)
```

### User Login Controller

```ts
// src/controller/login.controller.ts
import bcrypt from "bcrypt";

// user login logic
```

---

All steps above must be followed sequentially to ensure a fully functional backend setup with authentication, session management, and MongoDB integration.
