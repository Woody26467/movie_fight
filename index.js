const fetchData = async (searchTerm) => {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: 'e3d716f6',
      s: searchTerm,
    },
  })

  if (response.data.Error) {
    return []
  }

  return response.data.Search
}

const root = document.querySelector('.autocomplete')
root.innerHTML = `
<label><b>Search For a Movie</b></label>
<input class ="input" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results">

    </div>
  </div>
</div>
`

const input = document.querySelector('input')
const dropdown = document.querySelector('.dropdown')
const resultsWrapper = document.querySelector('.results')

// debounce delays 'onInput' from being run
// debounce takes in the onInput function

// onInput holds a reference to the closure (anonymous function  the debounce returns)
const onInput = async (event) => {
  const movies = await fetchData(event.target.value)

  // if no movies found hide the dropdown
  if (!movies.length) {
    dropdown.classList.remove('is-active')
    return
  }

  resultsWrapper.innerHTML = ''
  dropdown.classList.add('is-active')
  for (let movie of movies) {
    const option = document.createElement('a')
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster

    option.classList.add('dropdown-item')
    option.innerHTML = `
      <img src="${imgSrc}" alt="" />
      ${movie.Title}
  `
    option.addEventListener('click', () => {
      dropdown.classList.remove('is-active')
      input.value = movie.Title
      onMovieSelect(movie)
    })

    resultsWrapper.appendChild(option)
  }
}

// onInput is a callback function to addEventListener
// all callbacks to event listeners receive 'event' argument automatically
// the callback gets automatically invoked when the event it is attached to occurs.
input.addEventListener('input', debounce(onInput, 500))

// hide the dropdown when user clicks outside of dropdown
// by removing the class 'is-active'
document.addEventListener('click', (event) => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove('is-active')
  }
})

// click event listener to show the dropdown if you click back in the search bar
input.addEventListener('click', () => {
  if (input.value) {
    dropdown.classList.add('is-active')
  }
})

// helper function to display the individual movie properties
const onMovieSelect = async (movie) => {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: 'e3d716f6',
      i: movie.imdbID,
    },
  })

  document.querySelector('#summary').innerHTML = movieTemplate(
    response.data
  )
}

// helper function to add HTML for the movie template
const movieTemplate = (movieDetail) => {
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `
}
