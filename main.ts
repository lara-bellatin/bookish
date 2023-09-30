import express, { Request, Response } from "express";
import BooksService from "./src/books/services/books_service";

const app = express();
const port = 3000;

app.get('/add-from-link', async (req: Request, res: Response) => {
  const link = req.query.link as string;
  const book = await BooksService.getBookByGoodreadsLink({ link });

  return res.status(200).send(book)
}) // add exception handler

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export {}