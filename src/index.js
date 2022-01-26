const movieName = document.querySelector('#movieName');
const serachButton = document.querySelector('#searachButton');

const result = document.querySelector('.result');
const releasedYearsAgo = document.createElement('p');
const actorsName = document.createElement('p');
const aboutCountry = document.createElement('p');
let flagContainer = document.createElement('i');

let infoObject = {};
let currenciesArr = [];
let flagsArr = [];

function makeFlag(flag) {
  console.log(flag);
  const countryFlag = document.createElement('img');
  countryFlag.src = flag;
  countryFlag.style.width = '30px';
  countryFlag.style.height = '20px';
  flagContainer.append(countryFlag);
}

function renderResult(year, names, currency, flags) {
  console.log(currency);
  currency = currency.join(',') || currency[0];
  releasedYearsAgo.textContent = `Movie released ${year}s ago`;
  actorsName.textContent = `Actors: ${names}`;
  aboutCountry.textContent = `country currency: ${currency}`;

  flagContainer = document.createElement('i');
  flags.forEach((flag) => {
    console.log('from flags');
    makeFlag(flag);
  });

  result.append(releasedYearsAgo, actorsName, aboutCountry, flagContainer);
}

const searchMovieHandler = () => {
  flagContainer.remove();
  let name = movieName.value;

  fetch(`http://www.omdbapi.com/?t=${name}&apikey=bc6c9bb5`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const { Released, Actors, Country } = data;

      return (infoObject = {
        year: yearsAgo(Released),
        actors: Actors.split(',')
          .map((actor) => actor.trim().split(' ')[0])
          .join(', '),
        country: Country,
      });
    })
    .then((info) => {
      const promises = [];

      info.country.split(',').forEach((countryName) => {
        promises.push(
          getCountries(countryName)
        );
      });

      Promise.all(promises).then(() => {
        renderResult(
          infoObject.year,
          infoObject.actors,
          currenciesArr,
          flagsArr
        );
        flagsArr.length = 0;
        currenciesArr.length = 0;
      });
    });
};

function getCountries(countryName) {

  fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
  .then((response) => {
    return response.json();
  })
  .then((countryInfo) => {
    const [information] = countryInfo;
    const { flags, currencies } = information;
    flagsArr.push(flags.svg);
    for (let key in currencies) {
      currenciesArr.push(key);
    }
  })

}

function yearsAgo(year) {
  year = year.slice(year.length - 4, year.length);
  const yearNow = new Date().getFullYear();
  return yearNow - year;
}

serachButton.addEventListener('click', searchMovieHandler);



let minutsArr = [];
let populAll = 0;

const searCh3movie = () => {
  minutsArr = [];
  populAll = 0;

  const firstMovie = document.querySelector('#movieName1');
  const secondMovie = document.querySelector('#movieName2');
  const therdMovie = document.querySelector('#movieName3');

  getMovies(firstMovie.value, secondMovie.value, therdMovie.value);
};

let countries = [];

function getMovies(first, second, therd) {
  countries = [];
  let promises = [getMovie(first), getMovie(second), getMovie(therd)];

  Promise.all(promises).then(() => {

    // const populationPromises = [];
    // countries.forEach((country) => {
    //   populationPromises.push(getPopulation(country));
    // });

    countries = countries.reduce((acc, country) => {
      return acc = [...acc, getPopulation(country)];
    }, [])

    Promise.all(countries).then(() =>
      renderRespons(populAll, minutsArr)
    );
  });
}

function getMovie(ele) {
  if(!ele) {
    return;
  }
  return fetch(`http://www.omdbapi.com/?t=${ele}&apikey=bc6c9bb5`)
    .then((response) => {
      console.log('coming');
      return response.json();
    })
    .then((data) => {
      const { Runtime, Country } = data;
      minutsArr.push(parseInt(Runtime));
      if (Country.includes(',')) {
        countries = countries.concat(Country.split(','));
      } else {
        countries.push(Country);
      }
    });
}

function getPopulation(country) {

  return fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
    .then((response) => {
      return response.json();
    })
    .then((countryInfo) => {
      const [information] = countryInfo;
      const { population } = information;
      populAll = populAll + population;
    });
}

function renderRespons(population, duration) {
  const container = document.querySelector('.result2');
  container.innerHTML = '';

  const pop = document.createElement('p');
  const min = document.createElement('p');
  duration = duration.reduce((acc, item) => acc + parseInt(item), 0);
  pop.textContent = `All the population: ${population}`;
  min.textContent = `All the duration: ${duration}`;
  container.append(pop, min);
}

const btn = document.querySelector('#searachButton2');

btn.addEventListener('click', searCh3movie);
