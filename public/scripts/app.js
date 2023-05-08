// Client facing scripts here
$(document).ready(function() {
  console.log("document is ready!");

//=======================================
//  User Login/Register Forms Animation ||
//=======================================

  $("#log-in-button").on('click', function() {
    if($("#register-form")) {
      $("#register-form").slideUp();
    }
    $("#login-form").slideToggle();
  })

  $("#sign-up-button").on('click', function() {
    if($("#login-form")) {
      $("#login-form").slideUp();
    }
    $("#register-form").slideToggle();
  })

//=======================================
//  Appending to Todo List              ||
//=======================================
  $("#todo-button").on('click', function(event) {
    $("#main-todo").empty();

    const list = `
    <p>To Do List</p>
    <div id="checklist">
    <input id="01" type="checkbox" name="r" value="1" checked>
    <label for="01">Bread</label>
    <input id="02" type="checkbox" name="r" value="2">
    <label for="02">Cheese</label>
  </div>

    `

  })
});