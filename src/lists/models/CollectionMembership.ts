import BaseModel from "../../utils/BaseModel";
import { Model } from "objection";
import Book from "../../books/models/Book";
import Collection from "./Collection";

class CollectionMembership extends BaseModel {
  id!: string;
  bookId!: string;
  collectionId!: string;

  // Relations
  collection: Collection;
  book: Book;

  static get tableName() {
    return "collectionMemberships";
  }

  static get relationMappings() {
    return {
      collection: {
        relation: Model.HasOneRelation,
        modelClass: Collection,
        join: {
          from: "collectionMemberships.collectionId",
          to: "collections.id",
        }
      },
      book: {
        relation: Model.HasOneRelation,
        modelClass: Book,
        join: {
          from: "collectionMemberships.bookId",
          to: "books.id",
        }
      }
    }
  }
  
}

export default CollectionMembership;