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
  // TICKER
  let width = $('.ticker-text').width(),
      containerwidth = $('.ticker-container').width(),
      left = containerwidth;
  function tick() { // start Ticker
    if(--left < -width){
      left = containerwidth;
    }
    $(".ticker-text").css("margin-left", left + "px");
    setTimeout(tick, 16);
  };

  $('body').click(event => { // Button Identifier
    $('.panel-heading').data('qtype', event.target.className);
  });

  $('.search-settings').submit('click', webCamInit);
  $('.search-state').on('click', getState);
  $('.data-body').on('click', 'img.webcam-nhood', openModal);
  tick();
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
  return state;
};
function getCity(){ // pull val(): 1)put .panel-heading 2)parse_City
  let city = $('.search-input-city').val();
  $('.panel-heading').data('city', city);
  !city ? city = 'autoip' : city = city.split(' ').join('_');
  return city;
};
function getWebCams(optObj){ // $ajax
  $('.data-body').empty();

  // LATITUDE & LONGITUDE
  navigator.geolocation.getCurrentPosition((pos)=> {
    console.log('lat: ', pos.coords.latitude, 'long: ', pos.coords.longitude);
  });

  // AJAX REQUEST
  console.log(`http://api.wunderground.com/api/${API_KEY}/webcams/q/${optObj.state}/${optObj.city}.json`);
  $.getJSON(`http://api.wunderground.com/api/${API_KEY}/webcams/q/${optObj.state}/${optObj.city}.json`)
  .done(data => {
    console.log(data);
    if(!data.webcams.length) return $('div.data-body').addClass('error').text('That Search yielded no results. Try again.');
    let cards = renderCams(data);
    let $camList = $('<div>').addClass('row text-center ').append(cards);
    $('.data-body').append($camList);
    updateTicker();
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
function updateTicker(){
  let city = getCity();
  let state = $('.panel-heading').data('state');
  state.split(' ').join('_');
  http://api.wunderground.com/api/e4edd15ee58cd59f/geolookup/conditions/q/CA/San_Francisco.json
  $.getJSON(`http://api.wunderground.com/api/${API_KEY}/geolookup/conditions/q/${state}/${city}.json`)
  .done(data=> {
    let $newCity = genTickerCards(data);
    $('.ticker-content').append($newCity);
  })
  .error(_=>{
    console.log({ERROR : 'You Suck'});
  });
};

function genTickerCards(data){
  let $oneCity  = $('<span>').addClass('one-city'),
      $location = $('<span>').addClass('location').text(`${data.current_observation.display_location.full}`),
      $temp     = $('<span>').addClass('lead text-primary').text(`${data.current_observation.feelslike_string}`),
      $gif      = $('<img>').attr('src', `${data.current_observation.icon_url}`),
      $weather  = $('<span>').addClass('lead text-warning').text(`${data.current_observation.weather} @ `),
      time      = Date(`${data.current_observation.observation_epoch}`),
      $obTime   = $('<span>').addClass('lead text-success').text(time.match(/\d{2}:\d{2}:\d{2} GMT/g));
  return $oneCity.append($location, $temp, $gif, $weather, $obTime);
};
