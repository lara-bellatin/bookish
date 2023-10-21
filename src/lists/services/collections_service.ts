import Collection from "../models/Collection";
import CollectionMembership from "../models/CollectionMembership";
import { nanoid } from "nanoid";
import BooksService from "../../books/services/books_service";

// QUERIES

async function getCollectionById(id: string) {
  return await Collection.query().findById(id).withGraphFetched("[books, collectionMemberships]");
};

async function getCollections(params: {[key: string]: string;}) {
  return await Collection.query().where(params);
}


// MUTATIONS

async function createCollection({
  collectionData,
  bookIds,
}: {
  collectionData: Collection.InputData;
  bookIds?: string[]
}): Promise<Collection> {

  const collection = await Collection.query().insert({
    id: "collec_" + nanoid(),
    ...collectionData,
  });

  if (bookIds && bookIds.length) {
    await Promise.all(bookIds.map(async bookId => {
      const book = await BooksService.getBookById(bookId);
      if (book) {
        collection.books.push(book);
        const membership = await createCollectionMembership({
          bookId: bookId,
          collectionId: collection.id,
        });
  
        collection.memberships.push(membership);
      }

    }));
  }

  return collection;
};

async function createCollectionMembership({
  bookId,
  collectionId,
}: {
  bookId: string;
  collectionId: string;
}): Promise<CollectionMembership> {
  return await CollectionMembership.query().insert({
    id: "comem_" + nanoid(),
    bookId,
    collectionId,
  });
};


export default {
  // QUERIES
  getCollectionById,
  getCollections,

  // MUTATIONS
  createCollection,
  createCollectionMembership,
}