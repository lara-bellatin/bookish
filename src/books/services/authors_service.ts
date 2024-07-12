import Author from "../models/Author";
import { nanoid } from "nanoid";


// QUERIES

async function getAuthorById(id: string) {
  return await Author.query().findById(id);
};

async function getAuthors(params: {[key: string]: string;}) {
  return await Author.query().where(params);
}

async function getAuthorByData({
  authorData,
  replaceIfMismatch,
}: {
  authorData: {name: string; website?: string; goodreadsLink?: string};
  replaceIfMismatch?: boolean;
}): Promise<Author> {
  let author = await Author.query().where(authorData).first();

  if (!author) {
    author = await createAuthor({ authorData})
  } else {
    if (replaceIfMismatch && authorData.goodreadsLink && (author.goodreadsLink !== authorData.goodreadsLink)) {
      author = await Author.query().patchAndFetchById(author.id, {
        goodreadsLink: authorData.goodreadsLink
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
    const author = await getAuthorByData({ authorData: { name: i.name, goodreadsLink: i.goodreadsLink }, replaceIfMismatch: true });
    return await updateAuthor({ id: author.id, updateData: i})
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
  getAuthorByData,

  //MUTATIONS
  createAuthor,
  batchCreateAuthors,
  updateAuthor
}