import axios from "axios";
import * as Cheerio from "cheerio";
import Book from "../books/models/Book";


async function scrapeGoodreadsBookLink({ link }: { link: string }): Promise<Book.InputData> {
  return await axios.get(link, {responseType: 'document'}).then(request => {

    if (!request.data) {
      throw Error("HTML Data could not be retrieved from this link")
    }

    const html = Cheerio.load(request.data);

    const bookData = html('body > div[class=BookPage__gridContainer]');

    // Book Cover Image
    const bookCover = bookData.find('div[class=BookCover__image]');
    const coverImage = bookCover.find('img').attr('src');

    // Title Section info
    const titleSection = bookData.find('div[class=BookPageTitleSection]');
    const title = titleSection.find('h1').text();
    const seriesInfo = titleSection.find('h3 > a');
    const seriesOrder = seriesInfo.text().split(' #')[1];

    // Metadata Section Info
    const metadataSection = bookData.find('div[class=BookPageMetadataSection]');
    const author = metadataSection.find('a[class=ContributorLink]:first').attr('href');
    const rating = parseFloat(metadataSection.find('[class=RatingStatistics__rating]').text());

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
  });
}


async function scrapeGoodreadsAuthorLink({ link }: { link: string }) {
  return await axios.get(link).then(request => {

    if (!request.data) {
      throw Error("HTML Data could not be retrieved from this link")
    }

    const html = Cheerio.load(request.data);

    const authorName = html('h1[class=authorName]').children('span').text();
    const website = html('div[class=dataTitle]:contains("Website")');
    

    return {
      name: authorName,
      website: website ? website.next().attr('href') : null,
    }
  });
}


async function scrapeGoodreadsSeriesLink({ link }: { link: string }) {
  return await axios.get(link).then(async request => {

    if (!request.data) {
      throw Error("HTML Data could not be retrieved from this link")
    }

    const html = Cheerio.load(request.data);

    const title = html('div[class=responsiveSeriesHeader__title] > h1');
    const mainBooks = parseInt(title.parent().next().text().split(' ')[0]);

    const books: Book.InputData[] = [];

    for (let i = 1; i <= mainBooks; i++) {
      const bookElement = html(`h3:contains("Book ${i}"):first`).next();
      const href = bookElement.find('div[class=u-paddingBottomXSmall] > a').attr('href');
      if (!href) {
        continue;
      } else {
        const bookData = await scrapeGoodreadsBookLink({ link: "https://www.goodreads.com" + href });
        books.push(bookData);
      }
    }
    
    return {
      title: title.text().replace(' Series', ''),
      mainBooks,
      additionalBooks: 0,
      books,
    }
  });

}


export default {
  scrapeGoodreadsBookLink,
  scrapeGoodreadsAuthorLink,
  scrapeGoodreadsSeriesLink,
}