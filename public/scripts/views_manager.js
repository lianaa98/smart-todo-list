$(() => {

  const $main = $('#main-content');
  const $navbar = $("#nav-bar");

  window.views_manager = {};

  window.views_manager.show = function(item) {
    $landing.detach();
    $logInForm.detach();
    $registerForm.detach();

    switch (item) {
      case 'landing': 
      $navbar.addClass("nav-bar");
        $nav.appendTo($navbar);
        $landing.appendTo($main);
        break;
      case 'buttons':
        
      case 'logIn':
        $logInForm.appendTo($main);
        break;
      case 'signUp':
        $registerForm.appendTo($main);
        break;
      case 'error': {
        const $error = $(`<p>${arguments[1]}</p>`);
        $error.appendTo('body');
        setTimeout(() => {
          $error.remove();
          views_manager.show('listings');
        }, 2000);
        
        break;
      }
    }
  }
  
});