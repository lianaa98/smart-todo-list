// Client facing scripts here

// ===========
// Globals
// ===========
let loadedCount = 0; // one count for the main todo, and each category todo loaded
const COUNT_BEFORE_LOAD_TODO = 5;

$(document).ready(function() {
  loadMainTodo();
  loadCategory(0);
  loadCategory(1);
  loadCategory(2);
  loadCategory(3);

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
    });
  });

  //=======================================
  //  Appending to Todo List              ||
  //=======================================
  $("#new-todo-form").on('submit', function(event) {
    event.preventDefault();

    $(".meter").show();

    $.ajax({
      type: "POST",
      url: "/api/users",
      data: $(this).serialize(),
    })
      .then(function(data) {
        $("#new-todo").val("");
        $(".meter").slideUp();

        loadMainTodo();
        loadCategory(0);
        loadCategory(1);
        loadCategory(2);
        loadCategory(3);
      })
      .catch(err => {
        console.log(err);
      });
  });
});

//=======================================
//  Helper Functions for rendering      ||
//=======================================

//------ All Todo Page ------
function createToDoElement(todoObj) {
  const todoId = todoObj.id;

  const formRoute = `/todo-items/${todoId}`;
  const formRouteDel = `/todo-items/${todoId}/delete`;

  const thingId = "t-" + todoId;
  const catId = "c-" + todoId;
  const content = todoObj.content;
  const category = todoObj.category_name;
  const completed_at = todoObj.completed_at;

  let displayCat;

  if (category === "to-watch") {
    displayCat = "To Watch";
  }
  if (category === "to-read") {
    displayCat = "To Read";
  }
  if (category === "to-eat") {
    displayCat = "To Eat";
  }
  if (category === "to-buy") {
    displayCat = "To Buy";
  }
  if (category === "others") {
    displayCat = "Others";
  }

  const created_at = todoObj.created_at;

  function escape(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
  
  const markup = `
  <div class="todo-obj">

    <div class="thing" id=${thingId}>
      <img class="icon${(completed_at)?` clicked`:``}">
      <span class="statement${(completed_at)?` clicked-text`:``}">${escape(content)}</span>
    </div>

    <form class="catform" id=${catId} method="POST" action=${formRoute}>
    <button type="submit" class="category">${displayCat}</button>
    <select class="select-cat" name="category_name">
      <option value="to-watch"${(category === "to-watch")?` selected`:``}>To Watch</option>
      <option value="to-read"${(category === "to-read")?` selected`:``}>To Read</option>
      <option value="to-eat"${(category === "to-eat")?` selected`:``}>To Eat</option>
      <option value="to-buy"${(category === "to-buy")?` selected`:``}>To Buy</option>
    </select>
    </form>

    <form class="deleteform" method="POST" action=${formRouteDel}>
      <button class="deleteButton">
      <img src="/icons/trash.png">
      </button>
    </form>

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

function loadEventHandlers() {
  
      // Bee icons----

      $(".todo-obj").children().each(function() {
        if ($(this).hasClass("thing")) {
          $(this).on('click', function() {
            // toggle completed
            const itemElementId = $(this).attr('id');
            const itemId = itemElementId.substring(2); // cut off the 't-' part
            console.log('itemElementId:', itemElementId, 'itemId:', itemId);

            // HTML markup shouldn't have two of the same id, will keep that in mind for next time
            $(`[id=${itemElementId}]`).children().each(function() {

              // toggle icon and text "clicked" class and completed POST
              if ($(this).hasClass("icon")) {
                let completedBool = '';
                if(!$(this).hasClass("clicked")) {
                  completedBool = 'true';
                  $(this).addClass("clicked");
                } else {
                  completedBool = 'false';
                  $(this).removeClass("clicked");
                }
                const dataQueryString = `completed=${completedBool}`;
                $.post(`/todo-items/${itemId}`, dataQueryString);
              } else {
                $($(this)).toggleClass("clicked-text");
              }
            });
          });
        }
      });

      // Edit button ----

      $(".todo-obj").children().each(function() {
        // monitor form button
        if ($(this).hasClass("catform")) {
          $(this).on('submit', function(event) {
            if ($(".select-cat").is(":hidden")) {
              event.preventDefault();
              $(".select-cat").slideDown();
            }
          });
        }
      });

      // Drop-downs ----
      
      $(".todo-obj").children().each(function() {
        // monitor form button
        if ($(this).hasClass("catform")) {
          const $catForm = $(this);
          $catForm.children('.select-cat').on('change', function() {
            $catForm.trigger( 'submit' );
          }); 
        }
      });
}

function loadMainTodo() {
  $.ajax("/todo-items/", { method: "GET" })
    .then(function(todos) {
      renderTodo(todos);
    })
    .then(tryLoadEventHandlers)
    .catch(err => {
      console.log(err);
    });
};

function tryLoadEventHandlers() {
  loadedCount++;
  if(loadedCount === COUNT_BEFORE_LOAD_TODO) { // for the initial loading
    loadEventHandlers();
    loadedCount = 0; // reset
  }
}

//------ Category pages ------

function renderCatTodo(todoArray, i) {

  $(`#todo-${i}`).empty();

  if (todoArray.length === 0) {
    $(`#todo-${i}`).append(`
    <br><br>
    <span class="statement" style="padding-left: 30px; font-size: 1.30em">You're all caught up!</span>
    <br><br>`);
  }

  for (const todo of todoArray) {
    const $todo = createToDoElement(todo);
    $(`#todo-${i}`).append($todo);
  }
}

function loadCategory(index) {

  let cat;

  if (index === 0) {
    cat = "to-watch";
  }
  if (index === 1) {
    cat = "to-read";
  }
  if (index === 2) {
    cat = "to-eat";
  }
  if (index === 3) {
    cat = "to-buy";
  }

  $.ajax(`/todo-items/${cat}`, { method: "GET" })
    .then(function(todos) {

      renderCatTodo(todos, index);
    })
    .then(tryLoadEventHandlers)
    .catch(err => {
      console.log(err);
    });

};