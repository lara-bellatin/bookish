import Series from "../models/Series";
import GoodreadsScraper from "../../utils/goodreads_scraper";
import BookService from "./books_service";
import AuthorService from "./authors_service";
import { nanoid } from "nanoid";

// QUERIES

async function getSeriesById(id: string) {
  return await Series.query().findById(id);
};

async function getSeries(params: {[key: string]: string | number}) {
  return await Series.query().where(params);
}

async function getSeriesByGoodreadsLink({ link }: { link: string }) {
  let series = await Series.query().findOne({
    goodreadsLink: link,
  });

  if (!series) {
    return await createSeriesFromGRLink({ link });
  }

  return series.id;
}


// MUTATIONS

async function createSeries({
  seriesData,
}: {
  seriesData: Series.InputData;
}): Promise<Series> {

  return await Series.query().insert({
    id: "series_" + nanoid(),
    ...seriesData,
  });

}


async function createSeriesFromGRLink({ link }: { link: string }) {
  const data = await GoodreadsScraper.scrapeGoodreadsSeriesLink({ link });

  if (!data) {
    throw Error("Could not get series information");
  }

  const series = await createSeries({ seriesData: {
      ...data,
      goodreadsLink: link,
    }
  });

  const author = await AuthorService.getAuthorByGoodreadsLink({ link: data.books[0].goodreadsLinks.author! })

  await BookService.batchCreateBooksFromSeries({
    authorId: author.id,
    seriesId: series.id,
    books: data.books,
  })

  return series.id;
};

async function batchCreateSeries({
  seriesData,
}: {
  seriesData: Series.InputData[]
}): Promise<Series[]> {

  return await Promise.all(seriesData.map(async i => {
    return await createSeries({ seriesData: i });
  }));

};

async function updateSeries({
  id,
  updateData,
}: {
  id: string;
  updateData: Series.InputData;
}) {
  return await Series.query().patchAndFetchById(id, updateData);
}



export default {
  // QUERIES
  getSeriesById,
  getSeries,
  getSeriesByGoodreadsLink,

  // MUTATIONS
  createSeries,
  createSeriesFromGRLink,
  batchCreateSeries,
  updateSeries
}