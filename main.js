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
  $('.data-body').on('click', 'img.webcam-nhood', openModal);
};

function webCamInit(event){ // gets City State Query-Type
  event.preventDefault(); // stops the form from making a request using a query string. e.g. 'localhost:3000/?'
  settingsObj.city = getCity(),
  settingsObj.state = $('.panel-heading').data('state')
  $('.panel-heading').data('qtype').match(/webcam-list/) ? settingsObj.qtype = 'Weather Cams' : settingsObj.qtype = '';
  getWebCams(settingsObj);
  renderTitle(settingsObj.city, settingsObj.state, settingsObj.qtype);
};
function getState(){
  let state = $(this).children().text();
  $('.panel-heading').data('state', state);
  $('.weather-input-choice').addClass('text-primary state-chosen').text(state);
};
function getCity(){
  let city = $('.search-input-city').val();
  $('.panel-heading').data('city', city);
  !city ? city = 'autoip' : city = city.split(' ').join('_');
  return city;
};
function getWebCams(optObj){
  $('.data-body').empty();

  // LATITUDE & LONGITUDE
  navigator.geolocation.getCurrentPosition((pos)=> {
    console.log('lat: ', pos.coords.latitude, 'long: ', pos.coords.longitude);
  });

  // AJAX REQUEST
  $.getJSON(`http://api.wunderground.com/api/${API_KEY}/webcams/q/${optObj.state}/${optObj.city}.json`)
  .done(data => {
    console.log(data);
    if(!data.webcams.length) return $('div.data-body').addClass('error').append(data.response.error.description);
    let cards = renderCams(data);
    let $camList = $('<div>').addClass('row text-center ').append(cards);
    $('.data-body').append($camList);
  })
  .error(()=> {
    $('.data-body').append('<p>').text('ERROR:');
  });
};

function renderTitle(city, state, query){
  let cityParsed = city.split('_').join(' ');
  $('.weather-data-title').text(`${cityParsed} - ${state} : ${query}`);
}
function renderCams(data){
  let cards = [];
  data.webcams.forEach(cam => {
    let $camCard = $('<h2>').addClass('col-xs-4').text(cam.neighborhood);
    let $br = $('<br>');
    let $img = $('<img>').addClass('webcam-nhood').attr('src', cam.CURRENTIMAGEURL).attr({
      'data-toggle' : 'modal',
      'data-target' : '#webcam-modal'
    });
    let $a = $('<a>').append($img);
    $camCard.append($br, $a);
    return cards.push($camCard);
  });
  return cards;
};

function openModal(){
  let $state = $('.panel-heading').data('state');
  let $city = $('.panel-heading').data('city');
  let $nhood = $(this).parent().parent().text();

  $('div.modal').find('.modal-city').text($city);
  $('div.modal').find('.modal-state').text($state);
  $('div.modal').find('.modal-neighborhood').text($nhood);

  $('div.modal').find('.modal-img-src').attr('src', $(this).attr('src'));
};
