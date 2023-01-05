// config parameter contains all the custom functions that specify
// how the autocomplete should work inside specific application. Destructure 'config'
const createAutoComplete = ({ root, renderOption }) => {
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

  const input = root.querySelector('input')
  const dropdown = root.querySelector('.dropdown')
  const resultsWrapper = root.querySelector('.results')

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

      option.classList.add('dropdown-item')
      option.innerHTML = renderOption(movie)
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
}
