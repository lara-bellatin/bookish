
import axios from "axios";


async function searchBook({ q }: { q: string }) {
  const url = 'https://www.googleapis.com/books/v1/volumes';

  const results = await axios.get(url, {
    params: {
      q
    },
  });
  return results.data
}

export default {
  searchBook,
}