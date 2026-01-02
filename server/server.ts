import express, { Request, Response } from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import session from 'express-session';


declare module 'express-session'{

}

await connectDB();

const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
}))

app.use(express.json())


app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});