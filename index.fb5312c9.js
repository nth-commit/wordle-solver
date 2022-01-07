const form = document.getElementById('form');
const enteredWordInput = document.getElementById('word');
const randomWordButton = document.getElementById('random');
form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    console.log(form.reportValidity());
    console.log(enteredWordInput.value);
});
console.log({
    form,
    enteredWordInput,
    randomWordButton
});

//# sourceMappingURL=index.fb5312c9.js.map
