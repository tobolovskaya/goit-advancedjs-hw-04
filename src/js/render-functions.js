import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
});

const loadImage = src => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(src);
    img.onerror = error => reject(error);
  });
};

export const renderImages = async (images, reset = false) => {
  if (reset) {
    gallery.innerHTML = '';
  }

  if (images.length === 0) {
    gallery.innerHTML = '';
    lightbox.refresh();
    return;
  }

  const imagePromises = images.map(image => loadImage(image.webformatURL));
  await Promise.all(imagePromises);

  const fragment = document.createDocumentFragment();

  images.forEach(image => {
    const a = document.createElement('a');
    a.href = image.largeImageURL;
    a.classList.add('gallery-item');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info');

    const likesDiv = document.createElement('div');
    likesDiv.innerHTML = `<p>Likes</p><p>${image.likes}</p>`;

    const viewsDiv = document.createElement('div');
    viewsDiv.innerHTML = `<p>Views</p><p>${image.views}</p>`;

    const commentsDiv = document.createElement('div');
    commentsDiv.innerHTML = `<p>Comments</p><p>${image.comments}</p>`;

    const downloadsDiv = document.createElement('div');
    downloadsDiv.innerHTML = `<p>Downloads</p><p>${image.downloads}</p>`;

    infoDiv.append(likesDiv, viewsDiv, commentsDiv, downloadsDiv);
    a.append(img, infoDiv);
    fragment.appendChild(a);
  });

  gallery.appendChild(fragment);
  lightbox.refresh();
};

export const notificationsConfig = {
  position: 'topRight',
  messageColor: 'white',
  iconColor: 'white',
};

export const showErrorNotification = message => {
  iziToast.error({
    message: message,
    color: '#EF4040',
    ...notificationsConfig,
  });
};

export const showNotification = message => {
  iziToast.info({
    message: message,
    color: '#0099FF',
    ...notificationsConfig,
  });
};
