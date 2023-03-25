// index.js
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('country-info');

searchBox.addEventListener('input', debounce(inputContent, DEBOUNCE_DELAY));

const cleanOutput = output => (output.innerHTML = '<div></div>');

function inputContent(e) {
  let searchedCountry = e.target.value.trim();
  if (!searchedCountry) {
    cleanOutput(countryList);
    cleanOutput(countryInfo);
    return;
  } else if (searchedCountry) {
    fetchCountries(searchedCountry)
      .then(countries => {
        if (countries.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }
        manageCountriesData(countries);
        console.log(countries.length);
      })
      .catch(error => {
        cleanOutput(countryList);
        cleanOutput(countryInfo);
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function manageCountriesData(countries) {
  if (countries.length === 1) {
    cleanOutput(countryList);
    const description = createCountryDescription(countries);
    countryInfo.innerHTML = description;
  } else {
    cleanOutput(countryInfo);
    const list = createCountryList(countries);
    countryList.innerHTML = list;
  }
}

function createCountryList(countries) {
  const list = countries
    .map(country => {
      return `<li><img width="30px" src="${country.flags.svg}"/><p>${country.name.common}</p></li>`;
    })
    .join(' ');
}

function createCountryDescription(countries) {
  const description = countries
    .map(country => {
      return `<div><img width="30px" src="${country.flags.svg}"/><h2>${country.name.common}</h2></div>
        <ul>
        <li><h3>Capital:</h3>${country.capital}</li>
        <li><h3>Popolation:</h3>${country.population}</li>
        </ul>`;
    })
    .join('');
}

//fetchCountries.js

export function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';
  const properties = 'fields=name,capital,population,flags,languages';

  return fetch(`${BASE_URL}${name}?${properties}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

// function fetchCountries(name) {
//   fetch('https://restcountries.com/v3.1/all?fields=name,flags')
//     .then(response => {
//       return response.json();
//     })
//     .then(countries => console.log(countries))
//     .catch(error => console.log(error));
// }

// let conutriesNameURL = `https://restcountries.com/v3.1/name/${name}?fullText=true`;
// let name = searchBox.value;

// function fetchCountries(name) {
//   let inputValue = searchBox.value;
//   fetch(`https://restcountries.com/v3.1/all`)
//     .then(response => response.json())
//     .then(countries =>
//       countries.forEach(country => {
//         let countryList;
//         if (country.name.official.includes(inputValue)) {
//           //czy to jest string, bo includes to metoda do string
//           countryList += `<li>
//           <a href=${country.flags.svg}/>
//           <p>${country.name.official}<p>
//           </li>`;
//         }
//       })
//     )
//     .catch(error => console.log(error));
// }

//> 20 show allert from hw
// Notiflix alert
//2-10 show list of countries
// function createCountryList() {}
// 1 show country
// function showCountry() {}
