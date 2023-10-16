import Author from "../models/Author";
import { nanoid } from "nanoid";


// QUERIES

async function getAuthorById(id: string) {
  return await Author.query().findById(id);
};

async function getAuthors(params: {[key: string]: string;}) {
  return await Author.query().where(params);
}

async function getAuthorFromNameAndGR({
  name,
  goodreadsLink,
  replaceIfMismatch,
}: {
  name: string;
  goodreadsLink?: string;
  replaceIfMismatch?: boolean;
}): Promise<Author> {
  let author = await Author.query().where({
    name,
    goodreadsLink,
  }).first();

  if (!author) {
    author = await createAuthor({ authorData: {
      name,
      goodreadsLink,
    }})
  } else {
    if (replaceIfMismatch && (author.goodreadsLink !== goodreadsLink)) {
      author = await Author.query().patchAndFetchById(author.id, {
        goodreadsLink,
      })
    }
  }

  return author;
}


// MUTATIONS

async function createAuthor({
  authorData,
}: {
  authorData: Author.InputData;
}): Promise<Author> {
  
  return await Author.query().insert({
    id: "author_" + nanoid(),
    ...authorData,
  });
  
}


async function batchCreateAuthors({
  authorsData,
}: {
  authorsData: Author.InputData[]
}): Promise<Author[]> {

  return await Promise.all(authorsData.map(async i => {
    return await createAuthor({ authorData: i });
  }));

};

async function updateAuthor({
  id,
  updateData,
}: {
  id: string;
  updateData: Author.InputData;
}) {
  return await Author.query().patchAndFetchById(id, updateData);
}


export default {
  // QUERIES
  getAuthorById,
  getAuthors,
  getAuthorFromNameAndGR,

  //MUTATIONS
  createAuthor,
  batchCreateAuthors,
  updateAuthor
}