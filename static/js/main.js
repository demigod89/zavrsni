
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Siječanj','Veljača','Ožujak','Travanj','Svibanj','Lipanj','Srpanj','Kolovoz','Rujan','Listopad','Studeni','Prosinac'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var minute = (a.getMinutes()<10?'0':'') + a.getMinutes();
  var time = date + '. ' + month + ' ' + year + ', ' + hour + ':' + minute +'h' ;
  return time;
}



$(document).ready(function () {
  $(".dropdown-toggle").dropdown();
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

  if (window.location.pathname === '/heroji') {
    var herostatsTable = $('#heroTableStats').DataTable({
      "language": {
        "emptyTable":"Podaci se učitavaju"
      }
    });
    $.get( "http://api.herostats.io/heroes/all",   function( data ) {
        var getImage = function (id) {
          images.forEach(function(img) {
            if (img.id == id) {
              console.log(img.url);
              return img.url;
            }
          });
        }
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
  } else if (window.location.pathname === '/mec') {
    var matchTable = $('#mecevi').DataTable({
      "language": {
        "emptyTable":"Podaci se učitavaju"
      },
      "pageLength": 10,
      "order": [[ 0, "desc" ]]
    });
    mecevi.result.matches.forEach(function(mec) {
      var hero = null;
      mec.players.forEach(function(player) {
        if (player.account_id === accId) {
          heroji.result.heroes.forEach(function(heroj) {
            if (player.hero_id === heroj.id) {
              hero = heroj.localized_name;
            }
          });
        }
      });
      matchTable.row.add( [
          mec.match_id,
          timeConverter(mec.start_time),
          hero,
          '<button type="button" class="btn btn-success" onClick="prikaziDetalje(' + mec.match_id + ')">Detalji</button>'
      ] ).draw();
    });
  } else if (window.location.pathname === '/najigraniji') {
    var najigranijiTable = $('#najigraniji').DataTable({
      "language": {
        "emptyTable":"Podaci se učitavaju"
      },
      "order": [[ 2, "desc" ]]
    });
    najigraniji.forEach(function(hero) {
      heroji.forEach(function(hero1) {
        if(hero.hero_id === hero1.id.toString()) {
          najigranijiTable.row.add( [
            hero1.localized_name,
            '<img class="img-thumbnail" src=' + '/img/heroes/' + hero1.localized_name.toLowerCase().split(' ').join('_') + '_full.png' + ' width="80" height="40">',
            hero.games,
          ] ).draw();
        }
      });
    });
  }

});


$('.show-list').click(function(){
  $('.wrapper').addClass('list-mode');
});

$('.hide-list').click(function(){
  $('.wrapper').removeClass('list-mode');
});


