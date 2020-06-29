/* eslint-env browser */
// main.js
const email = document.getElementById('#email').value;
const fname = document.getElementById('#fname').value;
const lname = document.getElementById('#lname').value;
const uname = document.getElementById('#uname').value;
const pwd = document.getElementById('#pwd').value;

update.addEventListener('click', _ => {

  fetch('/Users', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    //Converting those inputs to a JSON string, different from the .toString()
    // In JavaScript. json.stringify is needed so that it can be read and inserted
    // into mongodb
    body: JSON.stringify({
      email: email,
      first_name: fname,
      last_name: lname,
      username: uname,
      password: pwd
    })
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      window.location.reload(true)
    })
})
