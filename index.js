const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    return `
    <img src="${imgSrc}" alt="" />
    ${movie.Title} (${movie.Year})
`
  },

  inputValue(movie) {
    return movie.Title
  },
  async fetchData(searchTerm) {
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
  },
}

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(
      movie,
      document.querySelector('#left-summary'),
      'left'
    )
  },
})

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(
      movie,
      document.querySelector('#right-summary'),
      'right'
    )
  },
})

// helper function to display the individual movie properties
let leftMovie
let rightMovie
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: 'e3d716f6',
      i: movie.imdbID,
    },
  })

  summaryElement.innerHTML = movieTemplate(response.data)

  if (side === 'left') {
    leftMovie = response.data
  } else {
    rightMovie = response.data
  }

  if (leftMovie && rightMovie) {
    // run the comparison
    runComparison()
  }
}

const checkData = () => {}

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    '#left-summary .notification'
  )
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  )

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index]

    const leftSideValue = parseFloat(leftStat.dataset.value)
    const rightSideValue = parseFloat(rightStat.dataset.value)

    if (isNaN(rightSideValue) || isNaN(leftSideValue)) {
      rightStat.classList.remove('is-primary')
      rightStat.classList.remove('is-warning')
      leftStat.classList.remove('is-primary')
      leftStat.classList.remove('is-warning')
    } else if (rightSideValue > leftSideValue) {
      rightStat.classList.remove('is-warning')
      rightStat.classList.add('is-primary')
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    } else if (leftSideValue > rightSideValue) {
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
      leftStat.classList.remove('is-warning')
      leftStat.classList.add('is-primary')
    } else if (rightSideValue === leftSideValue) {
      rightStat.classList.remove('is-primary')
      rightStat.classList.remove('is-warning')
      leftStat.classList.remove('is-primary')
      leftStat.classList.remove('is-warning')
    }
  })
}

// helper function to add HTML for the movie template
const movieTemplate = (movieDetail) => {
  // const dollars = parseInt(
  //   movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  // )

  if (!movieDetail.BoxOffice) {
    movieDetail.BoxOffice = 'N/A'
  }

  const dollars =
    movieDetail.BoxOffice === 'N/A'
      ? 'N/A'
      : parseInt(
          movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
        )

  const metascore = parseInt(movieDetail.Metascore)
  const imdbRating = parseFloat(movieDetail.imdbRating)
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))

  const awards = movieDetail.Awards.split(' ').reduce(
    (prev, word) => {
      const value = parseInt(word)

      if (isNaN(value)) {
        return prev
      } else {
        return prev + value
      }
    },
    0
  )

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
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `
}
