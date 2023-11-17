import axios from 'axios';
import { fetchImages } from './pixabay.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
axios.defaults.headers.common['x-api-key'] =
  'live_Xf6ifD60kI1Ix8AE25VmVrHQKN6wClRlrefL7AaQaQMXLBG2r4MCA1hB7x2lEe5v';

const form = document.getElementById('search-form');
const searchField = form.querySelector('input[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let page = 1;
let lightbox;
let totalHits = 0;
let loadedImages = 0;

function createImageCard(image) {
  return `
    <div class="photo-card">
      <a href="${image.largeImageURL}" target="_blank">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${image.downloads}
        </p>
      </div>
    </div>
  `;
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const searchQuery = searchField.value.trim();
  if (!searchQuery || searchQuery.length === 0) {
    Notiflix.Report.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  page = 1;
  try {
    const response = await fetchImages(searchField.value, page);
    const images = response.images;
    totalHits = response.totalHits;
    gallery.innerHTML = '';
    if (images && images.length > 0) {
      images.map(image => {
        const card = createImageCard(image);
        gallery.insertAdjacentHTML('beforeend', card);
      });
      loadedImages += images.length;
      if (loadedImages >= totalHits) {
        loadMoreButton.style.display = 'none';
        Notiflix.Report.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        loadMoreButton.style.display = 'block';
        Notiflix.Report.success(`Hooray! We found ${images.length} images`);
      }
    } else if (images === undefined) {
      debugger;
      Notiflix.Report.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    lightbox = new SimpleLightbox('.photo-card a', {
      overlay: true,
      captions: true,
      captionPosition: 'bottom',
      animationSpeed: 250,
      closeText: '×',
    });
  } catch (error) {
    console.error(error);
  }
}

async function handleLoadMoreClick() {
  page++;
  try {
    const response = await fetchImages(searchField.value, page);
    const images = response.images;
    if (images && images.length > 0) {
      images.map(image => {
        const card = createImageCard(image);
        gallery.insertAdjacentHTML('beforeend', card);
      });
      loadedImages += images.length;
      if (loadedImages >= totalHits) {
        loadMoreButton.style.display = 'none';
        Notiflix.Report.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        Notiflix.Report.success(
          `Hooray! We found ${images.length} more images`
        );
      }
      if (lightbox) {
        lightbox.refresh();
      }
    } else if (images === undefined) {
      debugger;
      Notiflix.Report.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error(error);
  }
}

form.addEventListener('submit', handleFormSubmit);
loadMoreButton.addEventListener('click', handleLoadMoreClick);
