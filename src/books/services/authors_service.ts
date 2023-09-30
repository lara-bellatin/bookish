import Author from "../models/Author";
import GoodreadsScraper from "../../utils/goodreads_scraper";
import { nanoid } from "nanoid";

async function getAuthorByGoodreadsLink({ link }: { link: string }) {
  let author = await Author.query().findOne({
    goodreadsLink: link,
  });

  if (!author) {
    return await createAuthorFromGRLink({ link });
  }

  return author;
}


async function createAuthorFromGRLink({ link }: { link: string }) {
  const data = await GoodreadsScraper.scrapeGoodreadsAuthorLink({ link });

  if (!data) {
    throw new Error("Could not get author information");
  }

  const author = await Author.query().insert({
    id: "author_" + nanoid(),
    name: data.name,
    website: data.website,
    goodreadsLink: link,
  });

  return author;
}


export default {
  getAuthorByGoodreadsLink,
  createAuthorFromGRLink,
}