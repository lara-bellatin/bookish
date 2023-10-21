import { Router, Request, Response } from "express";
import CollectionsService from "../lists/services/collections_service";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const collections = await CollectionsService.getCollections(req.params);
  return res.send(collections);
});

router.get('/:collectionId', async (req: Request, res: Response) => {
  const collection = await CollectionsService.getCollectionById(req.params.collectionId);
  return res.send(collection);
});

router.post('/', async (req: Request, res: Response) => {
  const collectionData = req.body.collectionData;
  const bookIds = req.body.bookIds;
  const collection = await CollectionsService.createCollection({ collectionData, bookIds });
  return res.send(collection);
});

router.post('/membership', async (req: Request, res: Response) => {
  const collectionId = req.body.collectionId;
  const bookId = req.body.bookId;
  const collection = await CollectionsService.createCollectionMembership({ collectionId, bookId });
  return res.send(collection);
});

export default router;