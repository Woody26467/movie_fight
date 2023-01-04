const debounce = (func, delay = 1000) => {
  let timeoutId
  // returns a closure that closes over ALL variables defined within the
  // function's lexical scope at the time of function's creation
  // and passes off all arguments that onInput might need (...args)
  // the spread operator itself turns all arguments into an array of arguments
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    // then the closure initiates the timer that triggers onInput (func parameter)
    timeoutId = setTimeout(() => {
      // invoke onInput after delay with the arguments array (args)
      // in this case the only argument is an event from the event listener
      func.apply(null, args)
    }, delay)
  }
}
