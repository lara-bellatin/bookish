import Book from "../models/Book";
import { nanoid } from "nanoid";
import AuthorsService from "./authors_service";
import SeriesService from "./series_service";


// QUERIES

async function getBookById(id: string) {
  return await Book.query().findById(id);
}

async function getBooks(params: {[key: string]: string;}) {
  return await Book.query().where(params);
}

async function getBookByGoodreadsLink({ link }: { link: string }) {
  const book = await Book.query().findOne({
    goodreadsLink: link!,
  }).withGraphFetched('[author, series]')

  return book;
}



// MUTATIONS

async function createBook({
  bookData,
}: {
  bookData: Book.InputData,
}) {
  return await Book.query().insert({
    id: "book_" + nanoid(),
    ...bookData,
  });
};

async function createBookFromScraper(scraperData: Book.ScraperData): Promise<Book> {
  console.log("Publication Info: ", scraperData.publicationInfo);

  const author = await AuthorsService.getAuthorFromNameAndGR({
    name: scraperData.authorName,
    goodreadsLink: scraperData.authorLink,
    replaceIfMismatch: true,
  });

  const seriesInfo = scraperData.seriesInfo.split(' #');
  const series = await SeriesService.getSeriesFromTitleAndGR({
    title: seriesInfo[0],
    goodreadsLink: scraperData.seriesLink,
    replaceIfMismatch: true,
  });

  const publishDate = new Date(scraperData.publicationInfo.split(" by ")[0]);
  const pageCount = parseInt(scraperData.publicationInfo.split(' ')[1]);

  const bookData: Book.InputData = {
    title: scraperData.title,
    goodreadsLink: scraperData.goodreadsLink,
    authorId: author.id,
    seriesId: series.id,
    status: Book.Status.TBR,
    coverImage: scraperData.coverImage,
    publicRating: scraperData.rating,
    pageCount,
    seriesOrder: parseInt(seriesInfo[1]),
    publishDate,
};

  return await createBook({ bookData });
}

async function batchCreateBooksFromSeries({
  seriesId,
  authorId,
  books,
}: {
  seriesId: string;
  authorId: string;
  books: Book.InputData[];
}) {
  for (let i=0; i < books.length; i++) {
    await createBook({ 
      bookData: { ...books[i], authorId, seriesId },
    });
  }
};

async function batchCreateBooks({
  booksData,
}: {
  booksData: Book.InputData[]
}): Promise<Book[]> {
  return await Promise.all(booksData.map(async i => {
    return await createBook({ bookData: i });
  }));

};

async function updateBook({
  id,
  updateData,
}: {
  id: string;
  updateData: Book.InputData;
}) {
  return await Book.query().patchAndFetchById(id, updateData);
}

export default {
  // QUERIES
  getBookById,
  getBookByGoodreadsLink,
  getBooks,

  // MUTATIONS
  createBook,
  createBookFromScraper,
  batchCreateBooks,
  batchCreateBooksFromSeries,
  updateBook,
}