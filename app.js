import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dataProgress from "./data/progress.json";
import progressRouter from "./routes/progressRouter";
import progressModel from "./model/progressModel";

const app = express();
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Erro de conexão."))

let progress = new progressModel(dataProgress);
progress.save(err => {
    if (err) {
        console.error("Erro: " + err);
    } else {
        console.log("Progresso para o usuário test@test.com criado com sucesso!");
    }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use('/progress', progressRouter);

export default app;