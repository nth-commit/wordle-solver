import ReactDOM from 'react-dom'
import App from './components/App'

const app = document.getElementById('app')

ReactDOM.render(<App />, app)

// const form = document.getElementById('form') as HTMLFormElement
// const enteredWordInput = document.getElementById('word')! as HTMLInputElement
// const randomWordButton = document.getElementById('random')!

// form.addEventListener('submit', (ev) => {
//   ev.preventDefault()

//   console.log(form.reportValidity())

//   console.log(enteredWordInput.value)
// })

// console.log(dictionary)
