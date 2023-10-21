import { Model } from "objection";
import BaseModel from "../../utils/BaseModel";
import ChallengeParameter from "./ChallengeParameter";

class Challenge extends BaseModel {
  id!: string;
  name!: string;
  description: string;
  goal: number;
  total: number;
  startDate: Date;
  endDate: Date;

  // Relations
  parameters: ChallengeParameter[];

  static get tableName() {
    return "challenges";
  }

  static get relationMappings() {
    return {
      parameters: {
        relation: Model.HasManyRelation,
        modelClass: ChallengeParameter,
        join: {
          from: "challenges.id",
          to: "challenge_parameters.challengeId",
        }
      }
    }
  }

}

namespace Challenge {
  export type InputData = {
    name: string;
    description?: string;
    goal?: number;
    startDate?: Date;
    endDate?: Date;
  }
}

export default Challenge;