import Notiflix from 'notiflix';

export const fetchCountries = name => {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';
  const properties = 'fields=name,capital,population,flags,languages';

  return fetch(`${BASE_URL}${name}?${properties}`).then(response => {
    if (!response.ok) {
      Notiflix.Notify.failure('OOPS, there is no country with that name');
    }
    return response.json();
  });
};
