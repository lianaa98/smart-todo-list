$(document).ready(function() {
  $(window).scroll(function() {
    console.log("SCROLLING")

    if (scroll >= $('#cat-2').offset().top) {
      $('nav').css('color', 'red');
    }
    
  })
})