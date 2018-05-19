$('input[type=text]').on('keydown', function(e) {
    if (e.which == 13) {
        console.log('hello');
        $('.hero').fadeOut();
        $('.our-work').show();
        e.preventDefault();
    }
});