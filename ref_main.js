'use strict';

$(document).ready(init);

function init(){
  $('.film-btn-get').on('click', getFilm);
  $('#film-short-plot').on('click', setPlot);
  $('#film-long-plot').on('click', setPlot);

  $('list-btn-get').on('click', getList);
  $('actor-btn-get').on('click', getActor);
};

function getFilm(){
  let $title = $('.film-input-title').val();
  let $year = $('.film-input-year').val();
  let $plot = $('button.film-btn-get').data('plot');
  let $url = `http://www.omdbapi.com/?t=${$title}&y=${$year}&plot=${$plot}&r=json&apikey=cc89484`;
  $('div.film-data-body').empty();
  console.log($url);
  $.ajax($url)
  .done(data => {
    if(data.Response !== "False") return genFilmCard(data);
    let $errorH = $('<h4>').addClass('text-danger').text(`ERROR: ${$url} Is NOT a valid Search. Please try again.`)
    $('div.film-data-body').append($errorH);
  })
  .error(() => {
    console.log('ERROR');
  });
};
function genFilmCard(data){
  $('h4.film-data-title').text(`${data.Title} - ${data.Year}`);
  console.log(JSON.stringify(data));

  let $director = $('<samp>').addClass('film-director col-xs-12 text-primary lead').text(data.Director);
  let $dirH = $('<h6>').text('Director').addClass('col-xs-12').append($director);

  let $writer = $('<p>').addClass('film-writer col-xs-12 text-primary lead').text(data.Writer);
  let $wrtH = $('<h6>').text('Writer(s)').addClass('col-xs-12').append($writer);

  let $actors = data.Actors.split(',').map(actor => {
    return $('<samp>').addClass('film-actors col-xs-12 text-success lead').text(actor);
  });
  let $actH = $('<h6>').text('Actors').addClass('col-xs-12').append($actors);


  let $plot = $('<p>').addClass('film-plot col-xs-12 text-warning lead').text(data.Plot);
  let $plotH = $('<h6>').text('Plot').addClass('col-xs-12').append($plot);


  let $released = $('<p>').addClass('film-released col-xs-12 text-info').text(` Released - ${data.Released}`);
  let $runtime = $('<p>').addClass('film-runtime col-xs-12 text-info').text(` Runtime - ${data.Runtime}`);
  let $genre = $('<p>').addClass('film-genre col-xs-12 text-info').text(` Genre - ${data.Genre}`);
  let $awards = $('<p>').addClass('film-awards col-xs-12 text-info').text(` Awards - ${data.Awards}`);
  let $rated = $('<p>').addClass('film-rated col-xs-12 text-info').text(` Rated - ${data.Rated}`);
  let $imdbRating = $('<p>').addClass('film-imdbRating col-xs-12 text-info').text(` imdbRating - ${data.imdbRating}`);
  let $imdbVotes = $('<p>').addClass('film-imdbVotes col-xs-12 text-info').text(` imdbVotes - ${data.imdbVotes}`);
  let $imdbID = $('<p>').addClass('film-imdbID col-xs-12 text-info').text(` imdbID - ${data.imdbID}`);
  let $moreInfo = $('<h6>').text('Stats').append($awards, $rated, $released, $runtime, $genre, $imdbRating, $imdbVotes, $imdbVotes);

  let $infoDiv = $('<div>').addClass('col-xs-8');
  let $infoRow = $('<div>').addClass('row text-left');

  $infoRow.append($dirH, $wrtH, $actH, $plotH, $moreInfo);
  $infoDiv.append($infoRow);

  let $img = $('<img>').attr('src', data.Poster).addClass('film-poster col-xs-4');
  $('div.film-data-body').append($img, $infoDiv);
};
function setPlot(){
  let $plot = $(this).text().toLowerCase();
  let Plot = $(this).text();
  $('span.film-input-choice').text(Plot);
  $('button.film-btn-get').data('plot', $plot);
};




// OMDB  api
// cc89484
//
// API Key: cc89484
//
// Example: http://img.omdbapi.com/?i=tt2294629&apikey=cc89484
//
//
// Parameters:
// i = IMDb ID
// h (optional) = Desired height of image.
// t = title.
// y = year.
// plot = short, full
// r = response (JSON, XML)

// IMDB api
//http://www.imdb.com/xml/find?json=1&nr=1&nm=off&q=rambo
//http://www.imdb.com/xml/find?json=1&nm=on&q=clooney
