import { Model } from "objection";
import BaseModel from "../../utils/BaseModel";
import ChallengeParameters from "./ChallengeParameters";

class Challenge extends BaseModel {
  id!: string;
  name!: string;
  description: string;
  goal: string;
  total: string;
  start_date: Date;
  end_date: Date;

  // Relations
  challengeParameters: ChallengeParameters[];

  static get tableName() {
    return "challenges";
  }

  static get relationMappings() {
    return {
      "challengeParameters": {
        relation: Model.HasManyRelation,
        modelClass: ChallengeParameters,
        join: {
          from: "challenges.id",
          to: "challenge_parameters.challengeId",
        }
      }
    }
  }

}

export default Challenge;