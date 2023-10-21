import BaseModel from "../../utils/BaseModel";
import { Model } from "objection";
import Book from "../../books/models/Book";
import CollectionMembership from "./CollectionMembership";

class Collection extends BaseModel {
  id!: string;
  name!: string;
  description: string;

  // Relations
  books: Book[];
  memberships: CollectionMembership[];

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
      },
      memberships: {
        relation: Model.HasManyRelation,
        modelClass: CollectionMembership,
        join: {
          from: "collections.id",
          to: "collection_memberships.collectionId",
        }
      }
    }
  }

}

namespace Collection {
  export type InputData = {
    name: string;
    description?: string;
  }
}

export default Collection;