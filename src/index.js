import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

searchBox.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  let searchedCountry = e.target.value.trim();
  if (searchedCountry === '') {
    cleanOutput(countryList);
    cleanOutput(countryInfo);
  } else {
    fetchCountries(searchedCountry)
      .then(countries => {
        manageCountriesData(countries);
      })
      .catch(error => {
        cleanOutput(countryList);
        cleanOutput(countryInfo);
        console.log(error);
      });
  }
}

function manageCountriesData(countries) {
  if (countries.length > 10) {
    cleanOutput(countryList);
    cleanOutput(countryInfo);
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length === 1) {
    cleanOutput(countryList);
    createCountryDescription(countries);
  } else if (countries.length >= 2 && countries.length <= 10) {
    cleanOutput(countryInfo);
    createCountryList(countries);
  } else {
    cleanOutput(countryList);
    cleanOutput(countryInfo);
  }
}

function createCountryList(countries) {
  const list = countries
    .map(country => {
      return `<li class="country-list-element"><img width="30px" height="20px" src="${country.flags.svg}"/><p>${country.name.official}</p></li>`;
    })
    .join('');
  countryList.innerHTML = list;
}

function createCountryDescription(countries) {
  const description = countries.map(country => {
    return `<div class="description"><img width="50px" height="40px" src="${
      country.flags.svg
    }"/><h2>${country.name.official}</h2></div>
        <ul class="description-list">
        <li class="description-list-element"><h3>Capital: </h3> 
        ${country.capital}</li>
        <li class="description-list-element"><h3>Population: </h3> 
        ${country.population}</li>
        <li class="description-list-element"><h3>Languages: </h3>
        ${Object.values(country.languages).join(', ')}</li>
        </ul>`;
  });
  countryInfo.innerHTML = description;
}

function cleanOutput(output) {
  return (output.innerHTML = '');
}

//stylowanie
//input
searchBox.style.borderColor = 'blue';
searchBox.style.borderRadius = '4px';
searchBox.style.borderWidth = '1.5px';
searchBox.style.outline = 'none';

//list
countryList.style.listStyleType = 'none';
