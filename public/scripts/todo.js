// Client facing scripts here
$(document).ready(function() {
  console.log("document is ready!");
  loadTodo();
  //=======================================
  //  Appending to Todo List              ||
  //=======================================
  $("#new-todo-form").on('submit', function(event) {
    event.preventDefault();
    // console.log("HELLLOOOOO HEREEE")
    console.log($(this).serialize());

    $.ajax({
      type: "POST",
      url: "/api/users",
      data: $(this).serialize(),
    })
      .then(function() {
        console.log("Check me here!");
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

  console.log("rendering...");
  console.log(todoArray);

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
    });
};