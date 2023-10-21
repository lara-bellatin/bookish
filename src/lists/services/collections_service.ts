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

async function getCollectionMembershipById(id: string) {
  return await CollectionMembership.query().findById(id);
}

async function getCollectionMembershipByMembers({ collectionId, bookId }: { collectionId: string; bookId: string }) {
  return await CollectionMembership.query().findOne({
    collectionId,
    bookId,
  });
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
        await createCollectionMembership({
          bookId: bookId,
          collectionId: collection.id,
        });
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
  const membership = await getCollectionMembershipByMembers({ collectionId, bookId });

  if (membership) {
    return membership;
  }

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
  getCollectionMembershipById,
  getCollectionMembershipByMembers,

  // MUTATIONS
  createCollection,
  createCollectionMembership,
}