import axios from 'axios';
import Notiflix from 'notiflix';

export async function fetchImages(searchQuery, page = 1) {
  const params = {
    key: '40716198-03382858467f695f040d9065f',
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page,
  };

  const url =
    'https://pixabay.com/api/?' + new URLSearchParams(params).toString();
  try {
    const response = await axios.get(url);
    if (response.data.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return {
        images: [],
        totalHits: 0,
        total: 0,
      };
    } else {
      return {
        images: response.data.hits,
        totalHits: response.data.totalHits,
        total: response.data.total,
      };
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Error fetching images. Please try again.');
    return {
      images: [],
      totalHits: 0,
      total: 0,
    };
  }
}
