/* eslint-env browser */
// main.js
const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')
const signUp = document.querySelector('#signup-button')

let type = document.getElementById('Type');
let html = type.outerHTML;
let typeData = {html: html};

let name = document.getElementById('Name');
let html = name.outerHTML;
let nameData = {html: html};

let quantity = document.getElementById('#quantity');
let html = quantity.outerHTML;
let quanData = {html: html};

let data = {name: "#name", type: "Type", quantity: "quantity"}
let info = JSON.stringify(data)

update.addEventListener('click', _ => {
  fetch('/Plants', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify({
      name: "Pepper",
      type: "Veggetable",
      quantity: "2"
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
  fetch('/quotes', {
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
