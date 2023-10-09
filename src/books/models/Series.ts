import BaseModel from "../../utils/BaseModel";
import { Model } from "objection";
import Author from "./Author";

class Series extends BaseModel {
  id!: string;
  title!: string;
  rating: number;
  goodreadsLink: string;
  totalBooks: number;

  // Relations
  author: Author;


  static get tableName() {
    return "series";
  }

  static get relationMappings() {
    return {
      author: {
        relation: Model.HasOneRelation,
        modelClass: Author,
        join: {
          from: "series.authorId",
          to: "authors.id",
        }
      }
    }
  }

}

namespace Series {
  export enum Status {
    TBR = "TBR", // To Be Read
    READING = "READING",
    DNF = "DNF", // Did Not Finish
    READ = "READ",
    WAITING = "WAITING", // When I've read all the books that have been released but there's more coming out
  }
}

export default Series;