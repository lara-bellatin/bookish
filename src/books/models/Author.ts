import BaseModel from "../../utils/BaseModel";
import { Model } from "objection";
import Book from "./Book";
import Series from "./Series";

class Author extends BaseModel {
  id!: string;
  name: string;
  pseudonym: string;
  website: string | null;
  goodreadsLink!: string;


  // Relation
  books: Book[];
  series: Series[];

  static get tableName() {
    return "authors";
  }

  static get relationMappings() {
    return {
      books: {
        relation: Model.HasManyRelation,
        modelClass: Book,
        join: {
          from: "authors.id",
          to: "books.authorId",
        }
      },
      series: {
        relation: Model.HasManyRelation,
        modelClass: Series,
        join: {
          from: "authors.id",
          to: "series.authorId",
        }
      }
    }
  }

}

export default Author;