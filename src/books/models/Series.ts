import BaseModel from "../../utils/BaseModel";
import { Model } from "objection";
import Author from "./Author";
import Book from "./Book";

class Series extends BaseModel {
  id!: string;
  title!: string;
  rating: number;
  goodreadsLink: string;
  mainBooks: number;
  additionalBooks: number;

  // Relations
  author: Author;
  books: Book[];


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
      },
      books: {
        relation: Model.HasManyRelation,
        modelClass: Book,
        join: {
          from: "series.id",
          to: "books.seriesId",
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

  export type InputData = {
    title: string;
    authorId?: string;
    rating?: number;
    mainBooks?: number;
    additionalBooks?: number;
    goodreadsLink?: string;
  }
}

export default Series;