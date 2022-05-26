import axios from 'axios';

export default class SearchServicebyAPI {
  constructor() {
    this.KEY = '27574969-e5fa37593c412d62423f6ba4e';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.page = 1;
    this.searchName = '';
  }

  async requestImages() {
    const searchParams = new URLSearchParams({
      key: this.KEY,
      q: this.searchName,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      page: this.page,
    });
    const response = await axios.get(`${this.BASE_URL}?${searchParams}`);
    this.nextPage();
    return response.data;
  }

  nextPage() {
    this.page += 1;
  }

  clearPage() {
    this.page = 1;
  }
  get query() {
    return this.searchName;
  }

  set query(newQuery) {
    this.searchName = newQuery;
  }
}
