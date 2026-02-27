import express from "express";
import dotenv from "dotenv";
dotenv.config();    
import { PrismaClient } from "@prisma/client";
const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.get("/movies", async (req, res) => {
    const movies = await prisma.movie.findMany();
    res.json(movies)
   
});

app.listen(port, () => {
    console.log(`Servidor em execução na porta http://localhost:${port}`);
     console.log(process.env.DATABASE_URL);
});
