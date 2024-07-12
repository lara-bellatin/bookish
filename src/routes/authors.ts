import { Router, Request, Response } from "express";
import AuthorsService from "../books/services/authors_service";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const authors = await AuthorsService.getAuthors(req.params);
  return res.send(authors);
});

router.get('/:authorId', async (req: Request, res: Response) => {
  const author = await AuthorsService.getAuthorById(req.params.authorId);
  return res.send(author);
});

router.post('/', async (req: Request, res: Response) => {
  const author = await AuthorsService.getAuthorByData({ authorData: req.body });
  return res.send(author);
});

router.post('/batch-create', async(req: Request, res: Response) => {
  const authors = await AuthorsService.batchCreateAuthors({ authorsData: req.body });
  return res.send(authors);
});

router.post('/:authorId/update', async(req: Request, res: Response) => {
  const updateData = req.body;
  const author = await AuthorsService.updateAuthor({ id: req.params.authorId, updateData });
  return res.send(author);
});

export default router;