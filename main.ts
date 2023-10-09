import express, { Request, Response } from "express";
import BooksService from "./src/books/services/books_service";
import Knex from "knex";
import { Model } from "objection";
import knexConfig from "./knexfile";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

// Initialize DB conn
// @ts-ignore
const knex = Knex(knexConfig[process.env.NODE_ENV]);
Model.knex(knex);

app.get('/add-from-link', async (req: Request, res: Response) => {
  const link = req.query.link as string;
  const book = await BooksService.getBookByGoodreadsLink({ link });

  return res.status(200).send(book)
}) // add exception handler

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export {}