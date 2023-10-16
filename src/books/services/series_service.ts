import Series from "../models/Series";
import { nanoid } from "nanoid";

// QUERIES

async function getSeriesById(id: string) {
  return await Series.query().findById(id);
};

async function getSeries(params: {[key: string]: string | number}) {
  return await Series.query().where(params);
}

async function getSeriesFromTitleAndGR({
  title,
  goodreadsLink,
  replaceIfMismatch,
}: {
  title: string;
  goodreadsLink?: string;
  replaceIfMismatch?: boolean;
}): Promise<Series> {
  let series = await Series.query().where({
    title,
    goodreadsLink,
  }).first();

  if (!series) {
    series = await createSeries({ seriesData: {
      title,
      goodreadsLink,
    }})
  } else {
    if (replaceIfMismatch && (series.goodreadsLink !== goodreadsLink)) {
      series = await Series.query().patchAndFetchById(series.id, {
        goodreadsLink,
      })
    }
  }

  return series;
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
  getSeriesFromTitleAndGR,

  // MUTATIONS
  createSeries,
  batchCreateSeries,
  updateSeries
}