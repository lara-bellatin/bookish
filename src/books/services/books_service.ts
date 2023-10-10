import Book from "../models/Book";
import GoodreadsScraper from "../../utils/goodreads_scraper_dynamic";
import AuthorService from "./authors_service";
import SeriesService from "./series_service";
import { nanoid } from "nanoid";


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

  if (!book) {
    return await createBookFromGRLink({ link });
  }

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
    title: bookData.title!,
    authorId: bookData.authorId!,
    seriesId: bookData.seriesId!,
    status: bookData.status!,
    coverImage: bookData.coverImage!,
    publicRating: bookData.publicRating!,
    myRating: bookData.myRating!,
    pageCount: bookData.pageCount!,
    seriesOrder: bookData.seriesOrder!,
  });
}


async function createBookFromGRLink({ link }: { link: string }) {
  const bookInfo = await GoodreadsScraper.scrapeGoodreadsBookLink({ link });

  if (bookInfo.goodreadsLinks.series) {
    await SeriesService.createSeriesFromGRLink({ link: bookInfo.goodreadsLinks.series });

  } else {
    const author = await AuthorService.getAuthorByGoodreadsLink({ link: bookInfo.goodreadsLinks.author! });
    await createBook({
      bookData: { ...bookInfo, authorId: author.id },
    })
  }

  return await Book.query().findOne({
    goodreadsLink: link!,
  }).withGraphFetched('[author, series]');

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
    console.log(i)
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
  createBookFromGRLink,
  batchCreateBooks,
  batchCreateBooksFromSeries,
  updateBook,
}