import express from 'express';
import cors from 'cors';
import corsOptions from './config/cors';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.get('/',(_,res) => {
     res.send("P2P Video Conference Signaling Server Running");
})

export default app;