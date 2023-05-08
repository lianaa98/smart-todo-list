// Client facing scripts here
$(document).ready(function() {
  console.log("document is ready!");

//=======================================
//  Appending to Todo List              ||
//=======================================
  $("#new-todo-form").on('submit', function(event) {
    event.preventDefault();
    console.log("HELLLOOOOO HEREEE")
    console.log($(this).serialize());

  //   $.ajax({
  //     type: "POST",
  //     url: "/api/users",
  //     data: $(this).serialize()
  //   })



  //   $.ajax('/api/users', { method: "GET" })
  //   .then(function(todoObj) {

  //     console.log('todoObj', todoObj);
  //     // <input id="01" type="checkbox" name="r" value="1" checked>
  //     // <label for="01">Bread</label>
  //     // <input id="02" type="checkbox" name="r" value="2">
  //     // <label for="02">Cheese</label>

  //   })

  //   const list = `
  //   <p>To Do List</p>
  //   <div id="all-checklist"></div>
  //   `

  // })
})
})

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
  `
  return markup;
}

function renderTodo(todoArray) {

  $("#main-todo").empty();

  for (const todo of todoArray) {
    const $todo = createTodoElement(todo);
    $("#main-todo").appendChild($todo);
  }
}

function loadTodo() {
  console.log("loading todo list...");

  $.ajax("/")
}