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
  if (bookData.goodreadsLink) {
    const book = await getBookByGoodreadsLink({ link: bookData.goodreadsLink });
    if (book) return book;
  }

  return await Book.query().insert({
    id: "book_" + nanoid(),
    ...bookData,
  });
};

async function createBookFromScraper(scraperData: Book.ScraperData): Promise<Book> {
  const author = await AuthorsService.getAuthorByData({
    authorData: {
      name: scraperData.authorName,
      goodreadsLink: scraperData.authorLink,
    },
    replaceIfMismatch: true,
  });

  const publishDateRaw = scraperData.publicationInfo.split(" by ")[0];
  const publishDate = publishDateRaw ? new Date(publishDateRaw) : undefined;
  const pageCount = parseInt(scraperData.formatInfo.split(' ')[0]);
  let status = Book.Status.TBR;

  if (publishDate! > new Date()) {
    status = Book.Status.UNRELEASED
  } else {
    status = scraperData.status === 'Currently Reading' ? Book.Status.READING : Book.Status.READ;
  }

  const bookData: Book.InputData = {
    title: scraperData.title,
    goodreadsLink: scraperData.goodreadsLink,
    authorId: author.id,
    status,
    mainGenre: scraperData.genre1.toLowerCase(),
    coverImage: scraperData.coverImage,
    publicRating: scraperData.rating,
    pageCount: isNaN(pageCount) ? undefined : pageCount,
    publishDate,
    startDate: scraperData.startDate ? new Date(scraperData.startDate) : undefined,
    finishDate: scraperData.finishDate ? new Date(scraperData.finishDate) : undefined,
};

if (scraperData.seriesInfo) {
  const seriesInfo = scraperData.seriesInfo.split(' #');
  const series = await SeriesService.getSeriesFromTitleAndGR({
    title: seriesInfo[0],
    goodreadsLink: scraperData.seriesLink,
    replaceIfMismatch: true,
  });
  bookData['seriesId'] = series.id;
  bookData['seriesOrder'] = parseInt(seriesInfo[1]);
}

const book = await getBookByGoodreadsLink({ link: scraperData.goodreadsLink });

if (book) {
  return await Book.query().patchAndFetchById(book.id, bookData);
} else {
  return await createBook({ bookData });
} 
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