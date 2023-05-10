$(document).ready(function () {
let $selectbox = $("#selectbox");
let $imagecontainer = $(".pfp-images");
let selection = $selectbox.data("selected");

// listen for when the selection changes...
// when it does change, run our `changeImageSelection` function
$selectbox.on("change", changeImageSelection);

function changeImageSelection() {
  // change the `selection` variable to the selected option
  selection = $selectbox.val();
  console.log(selection);
  // add a '.loading' class to the $imageContainer
  $imagecontainer.addClass("loading");
  // clear the $imageContainer's selected option
  console.log($imagecontainer[0]);
  $imagecontainer[0].dataset.selected = null;

  // set a timout of 1.5 seconds
  setTimeout(function() {
    // remove the '.loading' class from $imageContainer
    $imagecontainer.removeClass("loading");
    // add the currently selected option to $imageContainer
    $imagecontainer[0].dataset.selected = selection;
  }, 1500);
}

})
