// Client facing scripts here
$(document).ready(function() {
  console.log("document is ready!");
  loadTodo();

  //=======================================
  //  Navbar Animation                    ||
  //=======================================

  $("a").each(function() {
    $(this).on('click', function(e) {
      e.preventDefault();
      const id = $(this).attr("href");
      $(id)[0].scrollIntoView({
        behavior: "smooth"
      });
    })
  })
  
  //=======================================
  //  Appending to Todo List              ||
  //=======================================
  $("#new-todo-form").on('submit', function(event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "/api/users",
      data: $(this).serialize(),
    })
      .then(function() {
        loadTodo();
        $("#new-todo").val("");
      })
      .catch(err => {
        console.log(err);
      });
  });
});

//=======================================
//  Helper Functions for rendering      ||
//=======================================
function createToDoElement(todoObj) {
  const content = todoObj.content;
  const category = todoObj.category_name;
  const created_at = todoObj.created_at;

  function escape(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  const markup = `
  <div class="todo-obj">
  <div class="thing">
  <img class="icon">
  <span class="statement">${escape(content)}</span>
  </div>
  <div class="category">
  <span>${category}</span>  
  </div>
  </div>
  `;
  return markup;
}

function renderTodo(todoArray) {

  $("#main-todo").empty();

  for (const todo of todoArray) {
    const $todo = createToDoElement(todo);
    $("#main-todo").append($todo);
  }
}

function loadTodo() {
  console.log("loading todo list...");

  $.ajax("/todo-items/", { method: "GET" })
    .then(function(todos) {

      renderTodo(todos);

      $(".todo-obj").children().each(function() {
        if ($(this).hasClass("thing")) {
          $(this).on('click', function() {
            $(this).children().each(function() {
              if ($(this).hasClass("icon")) {
                $(this).toggleClass("clicked");
              } else {
                $(this).toggleClass("clicked-text");

              }
            });
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
    })
};