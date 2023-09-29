import express, { Request, Response } from "express";
import BooksService from "./src/books/services/books_service";
import GoodreadsScraper from "./src/utils/goodreads_scraper";

const app = express();
const port = 3000;

app.get('/search', async (req: Request, res: Response) => {
  const q = req.query.q as string;
  const results = await BooksService.searchBook({ q });

  return res.status(200).send(results)
}) // add exception handler

app.get('/scrape', async (req: Request, res: Response) => {
  const link = req.query.link as string;
  const results = await GoodreadsScraper.scrapeGoodreadsLink({ link });

  return res.status(200).send(results);
}) //add exception handler

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export {}