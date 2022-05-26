import galleryCardTempl from '../partials/gallery-card.hbs';
import SearchServiceByAPI from './search';
import refs from './refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightBox = new simpleLightbox('.gallery a', {
  captions: true,
  captionsselector: 'self',
  captionsType: 'attr',
  captionsAttribute: 'title',
  captionPosition: 'bottom',
  captionDelay: 250,
  showCounter: false,
});

let service = new SearchServiceByAPI();

function cardMarkup(images) {
  const imagesMarkup = images.hits.reduce((acc, image) => {
    return (acc += galleryCardTempl(image));
  }, '');

  refs.gallery.insertAdjacentHTML('beforeend', imagesMarkup);
  lightBox.refresh();
}

async function onFormSubmit(e) {
  e.preventDefault();
  refs.scrollMore.classList.add('hidden');
  service.query = e.currentTarget.elements.searchQuery.value;
  service.clearPage();
  refs.gallery.innerHTML = '';

  try {
    const result = await service.requestImages();

    if (result.hits.length === 0 || service.query === '') {
      throw new Error('Sorry, there are no images matching yout search query. Please try again');
    }

    showInfo(result.totalHits);
    cardMarkup(result);
  } catch (error) {
    Notify.failure(error.message);
  }

  refs.scrollMore.classList.remove('hidden');
}

function showInfo(totalHits) {
  return Notify.info(`Hooray! We found ${totalHits}images.`);
}

let observe = new IntersectionObserver(onEntry, {
  rootMargin: '300px',
});

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && service.query !== '') {
      service.requestImages().then(cardMarkup);
    }
  });
}
observe.observe(refs.scrollMore);
refs.form.addEventListener('submit', onFormSubmit);
