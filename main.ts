import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import BooksService from "./src/books/services/books_service";
import Knex from "knex";
import { Model } from "objection";
import knexConfig from "./knexfile";
import routes from "./src/routes";
import "dotenv/config";

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

// Initialize DB conn
// @ts-ignore
const knex = Knex(knexConfig[process.env.NODE_ENV]);
Model.knex(knex);

app.use('/books', routes.books);
app.use('/authors', routes.authors);
app.use('/series', routes.series);
app.use("/collections", routes.collections);
app.use("/challenges", routes.challenges);

app.get('/add-from-link', async (req: Request, res: Response) => {
  const link = req.query.link as string;
  const book = await BooksService.getBookByGoodreadsLink({ link });

  return res.status(200).send(book)
}) // add exception handler

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

export { app };