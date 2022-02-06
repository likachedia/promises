const movieName: HTMLInputElement = <HTMLInputElement>(
  document.querySelector('#movieName')
);
const serachButton: HTMLButtonElement = <HTMLButtonElement> document.querySelector('#searachButton');

const result: HTMLDivElement = <HTMLDivElement> document.querySelector('.result');
const releasedYearsAgo: HTMLParagraphElement = document.createElement('p');
const actorsName: HTMLParagraphElement = document.createElement('p');
const aboutCountry: HTMLParagraphElement = document.createElement('p');
let flagContainer: HTMLElement = document.createElement('i');

interface Info {
  year: number;
  actors: string;
  country: string;
}

let infoObject: Info = {
  year: 0,
  actors: '',
  country: '',
};

let currenciesArr: string[] = [];
let flagsArr: string[] = [];

function makeFlag(flag: string) {
  console.log(flag);
  const countryFlag = document.createElement('img');
  countryFlag.src = flag;
  countryFlag.style.width = '30px';
  countryFlag.style.height = '20px';
  flagContainer.append(countryFlag);
}

function renderResult(
  year: number,
  names: string,
  currency: string[],
  flags: string[]
) {
  let curr: string = currency.join(',') || currency[0];
  releasedYearsAgo.textContent = `Movie released ${year}s ago`;
  actorsName.textContent = `Actors: ${names}`;
  aboutCountry.textContent = `country currency: ${curr}`;

  flagContainer = document.createElement('i');
  flags.forEach((flag) => {
    makeFlag(flag);
  });

  result?.append(releasedYearsAgo, actorsName, aboutCountry, flagContainer);
}

const searchMovieHandler = async () => {
  flagContainer.remove();
  let name: string = movieName.value;

  let response: Response = await fetch(
    `http://www.omdbapi.com/?t=${name}&apikey=bc6c9bb5`
  );
  let data = await response.json();
  const { Released, Actors, Country } = data;

  infoObject = {
    year: yearsAgo(Released),
    actors: Actors.split(',')
      .map((actor: string) => actor.trim().split(' ')[0])
      .join(', '),
    country: Country,
  };

  const promises: Promise<void>[] = [];

  infoObject.country.split(',').forEach((countryName: string) => {
    promises.push(getCountries(countryName.trim()));
  });
  Promise.all(promises).then(() => {
    renderResult(infoObject.year, infoObject.actors, currenciesArr, flagsArr);
    flagsArr.length = 0;
    currenciesArr.length = 0;
  });
};

async function getCountries(countryName: string) {
  let response: Response = await fetch(
    `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
  );
  let countries = await response.json();
  const [information] = countries;
  const { flags, currencies } = information;
  flagsArr.push(flags.svg);
  for (let key in currencies) {
    currenciesArr.push(key);
  }
}

function yearsAgo(year: string): number {
  year = year.slice(year.length - 4, year.length);
  const yearNow: number = new Date().getFullYear();
  return yearNow - parseInt(year);
}

serachButton?.addEventListener('click', searchMovieHandler);

/*           second part                                            */

let minutsArr: number[] = [];
let populAll:number = 0;



const searCh3movie = () => {
  minutsArr = [];
  populAll = 0;

  const firstMovie:HTMLInputElement = <HTMLInputElement> document.querySelector('#movieName1');
  const secondMovie:HTMLInputElement = <HTMLInputElement> document.querySelector('#movieName2');
  const therdMovie:HTMLInputElement = <HTMLInputElement> document.querySelector('#movieName3');

  getMovies(firstMovie.value, secondMovie.value, therdMovie.value);
};

let countries: string[] = [];

async function getMovies(first:string, second: string, therd: string) {
  countries = [];
  let promises = [getMovie(first), getMovie(second), getMovie(therd)];

    await Promise.all(promises);

let countrpr = countries.map((country) => {
      return getPopulation(country)
  })

  Promise.all(countrpr).then(() =>
  renderRespons(populAll, minutsArr)
);

}

function getMovie(name: string) {
  if(!name) {
    return;
  }
  return fetch(`http://www.omdbapi.com/?t=${name}&apikey=bc6c9bb5`)
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

function getPopulation(country: string) {
    if(!country) {
        return;
      }
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

function renderRespons(population: number, duration: number[]) {
  const container: HTMLDivElement = <HTMLDivElement> document.querySelector('.result2');
  container.innerHTML = '';

  const pop: HTMLParagraphElement = document.createElement('p');
  const min: HTMLParagraphElement = document.createElement('p');
  
  pop.textContent = `All the population: ${population}`;
  min.textContent = `All the duration: ${duration.reduce((acc:number, item:number) => acc + item)}`;
  container.append(pop, min);
}

const btn: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#searachButton2');

btn?.addEventListener('click', searCh3movie);
