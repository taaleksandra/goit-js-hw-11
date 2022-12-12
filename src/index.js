'use strict';

// PIXABAY: user_id: 31998203;

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formSearch = document.querySelector('#search-form');
const inputSearch = document.querySelector('input[name="searchQuery"]');
const btnSearch = document.querySelector('button');
const btnLoad = document.querySelector('.load-more');
const galerry = document.querySelector('.gallery');

let page = 1;
let limit = 40;
btnLoad.classList.add('is-invisible');
btnSearch.disabled = true;

// funkcja z zapytaniem HTTP wykorzystująca Axios i skłądnię async/await
const fetchImg = async q => {
  const trimQ = q.trim();

  if (trimQ.length === 0) {
    return;
  }

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '31998203-230b8715d00921ede83d56272',
        q: trimQ,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: limit,
        page,
      },
    });

    // console.log(response);

    btnLoad.classList.add('is-invisible');

    const totalHits = response.data.totalHits;
    const total = response.data.total;
    const totalPages = Math.ceil(totalHits / 40);

    if (total === 0) {
      Notiflix.Notify.init({
        timeout: 5000,
      });
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    console.log(
      `Dla podanej frazy (${trimQ}) wyszukano ${total} dopasowań (dla bezpłatnego konta: ${totalHits}).`
    );

    if (totalHits > 40) {
      btnLoad.classList.remove('is-invisible');
    }

    return response.data.hits;
  } catch (error) {
    console.error(error);
  }
};

// funkcja tworząca galerię wyszukanych obrazów dla wpisanej frazy
const drawGallery = hits => {
  console.log(hits);
  const galleryArray = hits.map(
    ({ webformatURL, tags, likes, views, comments, downloads }) => {
      const imgCard = document.createElement('div');
      imgCard.classList.add('photo-card');
      imgCard.innerHTML = `<img src="${webformatURL}" alt="${tags}" loading="lazy" /> <div class="info"> <p class="info-item"> <b>Likes: ${likes}</b> </p> <p class="info-item"> <b>Views: ${views}</b> </p> <p class="info-item"> <b>Comments: ${comments}</b> </p> <p class="info-item"> <b>Downloads: ${downloads}</b> </p> </div>`;

      return imgCard;
    }
  );
  galerry.innerHTML = '';
  galerry.append(...galleryArray);
  // btnLoad.classList.remove('is-invisible');
};

// funkcja do obsługi pola tekstowego
const inputHandler = ev => {
  ev.preventDefault();
  const searchingImg = inputSearch.value;
  page = 1;

  fetchImg(searchingImg)
    .then(hits => {
      drawGallery(hits);
      console.log(`Wczytana strona: ${page}`);
      page += 1;
    })
    .catch(err => {
      galerry.innerHTML = '';
      console.error(err);
    });
};

// funckja load more
const loadMore = () => {
  const searchingImg = inputSearch.value;
  fetchImg(searchingImg)
    .then(hits => {
      drawGallery(hits);
      console.log(`Wczytana strona: ${page}`);

      // if (page > totalHits) {

      // }

      page += 1;
    })
    .catch(err => {
      galerry.innerHTML = '';
      console.error(err);
    });
};

// funkcja udostępniająca przycisk search
inputSearch.addEventListener('input', () => {
  if (inputSearch.value !== '') {
    btnSearch.disabled = false;
  } else {
    btnSearch.disabled = true;
  }
});

// obsługa zdarzenia po wpisaniu danych
formSearch.addEventListener('submit', inputHandler);

// obługa zdarzenia load more
btnLoad.addEventListener('click', loadMore);
