import moment from "moment";

export const windows = {
  MAIN: `nain`,
  SEARCH: `search`,
  STATS: `stats`,
}

export const emojis = [`smile`, `sleeping`, `puke`, `angry`];
export const titles = [`All movies`, `Watchlist`, `History`, `Favorites`];
export const BTN_CARD_CONTROLS = {
  'watchlist': {
    state: `watchlist`,
    classBtn: `add-to-watchlist`,
    title: `Add to watchlist`
  },
  'already_watched': {
    state: `watched`,
    classBtn: `mark-as-watched`,
    title: `Mark as watched`
  },
  'favorite': {
    state: `favorite`,
    classBtn: `favorite`,
    title: `Mark as favorite`
  },
}

export const HOME_PAGE_TITLES = {
  'main': `All movies. Upcoming`,
  'Top_rated': `Top rated`,
  'most_commented': `Most commented`,
};

export const namesPeople = new Set([
  `Alfred Hitchcock`,
  `Stanley Kubrick`,
  `Steven Spielberg`,
  `Андрей Тарковский`,
  `Quentin Tarantino`,
  `Sigourney Weaver`,
  `John Hurt`,
  `Ian Holm`,
]);

export const getRandomInteger = (max, min = 1) => Math.round(min - 0.5 + Math.random() * (max - min + 1));

export const getRandomElements = (arr, count, func) => new Array(count).fill(``).map(() => arr[func(0, arr.length - 1)]);

export function getRandomString(length) {
  const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
  let result = ``;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const getRandomTime = () => {
  // let munute = getRandomInteger(180, 65);
  // return `${Math.floor(munute / 60)} h ${Math.floor(munute % 60)} m`;
  return getRandomInteger(180, 65);
};

export const getDescriptionFilm = (description) => {
  const descriptionArray = getRandomElements(description.split(`. `), getRandomInteger(3, 1), getRandomInteger);
  return `${descriptionArray.join(`.`)}.`;
};

export const getComments = (commentsId, commentsData) => {
  return commentsId.map((id) => {
    for (let i = 0; i < commentsData.length; i++) {
      if(commentsData[i].id === id) {
        return commentsData[i]
      }
    }
  });
}

export function getRandomDate() {
  let randomYear = getRandomInteger(1930, 1990);
  let randomMonth = getRandomInteger(1, 12);
  let randomDate = getRandomInteger(1, 30);
  return new Date(randomYear, randomMonth, randomDate);
}

export const getCountFilms = (movieData, key) => {
  return movieData.reduce((total, movie) => (movie['user_details'][key] ? total + 1 : total), 0);
};

export const generateComments = (movieData, getComment) => {
  return movieData.reduce((AllComments, movie) => {
    let movieComments = new Array(getRandomInteger(4)).fill(``).map(getComment);
    movieComments.forEach((comment) => {
      comment.idFilm = movie.id;
      AllComments.push(comment);
    });
    return AllComments;
  }, []);
};

export function renderElement(container, template, type = `beforeend`) {
  container.insertAdjacentHTML(type, template);
}

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.lastChild;
};

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const render = (container, element, place = `beforeend`) => {
  const places = {
    'afterbegin': container.prepend(element),
    'beforeend': container.append(element),
  };
  return places[place];
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const Time = {
  'all-time': `all-time`,
  today : moment(),
  week : moment().subtract(7, 'days'),
  month : moment().subtract(1, 'month'),
  year: moment().subtract(1, 'year'),
}

export const getMovie = (movieData, time) => {
  return movieData.filter((movie) => moment(movie.user_details.watching_date).isAfter(time));
};


export const durationMovie = (movieData) => {
  const duration = movieData.reduce((count, movie) => {
    return count + movie.film_info.runtime;
  }, 0);

  return {
    duration,
    h: Math.floor(duration / 60),
    m: duration % 60
  }
}
