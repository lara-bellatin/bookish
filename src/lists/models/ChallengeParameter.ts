import { Model } from "objection";
import BaseModel from "../../utils/BaseModel";
import Challenge from "./Challenge";

class ChallengeParameter extends BaseModel {
  id!: string;
  challengeId: string;
  type: ChallengeParameter.Type;
  property: ChallengeParameter.Property;
  value: string;

  // Relations
  challenge: Challenge;

  static get tableName() {
    return "challenge_parameters";
  }

  static get relationMappings() {
    return {
      challenge: {
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

namespace ChallengeParameter{
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

  export type InputData = {
    challengeId: string;
    type: string;
    property: string;
    value: string;
  }
}

export default ChallengeParameter;