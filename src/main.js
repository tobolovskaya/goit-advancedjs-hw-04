import { fetchImages } from './js/pixabay-api';
import { renderImages, showNotification } from './js/render-functions';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-form input[name="search"]');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
let totalImagesLoaded = 0;

const handleSubmitForm = async event => {
  event.preventDefault();
  const query = input.value.trim();

  if (!query) {
    showNotification('Please enter a search query.');
    return;
  }

  loadMoreBtn.style.display = 'none';
  loader.style.display = 'none';
  currentPage = 1;
  totalImagesLoaded = 0;
  currentQuery = query;

  try {
    loader.style.display = 'flex';
    const data = await fetchImages(query, currentPage);
    totalImagesLoaded = data.hits.length;

    if (data.hits.length === 0) {
      showNotification(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    await renderImages(data.hits, true);

    if (totalImagesLoaded < data.totalHits) {
      loadMoreBtn.style.display = 'block';
    } else {
      showNotification(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    showNotification(
      'An error occurred while fetching images. Please try again later.'
    );
  } finally {
    loader.style.display = 'none';
    form.reset();
  }
};

const handleLoadMore = async () => {
  currentPage += 1;

  loadMoreBtn.style.display = 'none';
  loader.style.display = 'flex';

  try {
    const data = await fetchImages(currentQuery, currentPage);
    totalImagesLoaded += data.hits.length;

    await renderImages(data.hits);

    const { height: cardHeight } = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2 + 48,
      behavior: 'smooth',
    });

    if (totalImagesLoaded >= data.totalHits) {
      showNotification(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    showNotification(
      'An error occurred while fetching more images. Please try again later.'
    );
  } finally {
    loader.style.display = 'none';
  }
};

form.addEventListener('submit', handleSubmitForm);
loadMoreBtn.addEventListener('click', handleLoadMore);
