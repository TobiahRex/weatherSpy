'use strict';


$(document).ready(init);

function init(){
  $('.get-swapi').on('click', getSwapiBatch);
  $('.get-swapi-one').on('click', getOneSwapi);
  $('.get-poke-one').on('click', getOnePoke);
  $('.get-pokedex').on('click', getPokeDex);
  $('div.data').on('click', '.get-poke-details', getPokeInfo);
};


function getOnePoke(){
  $('div.data').empty();
  let id = $('.ajax-input').val();
  $('.ajax-input').val('');

  $.ajax(`http://pokeapi.co/api/v2/pokemon/${id}/`)
  .done(data =>{
    let $p = $('<p>').addClass('lead well one-poke');
    $p.text(data.name);
    $('div.data').append($p);
    console.log('data: ', data);
  })
  .fail(()=> {
    console.log(`ERROR: no pokemon at that index.`);
  });
};
function getPokeDex(){
  $('div.data').empty();

  $.ajax('http://pokeapi.co/api/v2/pokedex/1')
  .done(data => {
    let $ol = $('<ol>').addClass('well lead poke-list');
    data.pokemon_entries.forEach(poke => {
      let $li = $('<li>').addClass('pokemon-entry');
      let $name = $('<p>').addClass('poke-name');
      let $hr = $('<hr>');
      let $details = $('<button>').addClass('btn btn-info get-poke-details')
        .data('url', poke.pokemon_species.url)
        .data('image', `http://pokeapi.co/media/sprites/pokemon/${poke.entry_number}.png`);
      $name.text(poke.pokemon_species.name);
      $details.text('More Info');
      $li.append($name, $details, $hr);
      $ol.append($li);
    })
    $('div.data').append($ol);
  })
  .fail(()=> {
    console.log('you suck. try again.');
  });
};
function getPokeInfo(){
  let $url = $(this).data('url');
  let $image = $(this).data('image');
  $('div.data').empty();
  $.ajax($url)
  .done(data => {
    let $p = $('<p>').addClass('well lead poke-details').data('details', JSON.stringify(data));
    let $img = $('<img>');
    $img.attr('src', $image);
    $p.append($img);
    $('div.data').append($p);
  })
  .fail(()=> {
    console.log('You suck. NO poke details. Try again.');
  });
};
function getOneSwapi(){
  $('div.data').empty();
  let id = $('.ajax-input').val();
  $('.ajax-input').val('');
  $.ajax(`http://swapi.co/api/people/${id}`)
  .done(data => {
    let $p = $('<p>').addClass('lead well one-swapi');
    $p.text(JSON.stringify(data));
    $('.data').append($p);
  })
  .fail(()=>{
    console.log('ERROR: you suck!');
  });
};
function getSwapiBatch(){
  $('div.data').empty();

  let counter = 1;
  let limit = $('.ajax-input').val();
  $('.ajax-input').val('');
  limit++;
  console.log('limit, ', limit);
  while(counter < limit){
    $.ajax({
      url       : `http://swapi.co/api/people/${counter}`,
      method    : 'GET',
      success(data, status){
        console.log(data);
        let $p = $('<p>').addClass('lead well');
        $p.text(JSON.stringify(data));
        $('.data').append($p);
      },
      error(status, error){
        error ? console.log(error) : console.log(status);
      }
    });
    console.log(counter);
    counter++;
  };
};
