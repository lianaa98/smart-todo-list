$(() => {

  const $button = $(`
  <button class="button-1" role="button">Sign Up</button>
  <button class="button-1" role="button">Log In</button>
  `);
  
  window.$registerForm = $registerForm;

  $registerForm.on('submit', function(event) {
    event.preventDefault();

    const data = $(this).serialize();
    signUp(data)
      .then(getMyDetails)
      .then((json) => {
        // header.update(json.user); // Not used yet, but maybe a nav would be in the future
        views_manager.show('landing');
      });
  });
      
});