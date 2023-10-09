import BaseModel from "../../utils/BaseModel";
import { Model } from "objection";
import Author from "./Author";
import Series from "./Series";
import Collection from "../../lists/models/Collection";

class Book extends BaseModel {
  id!: string;
  title!: string;
  authorId!: string;
  coverImage: string;
  seriesId: string;
  mainGenre: string;
  goodreadsLink!: string;
  publishDate: Date;
  pageCount: number;
  owned: boolean;
  status: Book.Status;
  favorite: boolean;
  publicRating: number;
  myRating: number;
  seriesOrder: number;
  startDate: Date;
  finishDate: Date;


  // Relation
  author: Author;
  series: Series;
  collections: Collection[];

  static get tableName() {
    return "books"
  }

  static get relationMappings() {
    return {
      author: {
        relation: Model.HasOneRelation,
        modelClass: Author,
        join: {
            from: "books.authorId",
            to: "authors.id",
        },
      },
      series: {
        relation: Model.HasOneRelation,
        modelClass: Series,
        join: {
          from: "books.seriesId",
          to: "series.id",
        }
      },
      collections: {
        relation: Model.HasManyRelation,
        modelClass: Collection,
        join: {
          from: "book.id",
          through:{
            from: "collectionMemberships.bookId",
            to: "collectionMemberships.collectionId",
          },
          to: "collections.id",
        }
      },
    }
  }

}

namespace Book {
  export enum Status {
    UNRELEASED = "UNRELEASED",
    TBR = "TBR",
    READING = "READING",
    DNF = "DNF",
    READ = "READ",
  }
}

export default Book;