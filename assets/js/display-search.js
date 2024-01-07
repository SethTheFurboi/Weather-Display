var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var FiveDayEl = document.querySelector('#five-day-forecast');
var searchFormEl = document.querySelector('#search-form');
var PastResultsEl = document.querySelector('#past-searches');
var PastResultsByID = document.getElementById("past-searches")
var APIKey = '6c80a9eb6cc84c6814a3ce34cdffcaa0'

var PastSearches = localStorage.getItem('PastSearches');

if (PastSearches) {
  
  PastSearches = JSON.parse(PastSearches);

} else {

  PastSearches = []

}

function UpdatePast() {


  while (PastResultsEl.hasChildNodes()) {
    PastResultsEl.removeChild(PastResultsEl.firstChild)
  }

  console.log(PastSearches)

  for (var i = 0; i < PastSearches.length; i++) {

    console.log(PastSearches[i])

    var PastSearchCard = document.createElement('button')
    PastSearchCard.classList.add('btn', 'btn-pastresult', 'btn-block')
    PastSearchCard.textContent = PastSearches[i]
    PastResultsEl.append(PastSearchCard)

    PastSearchCard.addEventListener('click', handleSearchFormSubmit)

  }



}

UpdatePast()


function printResults(resultObj) {

  while (resultContentEl.hasChildNodes()) {
    resultContentEl.removeChild(resultContentEl.firstChild)
  }

  while (FiveDayEl.hasChildNodes()) {
    FiveDayEl.removeChild(FiveDayEl.firstChild)
  }

  // set up `<div>` to hold result content

  for (var i = 0; i < 5; i++) {

    var resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');
  
    var resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);

    var NumToLookFor = ((i+1) * 8) - 1

    var TitleWeather = resultObj.list[NumToLookFor]

    var titleEl = document.createElement('h3');
    titleEl.textContent = resultObj.city.name + ' (' + TitleWeather.dt_txt + ")";
  
    var bodyContentEl = document.createElement('p');
    
    var ImageElement = document.createElement('img');
    ImageElement.src = ('http://openweathermap.org/img/w/' +  TitleWeather.weather[0].icon + ".png")


    bodyContentEl.innerHTML =
      '<strong>Temp:</strong> ' + TitleWeather.main.temp + '°F' + '<br/>';
  
    if (TitleWeather.wind) {
      bodyContentEl.innerHTML +=
        '<strong>Wind:</strong> ' + TitleWeather.wind.speed + ' MPH' + '<br/>';
    } else {
      bodyContentEl.innerHTML +=
        '<strong>Subjects:</strong> ERROR GETTING WIND!';
    }
  
    if (TitleWeather.main.humidity) {
      bodyContentEl.innerHTML +=
        '<strong>Humidity:</strong> ' + TitleWeather.main.humidity + '%';
    } else {
      bodyContentEl.innerHTML +=
        '<strong>Description:</strong>  ERROR GETTING HUMIDITY!';
    }
  
    resultBody.append(titleEl, ImageElement, bodyContentEl);

    FiveDayEl.append(resultCard);

  }
  
  var resultCard = document.createElement('div');
  resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  var resultBody = document.createElement('div');
  resultBody.classList.add('card-body');
  resultCard.append(resultBody);

  var TitleWeather = resultObj.list[0]

  var ImageElement = document.createElement('img');
  ImageElement.src = ('http://openweathermap.org/img/w/' +  TitleWeather.weather[0].icon + ".png")

  var titleEl = document.createElement('h3');
  titleEl.textContent = resultObj.city.name + ' (' + TitleWeather.dt_txt + ")";

  var bodyContentEl = document.createElement('p');
  bodyContentEl.innerHTML =
    '<strong>Temp:</strong> ' + TitleWeather.main.temp + '°F' + '<br/>';

  if (TitleWeather.wind) {
    bodyContentEl.innerHTML +=
      '<strong>Wind:</strong> ' + TitleWeather.wind.speed + ' MPH' + '<br/>';
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Subjects:</strong> ERROR GETTING WIND!';
  }

  if (TitleWeather.main.humidity) {
    bodyContentEl.innerHTML +=
      '<strong>Humidity:</strong> ' + TitleWeather.main.humidity + '%';
  } else {
    bodyContentEl.innerHTML +=
      '<strong>Description:</strong>  ERROR GETTING HUMIDITY!';
  }

  resultBody.append(titleEl, ImageElement, bodyContentEl);

  resultContentEl.append(resultCard);

}

function GetLatAndLong(query) {
  var FindCoordinatesURL = 'http://api.openweathermap.org/geo/1.0/direct?q=';

  console.log(query)

  if (query) {
    FindCoordinatesURL = FindCoordinatesURL + query + '&limit=1&appid=' + APIKey;
    console.log(FindCoordinatesURL)
  }

  fetch(FindCoordinatesURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {

      var Lat = locRes[0].lat
      var Long = locRes[0].lon

      GetWeather(Lat,Long)

    })
    .catch(function (error) {
      console.error(error);
    });
}

function GetWeather(Lat, Long) {

  var GetWeatherURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + Lat + '&lon=' + Long + '&appid=' + APIKey + '&units=imperial'

  fetch(GetWeatherURL)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }

    return response.json();
  })
  .then(function (locRes) {

    console.log(locRes.list)
    console.log(locRes.list[0].main.temp)

    resultTextEl.textContent = locRes.city.name

    printResults(locRes)


  })
  .catch(function (error) {
    console.error(error);
  });

}

function handleSearchFormSubmit(event) {
  event.preventDefault();

  searchInputVal = ((event.target != searchFormEl && event.target.textContent) || document.querySelector('#search-input').value)

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  if (!PastSearches.includes(searchInputVal)) {

    PastSearches.push(searchInputVal)
    localStorage.setItem('PastSearches', JSON.stringify(PastSearches))
    UpdatePast()

  }

  GetLatAndLong(searchInputVal);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);