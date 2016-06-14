'use strict';
$(document).ready(init);
const API_KEY = 'e4edd15ee58cd59f';
let settingsObj = {
  qtype     :   '',
  city      :   '',
  qcity     :   '',
  state     :   ''
};

function init(){
  $('body').click(event => {
    $('.panel-heading').data('qtype', event.target.className);
  });

  $('.search-settings').submit('click', webCamInit);
  $('.search-state').on('click', getState);
};

function webCamInit(event){
  event.preventDefault(); // stops the form from making a request using a query string. e.g. 'localhost:3000/?'
  settingsObj.city = getCity(),
  settingsObj.state = $('.panel-heading').data('state')
  $('.panel-heading').data('qtype').match(/webcam-list/) ? settingsObj.qtype = 'Weather Cams' : settingsObj.qtype = '';
  getWebCams(settingsObj);
};

function getWebCams(optObj){
  $('.data-body').empty();

  // LATITUDE & LONGITUDE
  // navigator.geolocation.getCurrentPosition((pos)=> {
  //   console.log('lat: ', pos.coords.latitude, 'long: ', pos.coords.longitude);
  // });

  // AJAX REQUEST
  $.getJSON(`http://api.wunderground.com/api/${API_KEY}/webcams/q/${optObj.state}/${optObj.city}.json`)
  .done(data => {
    console.log(data);
    if(!data.webcams.length) return $('div.data-body').addClass('error').append(data.response.error.description);
    let cards = renderCams(data);
    let $camList = $('<div>').addClass('row col-xs-8 col-xs-offset-2 text-center').append(cards);
    $('.weather-data-title').text(`${$('.search-input-city').val()}, ${optObj.state} - ${optObj.qtype}`);
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

function renderTitle(city, state, query){
  $('.weather-data-title').text(`${city} - ${state} : ${query}`);
}
function getState(){
  let state = $(this).children().text();
  $('.panel-heading').data('state', state);
  $('.weather-input-choice').addClass('text-primary state-chosen').text(state);
};
function getCity(){
  let city = $('.search-input-city').val()
  !city ? city = 'autoip' : city = city.split(' ').join('_');
  return city;
};
