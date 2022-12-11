'use strict';

// PIXABAY: user_id: 31998203;

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formSearch = document.querySelector('#search-form');
const inputSearch = document.querySelector('input[name="searchQuery"]');
const btnSearch = document.querySelector('button');
const galerry = document.querySelector('.gallery');

let page = 1;

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
      },
    });

    console.log(response);

    const totalHits = response.data.totalHits;
    const total = response.data.total;
    console.log(
      `Dla podanej frazy (${trimQ}) wyszukano ${total} dopasowań (dla bezpłatnego konta: ${totalHits}).`
    );

    //   const dataSearch = response.data.hits;
    //   console.log(dataSearch);
  } catch (error) {
    console.error(error);
  }
};

fetchImg('blue dog');

// // funkcja z zapytaniem HTTP
// const fetchImg = q => {
//   const trimQ = q.trim();
//   const API_KEY = '31998203-230b8715d00921ede83d56272';
//   const API_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${trimQ}&image_type=photo&orientation=horizontal&safesearch=true`;

//   if (trimQ.length === 0) {
//     return;
//   }

//   return fetch(API_URL).then(res => {
//     if (!res.ok) {
//       throw new Error(res.status);
//     }
//     return res.json();
//   });
// };
