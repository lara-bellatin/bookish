import Puppeteer, { Browser } from "puppeteer";


export type bookScrape = {
  title?: string | null;
  seriesOrder?: number | null;
  coverImage?: string | null;
  rating?: number | null;
  goodreadsLinks: {
    book: string;
    author?: string | null;
    series?: string | null;
  }
}

export type authorScrape = {
  name?: string | null;
  website?: string | null;
}

export type seriesScrape = {
  title?: string | null;
  totalBooks?: number | null;
  books?: bookScrape[];
}

async function scrapeGoodreadsBookLink({ link, _browser }: { link: string, _browser?: Browser }): Promise<bookScrape> {
  const browser = _browser || await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);

  let bookData: bookScrape = {
    goodreadsLinks: {
      book: link,
    }
  };

  // Book Cover Image
  const coverSectionSelector = "div[class=BookCover__image]"
  bookData.coverImage = await page.$eval(`${coverSectionSelector} > img`, img => img.getAttribute("src"));


  // Title Section
  const titleSectionSelector = "div[class=BookPageTitleSection]";
  bookData.title = await page.$eval(`${titleSectionSelector} > h1`, text => text.textContent);
  const seriesInfo = await page.$eval(`${titleSectionSelector} > h3 > a`, link => link);
  bookData.goodreadsLinks.series = seriesInfo.getAttribute("href");
  bookData.seriesOrder = parseInt(seriesInfo.textContent?.split(" #")[1]!);

  // Metadata Section
  const metadataSectionSelector = "div[class=BookPageMetadataSection]";
  bookData.goodreadsLinks.author = await page.$eval(`${metadataSectionSelector} > a[class=ContributorLink]`, link => link.getAttribute("href"));
  bookData.rating = await page.$eval(`${metadataSectionSelector} > [class=RatingStatistics__rating]`, element => parseFloat(element.textContent!));

  browser.close();

  return bookData;

}


async function scrapeGoodreadsAuthorLink({ link }: { link: string }) {
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);

  let authorData: authorScrape = {};

  authorData.name = await page.$eval("h1[class=authorName > span", text => text.textContent);
  authorData.website = await page.$eval('div[class=dataItem] > a', link => link.getAttribute("href"));

  browser.close();

  return authorData;

}


async function scrapeGoodreadsSeriesLink({ link }: { link: string }) {
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link);

  let seriesData: seriesScrape = { books: [] };

  seriesData.title = await page.$eval("div[class=responsiveSeriesHeader__title] > h1", text => text.textContent?.replace(' Series', ''));
  seriesData.totalBooks = await page.$eval("div[class=responsiveSeriesHeader__subtitle u-paddingBottomSmall]", text => parseInt(text.textContent?.split(' ')[0]!));

  for (let i=1; i<=seriesData.totalBooks; i++) {
    const bookSource = await page.$eval(`h3:contains("Book ${i}") > div[class=u-paddingBottomXSmall] > a`, element => element.getAttribute("href"));
    if (!bookSource) {
      continue;
    } else {
      const bookScrape = await scrapeGoodreadsBookLink({ link: "https://www.goodreads.com" + bookSource, _browser: browser });
      seriesData.books!.push(bookScrape);
    }
  }

  browser.close();

  return seriesData;

}


export default {
  scrapeGoodreadsBookLink,
  scrapeGoodreadsAuthorLink,
  scrapeGoodreadsSeriesLink,
}