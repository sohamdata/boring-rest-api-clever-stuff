import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('some dreams stay dreams some dreams come true');
});

const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://admin:soham@cluster0.ffocoq4.mongodb.net/?retryWrites=true&w=majority'

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);

mongoose.connection.on('errror', (err: Error) => {
    console.error('Mongoose error', err);
});
