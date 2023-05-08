// Client facing scripts here
$(document).ready(function() {
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
});