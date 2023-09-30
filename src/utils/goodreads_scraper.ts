import axios from "axios";
import * as Cheerio from "cheerio";


export type bookScrape = {
  title: string;
  seriesOrder?: number;
  coverImage?: string;
  rating?: number;
  goodreadsLinks: {
    book: string;
    author?: string;
    series?: string;
  }
}

async function scrapeGoodreadsBookLink({ link }: { link: string }): Promise<bookScrape> {
  const request = await axios.get(link);

  if (!request.data) {
    throw new Error("HTML Data could not be retrieved from this link")
  }

  const html = Cheerio.load(request.data);

  const bookInfo = html('[class = BookPage__mainContent]');
  const title = bookInfo.find('h1').text();
  const author = bookInfo.find('span[class=ContributorLink]:first').attr('href');
  const seriesInfo = bookInfo.find('h3 > a');
  const seriesOrder = seriesInfo.text().split(' #')[1];

  const bookCover = html('[class = BookCover__image]');
  const coverImage = bookCover.find('img').attr('src');

  const rating = parseFloat(html('[class=RatingStatistics__rating]').text());

  return {
    title,
    seriesOrder: parseInt(seriesOrder),
    coverImage,
    rating,
    goodreadsLinks: {
      book: link,
      author,
      series: seriesInfo.attr('href'),
    }
  };
}


async function scrapeGoodreadsAuthorLink({ link }: { link: string }) {
  const request = await axios.get(link);

  if (!request.data) {
    throw new Error("HTML Data could not be retrieved from this link")
  }

  const html = Cheerio.load(request.data);

  const authorName = html('h1[class=authorName]').children('span').text();
  const website = html('div[class=dataTitle]:contains("Website")');
  

  return {
    name: authorName,
    website: website ? website.next().attr('href') : null,
  }

}


async function scrapeGoodreadsSeriesLink({ link }: { link: string }) {
  const request = await axios.get(link);

  if (!request.data) {
    throw new Error("HTML Data could not be retrieved from this link")
  }

  const html = Cheerio.load(request.data);

  const title = html('div[class=responsiveSeriesHeader__title] > h1').text().replace(' Series', '');
  const totalBooks = parseInt(html('div:contains("primary works")').text().split(' ')[0]);

  const books: bookScrape[] = [];

  for (let i = 0; i < totalBooks; i++) {
    const bookElement = html(`h3:contains(${"Book " + i}):first`).next();
    const href = bookElement.find('a > span').parent().attr('href');
    const bookData = await scrapeGoodreadsBookLink({ link: "https://www.goodreads.com" + href });

    books.push(bookData);

  }
  

  return {
    title,
    totalBooks,
    books,
  }

}


export default {
  scrapeGoodreadsBookLink,
  scrapeGoodreadsAuthorLink,
  scrapeGoodreadsSeriesLink,
}