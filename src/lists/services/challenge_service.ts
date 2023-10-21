import Challenge from "../models/Challenge";
import ChallengeParameter from "../models/ChallengeParameter";
import { nanoid } from "nanoid";

// QUERIES

async function getChallengeById(id: string) {
  return await Challenge.query().findById(id).withGraphFetched("[parameters]");
};

async function getChallenges(params: {[key: string]: string;}) {
  return await Challenge.query().where(params).withGraphFetched("[parameters]");
}


// MUTATIONS

async function createChallenge({
  challengeData,
  challengeParameters,
}: {
  challengeData: Challenge.InputData;
  challengeParameters: ChallengeParameter.InputData[];
}): Promise<Challenge> {

  const challenge = await Challenge.query().insert({
    id: "challenge_" + nanoid(),
    ...challengeData,
  });

  challenge.parameters = await Promise.all(challengeParameters.map(async parameter => {
    return await createChallengeParameter({
      challengeId: challenge.id,
      type: parameter.type as ChallengeParameter.Type,
      property: parameter.property as ChallengeParameter.Property,
      value: parameter.value,
    })
  }));

  return challenge;
};

async function createChallengeParameter({
  challengeId,
  type,
  property,
  value
}: {
  challengeId: string;
  type: ChallengeParameter.Type;
  property: ChallengeParameter.Property;
  value: string;
}): Promise<ChallengeParameter> {
  return await ChallengeParameter.query().insert({
    id: "chpar_" + nanoid(),
    challengeId,
    type,
    property,
    value,
  });
};


export default {
  // QUERIES
  getChallengeById,
  getChallenges,

  // MUTATIONS
  createChallenge,
  createChallengeParameter,
}