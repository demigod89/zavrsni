$(document).ready(function() {
    $(".dropdown-toggle").dropdown();
});

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
  //data table jquery
  var herostatsTable = $('#heroTableStats').DataTable({
    "language": {
      "emptyTable":"Podaci se učitavaju"
    }
  });

  $.get( "http://api.herostats.io/heroes/all",   function( data ) {
      $.get( "dataimg.json",   function( images ) {

        var getImage = function (id) {
          images.forEach(function(img) {
            if (img.id == id) {
              console.log(img.url);
              return img.url;
            }
          });
        }
        console.log(data);
        Object.keys(data).forEach(function(key) {
            switch(data[key].PrimaryStat) {
              case 0:
                data[key].PrimaryStat = 'Str';
                break;
              case 1:
                data[key].PrimaryStat = 'Agi';
                break;
              case 2:
                data[key].PrimaryStat = 'Int';
                break;
            }

            var image = null;
            images.forEach(function(img) {
              if (img.id === data[key].ID) {
                image = img.url;
              }
            });

            image = '<img src="' + image + '">';

            herostatsTable.row.add( [
                image,
                data[key].Name,
                data[key].Movespeed,
                data[key].MinDmg,
                data[key].MaxDmg,
                data[key].HP,
                data[key].Mana,
                data[key].StrGain,
                data[key].AgiGain,
                data[key].IntGain,
                data[key].PrimaryStat,
            ] ).draw();
        });
    });
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

//$('document').ready(function() {
//  var msg = $('#message');
//  msg.autosize();
//});



