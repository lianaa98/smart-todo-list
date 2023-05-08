// Client facing scripts here
$(document).ready(function() {
  console.log("document is ready!");

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
  <input id="02" type="checkbox" name="r" value="2">
  <label for="02">${escape(content)}</label>
  <div class="custom-select" style="width:200px;">
  <select>
    <option value="1">To Watch</option>
    <option value="2">To Read</option>
    <option value="3">To Eat</option>
    <option value="4">To Buy</option>
  </select>
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
    });
}