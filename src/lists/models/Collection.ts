import BaseModel from "../../utils/BaseModel";
import { Model } from "objection";
import Book from "../../books/models/Book";

class Collection extends BaseModel {
  id!: string;
  name!: string;
  description: string;

  // Relations
  books: Book[];

  static get tableName() {
    return "collections";
  }

  static get relationMappings() {
    return {
      books: {
        relation: Model.HasManyRelation,
        modelClass: Book,
        join: {
          from: "collections.id",
          through:{
            from: "collectionMemberships.collectionId",
            to: "collectionMemberships.bookId",
          },
          to: "book.id",
        }
      }
    }
  }

}

export default Collection;