'use strict';

// PIXABAY: user_id: 31998203;

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

const formSearch = document.querySelector('#search-form');
const inputSearch = document.querySelector('input[name="searchQuery"]');
const btnSearch = document.querySelector('button');
const btnLoad = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let page = 1;
let limit = 40;
let scrollPosition = 0;
let buttonPosition = 0;

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

    checkResult(totalHits);

    console.log(
      `Dla podanej frazy (${trimQ}) wyszukano ${total} dopasowań (dla bezpłatnego konta: ${totalHits}).`
    );

    return response.data.hits;
  } catch (error) {
    console.error(error);
  }
};

// funkcja sprawdzająca ilość wyszukanych elementów oraz ilość stron
function checkResult(totalHits) {
  const totalPages = Math.ceil(totalHits / 40);

  if (totalHits === 0) {
    Notiflix.Notify.init({
      timeout: 5000,
    });
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (page === totalPages && totalPages !== 1) {
    btnLoad.classList.add('is-invisible');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else if (page < totalPages) {
    btnLoad.classList.remove('is-invisible');
  }
}

// funkcja tworząca galerię wyszukanych obrazów dla wpisanej frazy
const drawGallery = hits => {
  console.log(hits);
  const galleryArray = hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      const imgCard = document.createElement('div');
      imgCard.classList.add('photo-card');
      imgCard.innerHTML = `<a href="${largeImageURL}"> <img src="${webformatURL}" alt="${tags}" loading="lazy" /> </a> <div class="info"> <p class="info-item"> <b>Likes:<br> ${likes}</b> </p> <p class="info-item"> <b>Views:<br> ${views}</b> </p> <p class="info-item"> <b>Comments:<br> ${comments}</b> </p> <p class="info-item"> <b>Downloads:<br> ${downloads}</b> </p> </div>`;

      return imgCard;
    }
  );
  gallery.append(...galleryArray);
  let lightbox = new SimpleLightbox('.gallery a');
};

// funkcja do obsługi pola tekstowego
const inputHandler = ev => {
  ev.preventDefault();
  const searchingImg = inputSearch.value;
  page = 1;

  fetchImg(searchingImg)
    .then(hits => {
      gallery.innerHTML = '';
      drawGallery(hits);
      console.log(`Wczytana strona: ${page}`);
      page += 1;
    })
    .catch(err => {
      gallery.innerHTML = '';
      console.error(err);
    });
};

// funckja load more
const loadMore = () => {
  const searchingImg = inputSearch.value;
  fetchImg(searchingImg)
    .then(hits => {
      drawGallery(hits);
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      console.log(`Wczytana strona: ${page}`);
      page += 1;
    })
    .catch(err => {
      gallery.innerHTML = '';
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

window.onscroll = throttle(function () {
  // console.log('pozycja scrolla', scrollPosition);
  // console.log('pozycja BUTTONA', buttonPosition);
  scrollPosition = window.pageYOffset;
  buttonPosition = btnLoad.offsetTop;
  if (scrollPosition > buttonPosition - 850) {
    loadMore();
  }
}, 1000);

// obługa zdarzenia load more
btnLoad.addEventListener('click', loadMore);
