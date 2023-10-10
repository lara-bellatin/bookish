import Puppeteer, { Browser } from "puppeteer";
import Book from "../books/models/Book";
import Author from "../books/models/Author";
import Series from "../books/models/Series";

async function scrapeGoodreadsBookLink({ link, _browser }: { link: string, _browser?: Browser }): Promise<Book.InputData> {
  const browser = _browser || await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);

  // Book Cover Image
  const coverSectionSelector = "div[class=BookCover__image]"
  const coverImage = await page.$eval(`${coverSectionSelector} > img`, img => img.getAttribute("src"));


  // Title Section
  const titleSectionSelector = "div[class=BookPageTitleSection]";
  const title = await page.$eval(`${titleSectionSelector} > h1`, text => text.textContent);
  const seriesInfo = await page.$eval(`${titleSectionSelector} > h3 > a`, link => link);
  const seriesLink = seriesInfo.getAttribute("href");
  const seriesOrder = parseInt(seriesInfo.textContent?.split(" #")[1]!);

  // Metadata Section
  const metadataSectionSelector = "div[class=BookPageMetadataSection]";
  const authorLink = await page.$eval(`${metadataSectionSelector} > a[class=ContributorLink]`, link => link.getAttribute("href"));
  const rating = await page.$eval(`${metadataSectionSelector} > [class=RatingStatistics__rating]`, element => parseFloat(element.textContent!));

  browser.close();

  const bookData: Book.InputData = {
    title: title!,
    seriesOrder,
    coverImage: coverImage!,
    publicRating: rating!,
    goodreadsLinks: {
      book: link,
      series: seriesLink!,
      author: authorLink!,
    }
  };

  return bookData;

}


async function scrapeGoodreadsAuthorLink({ link }: { link: string }) {
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);

  const name = await page.$eval("h1[class=authorName > span", text => text.textContent);
  const website = await page.$eval('div[class=dataItem] > a', link => link.getAttribute("href"));

  browser.close();

  const authorData: Author.InputData = {
    name: name!,
    website: website!,
  };

  return authorData;

}


async function scrapeGoodreadsSeriesLink({ link }: { link: string }) {
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);

  const title = await page.$eval("div[class=responsiveSeriesHeader__title] > h1", text => text.textContent?.replace(' Series', ''));
  const mainBooks = await page.$eval("div[class=responsiveSeriesHeader__subtitle u-paddingBottomSmall]", text => parseInt(text.textContent?.split(' ')[0]!));

  const books: Book.InputData[] = [];

  for (let i=1; i<=mainBooks; i++) {
    const bookSource = await page.$eval(`h3:contains("Book ${i}") > div[class=u-paddingBottomXSmall] > a`, element => element.getAttribute("href"));
    if (!bookSource) {
      continue;
    } else {
      const bookScrape = await scrapeGoodreadsBookLink({ link: "https://www.goodreads.com" + bookSource, _browser: browser });
      books!.push(bookScrape);
    }
  }

  browser.close();

  const seriesData: Series.InputData = { 
    title: title!,
    mainBooks: mainBooks!,
    additionalBooks: 0,
  };

  return { seriesData, books };

}


export default {
  scrapeGoodreadsBookLink,
  scrapeGoodreadsAuthorLink,
  scrapeGoodreadsSeriesLink,
}