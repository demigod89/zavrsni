$(document).ready(function () {
  var trigger = $('.hamburger'),
      overlay = $('.overlay'),
     isClosed = false;

    trigger.click(function () {
      hamburger_cross();      
    });

    function hamburger_cross() {

      if (isClosed == true) {          
        overlay.hide();
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      } else {   
        overlay.show();
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
  }
  
  $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
  });  
});

rivets.bind($('#container'), {
  inputs: [{
    name: 'Active Time',
    addon: 'Minutes',
    essential: true
  }, {
    name: 'GPM',
    addon: 'Gold',
    essential: true
  }, {
    name: 'Kill Participation',
    addon: '%',
    hide: true
  }, {
    name: 'Death Participation',
    addon: '%',
    hide: true
  }, {
    name: 'Hero Damage',
    addon: '%',
    hide: true
  }],
  controller: {
    toggleInput: function(e, model) {
      e.preventDefault();
      var effect = $(this).hasClass('btn-show-input') ? 'fadeOutUp' : 'fadeOutDown';
      var $el = $(this).closest('[data-hide]');
      $el.addClass(effect + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $el.removeClass(effect + ' animated');
        model.input.hide = !model.input.hide;
      });
    }
  }
});

rivets.formatters.default = {
  read: function(value, arg) {
    return value || arg;
  }
}

$('.show-list').click(function(){
  $('.wrapper').addClass('list-mode');
});

$('.hide-list').click(function(){
  $('.wrapper').removeClass('list-mode');
});

//contact

$('document').ready(function() {
  var msg = $('#message');
  msg.autosize();
});



