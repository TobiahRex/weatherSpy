'use strict';

$(document).ready(init);

const API_KEY = 'e4edd15ee58cd59f';

function init(){
  $('.webcam-btn-get').on('click', getWebCams);
}

function getWebCams(){
  $('.data-body').empty();

  $.getJSON(`http://api.wunderground.com/api/${API_KEY}/webcams/q/autoip.json`)
  .done(data => {
    if(!data.webcams) return $('div.film-data-body').append(data.response.error.type);
    let cards = renderCams(data);    
    let $camList = $('<div>').addClass('row col-xs-8 col-xs-offset-2 text-center').append(cards);
    $('.data-body').append($camList);
  })
  .error(()=> {
    $('.data-body').append('<p>').text('ERROR:');
  });

};

function renderCams(data){
  let cards = [];
  data.webcams.forEach(cam => {
    let $camCard = $('<h3>').text(cam.neighborhood);
    let $a = $('<a>').attr('href', cam.CURRENTIMAGEURL);
    $a.append($camCard);
    // console.log($camCard);
    return cards.push($a);
  });
  return cards;
};
