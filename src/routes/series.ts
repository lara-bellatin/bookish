import { Router, Request, Response } from "express";
import SeriesService from "../books/services/series_service";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const series = await SeriesService.getSeries(req.params);
  return res.send(series);
});

router.get('/:seriesId', async (req: Request, res: Response) => {
  const series = await SeriesService.getSeriesById(req.params.seriesId);
  return res.send(series);
});

router.post('/', async (req: Request, res: Response) => {
  const series = await SeriesService.createSeries({ seriesData: req.body });
  return res.send(series);
});

router.post('/batch-create', async(req: Request, res: Response) => {
  const series = await SeriesService.batchCreateSeries({ seriesData: req.body });
  return res.send(series);
});

router.post('/:seriesId/update', async(req: Request, res: Response) => {
  const updateData = req.body;
  const series = await SeriesService.updateSeries({ id: req.params.seriesId, updateData });
  return res.send(series);
});

export default router;