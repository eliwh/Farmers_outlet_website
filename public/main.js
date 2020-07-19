/* eslint-env browser */
// main.js
const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')
const signUp = document.querySelector('#signup-button')

update.addEventListener('click', _ => {

  // Here we have our varibales that are storing user input from
  // the input element in html
  let name = document.getElementById("name").value;
  console.log(name);
  let type = document.getElementById("type").value;
  console.log(type);
  let quantity = document.getElementById("quantity").value;
  console.log(quantity);
  let price = document.getElementById("price").value;
  console.log(price);
  let description = document.getElementById("price").value;
  console.log(description);

  fetch('/Plants', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    //Converting those inputs to a JSON string, different from the .toString()
    // In JavaScript. json.stringify is needed so that it can be read and inserted
    // into mongodb
    body: JSON.stringify({
      type: type,
      name: name,
      quantity: quantity,
      price: price,
      description: description
    })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      window.location.reload(true)
    })
})

deleteButton.addEventListener('click', _ => {
  let name = document.getElementById("delete-name").value;
  console.log(name);

  fetch('/Plants', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name
    })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      if (response === 'No item to delete') {
        messageDiv.textContent = 'Nothing to Delete'
      } else {
        window.location.reload(true)
      }
    })
    .catch(console.error)
})
