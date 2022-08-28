// import { filter } from 'lodash';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import fetchCountries from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const listCountry = document.querySelector('.country-list');
const cardCountry = document.querySelector('.country-info');
const inputSearchBox = document.querySelector('#search-box');

inputSearchBox.addEventListener(
  'input',
  debounce(onInputCountry, DEBOUNCE_DELAY)
);

function creatCountryCard(country) {
  const {
    flags: { svg },
    name: { official },
    capital,
    population,
    languages,
  } = country;
  const markup = `<div class=country-image>
<img src="${svg}" alt="${official}" /> <h2>${official}</h2>
  </div>
  <div class=country-card>
  <p> <span>Capital</span>: ${capital} </p>
  <p> <span>Population</span>: ${population} </p>
  <p> <span>Languages</span>: ${Object.values(languages).join(', ')} </p>
  </div>`;
  cardCountry.innerHTML = markup;
}

function createCountryList(item) {
  const markup = item
    .map(({ flags, name }) => {
      return `<li class=country-list__item>
      <img src="${flags.svg}" alt="${name.official}" /> <h1>${name.official}</h1>
    </li>`;
    })
    .join('');
  listCountry.innerHTML = markup;
}

function onInputCountry(e) {
  const queryCountry = e.target.value.trim();
  clearUnput();
  if (!queryCountry) {
    return;
  }
  fetchCountries(queryCountry)
    .then(item => {
      if (item.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (item.length === 1) {
        creatCountryCard(item[0]);
        return;
      }
      createCountryList(item);
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function clearUnput() {
  listCountry.innerHTML = '';
  cardCountry.innerHTML = '';
}
