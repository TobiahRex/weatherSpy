'use strict';
$(document).ready(init);
const API_KEY = 'e4edd15ee58cd59f';

function init(){
  $('.search-settings').submit('click', webCamInit);
  $('.search-state').on('click', setState);
};

function webCamInit(event){
  event.preventDefault(); // stops the form from making a request using a query string. e.g. 'localhost:3000/?'
  let settingsObj = {
    city : $('.search-input-city').val()
  };
  getWebCams(settingsObj);
};

function getWebCams(optObj){
  $('.data-body').empty();
  let city;
  !optObj.city ? city = 'autoip' : city = optObj.city.split(' ').join('_');


  // LATITUDE & LONGITUDE
  // navigator.geolocation.getCurrentPosition((pos)=> {
  //   console.log('lat: ', pos.coords.latitude, 'long: ', pos.coords.longitude);
  // });



  // AJAX REQUEST
  $.getJSON(`http://api.wunderground.com/api/${API_KEY}/webcams/q/${city}.json`)
  .done(data => {
    console.log(data);
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

function setState(){
  let state = $(this).children().text();
  $('.webcam-btn-get').data('state', state);
};
