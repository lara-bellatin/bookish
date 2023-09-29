import axios from "axios";
import * as Cheerio from "cheerio";

async function scrapeGoodreadsLink({ link }: { link: string }) {
  const request = await axios.get(link);

  if (!request.data) {
    throw new Error("HTML Data could not be retrieved from this link")
  }

  const html = Cheerio.load(request.data);

  const bookInfo = html('[class = BookPage__mainContent]');
  const title = bookInfo.find('h1').text();
  const author = bookInfo.find('span[class=ContributorLink__name]:first').text();
  const seriesInfo = bookInfo.find('h3 > a').text().split(' #');

  const bookCover = html('[class = BookCover__image]');
  const coverImage = bookCover.find('img').attr('src');

  const rating = parseFloat(html('[class=RatingStatistics__rating]').text());

  return {
    title,
    author,
    series: seriesInfo[0],
    seriesOrder: parseInt(seriesInfo[1]),
    coverImage,
    rating,
  }


}

export default {
  scrapeGoodreadsLink
}