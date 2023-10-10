import Author from "../models/Author";
import GoodreadsScraper from "../../utils/goodreads_scraper";
import { nanoid } from "nanoid";


// QUERIES

async function getAuthorById(id: string) {
  return await Author.query().findById(id);
};

async function getAuthors(params: {[key: string]: string;}) {
  return await Author.query().where(params);
}

async function getAuthorByGoodreadsLink({ link }: { link: string }) {
  let author = await Author.query().findOne({
    goodreadsLink: link,
  });

  if (!author) {
    return await createAuthorFromGRLink({ link });
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

async function createAuthorFromGRLink({ link }: { link: string }) {
  const data = await GoodreadsScraper.scrapeGoodreadsAuthorLink({ link });

  if (!data) {
    throw Error("Could not get author information");
  }

  const authorData: Author.InputData = {
    name: data.name,
    website: data.website,
    goodreadsLink: link,
  };

  return await createAuthor({ authorData });

};

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
  getAuthorByGoodreadsLink,

  //MUTATIONS
  createAuthor,
  createAuthorFromGRLink,
  batchCreateAuthors,
  updateAuthor
}