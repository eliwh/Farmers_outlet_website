/* eslint-env browser */
// main.js
const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')
const signUp = document.querySelector('#signup-button')

// let invForm = $('#inventory-form').serializeJSON();
// console.log(JSON.stringify(invForm));


update.addEventListener('click', _ => {
  let name = document.getElementById("name").value;
  console.log(name);
  let type = document.getElementById("type").value;
  console.log(type);
  let quantity = document.getElementById("quantity").value;
  console.log(quantity);

//   let nameS = name.toString();
//   let typeS = type.toString();
//   let quanS = quantity.toString();
// alert(nameS);
  fetch('/Plants', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: type,
      name: name,
      quantity: quantity
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
  fetch('/Plants', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Darth Vadar'
    })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      if (response === 'No quote to delete') {
        messageDiv.textContent = 'No Darth Vadar quote to delete'
      } else {
        window.location.reload(true)
      }
    })
    .catch(console.error)
})
