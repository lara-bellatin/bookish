import { Router, Request, Response } from "express";
import BooksService from "../books/services/books_service";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const books = await BooksService.getBooks(req.params);
  return res.send(books);
});

router.get('/:bookId', async (req: Request, res: Response) => {
  const book = await BooksService.getBookById(req.params.bookId);
  return res.send(book);
});

router.post('/', async (req: Request, res: Response) => {
  const bookData = req.body.bookData;
  const book = await BooksService.createBook({ bookData });
  return res.send(book);
});

router.post('/from-goodreads/', async (req: Request, res: Response) => {
  const scraperData = req.body;
  const book = await BooksService.createBookFromScraper(scraperData);
  return res.send(book);
});

router.post('/batch-create', async(req: Request, res: Response) => {
  const books = await BooksService.batchCreateBooks({ booksData: req.body });
  return res.send(books);
});

router.post('/:bookId/update', async(req: Request, res: Response) => {
  const updateData = req.body;
  const book = await BooksService.updateBook({ id: req.params.bookId, updateData });
  return res.send(book);
});

export default router;