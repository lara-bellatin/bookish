import Book from "../models/Book";
import GoodreadsScraper, { bookScrape } from "../../utils/goodreads_scraper_dynamic";
import AuthorService from "./authors_service";
import SeriesService from "./series_service";
import { nanoid } from "nanoid";


async function getBookByGoodreadsLink({ link }: { link: string }) {
  const book = await Book.query().findOne({
    goodreadsLink: link!,
  }).withGraphFetched('[author, series]')

  if (!book) {
    return await createBookFromGRLink({ link });
  }

  return book;
}


async function createBookFromGRLink({ link }: { link: string }) {
  const bookInfo = await GoodreadsScraper.scrapeGoodreadsBookLink({ link });

  if (bookInfo.goodreadsLinks.series) {
    await SeriesService.createSeriesFromGRLink({ link: bookInfo.goodreadsLinks.series });

  } else {
    const author = await AuthorService.getAuthorByGoodreadsLink({ link: bookInfo.goodreadsLinks.author! });
    await createBook({
      scrapeData: bookInfo,
      authorId: author.id,
    })
  }

  return await Book.query().findOne({
    goodreadsLink: link!,
  }).withGraphFetched('[author, series]');

}

async function createBook({
  scrapeData,
  authorId,
  seriesId
}: {
  scrapeData: bookScrape,
  authorId?: string,
  seriesId?: string
}) {
  return await Book.query().insert({
    id: "book_" + nanoid(),
    title: scrapeData.title!,
    authorId,
    seriesId,
    coverImage: scrapeData.coverImage!,
    publicRating: scrapeData.rating!,
    seriesOrder: scrapeData.seriesOrder!,
  });
}


async function batchCreateBooksFromSeries({
  seriesId,
  authorId,
  books,
}: {
  seriesId: string;
  authorId: string;
  books: bookScrape[];
}) {
  for (let i=0; i < books.length; i++) {
    await createBook({ 
      scrapeData: books[i],
      authorId,
      seriesId,
    });
  }
}

export default {
  getBookByGoodreadsLink,
  createBookFromGRLink,
  batchCreateBooksFromSeries,
}