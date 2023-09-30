import Series from "../models/Series";
import GoodreadsScraper from "../../utils/goodreads_scraper";
import BookService from "./books_service";
import AuthorService from "./authors_service";
import { nanoid } from "nanoid";

async function getSeriesByGoodreadsLink({ link }: { link: string }) {
  let series = await Series.query().findOne({
    goodreadsLink: link,
  });

  if (!series) {
    return await createSeriesFromGRLink({ link });
  }

  return series.id;
}


async function createSeriesFromGRLink({ link }: { link: string }) {
  const data = await GoodreadsScraper.scrapeGoodreadsSeriesLink({ link });

  if (!data) {
    throw new Error("Could not get series information");
  }

  const series = await Series.query().insert({
    id: "series_" + nanoid(),
    title: data.title,
    totalBooks: data.totalBooks,
    goodreadsLink: link,
  });

  const author = await AuthorService.getAuthorByGoodreadsLink({ link: data.books[0].goodreadsLinks.author! })

  await BookService.batchCreateBooksFromSeries({
    authorId: author.id,
    seriesId: series.id,
    books: data.books,
  })

  return series.id;
}


export default {
  getSeriesByGoodreadsLink,
  createSeriesFromGRLink,
}