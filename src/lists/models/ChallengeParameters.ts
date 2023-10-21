import { Model } from "objection";
import BaseModel from "../../utils/BaseModel";
import Challenge from "./Challenge";

class ChallengeParameters extends BaseModel {
  id!: string;
  type: ChallengeParameters.Type;
  property: ChallengeParameters.Property;
  value: string;

  // Relations
  challenge: Challenge;

  static get tableName() {
    return "challenge_parameters";
  }

  static get relationMappings() {
    return {
      "challenge": {
        relation: Model.HasOneRelation,
        modelClass: Challenge,
        join: {
          from: "challenge_parameters.challengeId",
          to: "challenges.id",
        }
      }
    }
  }

}

namespace ChallengeParameters{
  export enum Type {
    INCLUDE = "INCLUDE",
    EXCLUDE = "EXCLUDE",
  }

  export enum Property {
    TITLE = "TITLE",
    SERIES = "SERIES",
    AUTHOR = "AUTHOR",
    GENRE = "GENRE",
  }
}

export default ChallengeParameters;