import { Router, Request, Response } from "express";
import ChallengesService from "../lists/services/challenge_service";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const challenges = await ChallengesService.getChallenges(req.params);
  return res.send(challenges);
});

router.get('/:challengeId', async (req: Request, res: Response) => {
  const challenge = await ChallengesService.getChallengeById(req.params.challengeId);
  return res.send(challenge);
});

router.post('/', async (req: Request, res: Response) => {
  const challengeData = req.body.challengeData;
  const challengeParameters = req.body.challengeParameters;
  const challenge = await ChallengesService.createChallenge({ challengeData, challengeParameters });
  return res.send(challenge);
});

router.post('/parameter', async (req: Request, res: Response) => {
  const parameterData = req.body;
  const parameter = await ChallengesService.createChallengeParameter(parameterData);
  return res.send(parameter);
});

export default router;