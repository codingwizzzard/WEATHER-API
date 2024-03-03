const ApiKey = "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==";

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "https://api.countrystatecity.in/v1/countries",
        headers: {
            "X-CSCAPI-KEY": ApiKey
        },
        success: function (response) {
            const countriesDropdown = $('#locationDropdown');
            response.forEach(country => {
                countriesDropdown.append(`<option value="${country.iso2}">${country.name}</option>`);
            });

            countriesDropdown.change(loadStates);
            $('#stateDropdown').change(loadCities);
        },
        error: function (error) {
            console.error('Error fetching countries:', error);
        }
    });
});

function loadStates() {
    const selectedCountry = $('#locationDropdown').val();
    const statesDropdown = $('#stateDropdown');
    const citiesDropdown = $('#cityDropdown');

    statesDropdown.empty().append('<option value="state">State</option>');
    citiesDropdown.empty().append('<option value="city">City</option>');

    $.ajax({
        type: "GET",
        url: `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states`,
        headers: {
            "X-CSCAPI-KEY": ApiKey
        },
        success: function (response) {
            response.forEach(state => {
                statesDropdown.append(`<option value="${state.iso2}">${state.name}</option>`);
            });
        },
        error: function (error) {
            console.error('Error fetching states:', error);
        }
    });
}

function loadCities() {
    const selectedCountry = $('#locationDropdown').val();
    const selectedState = $('#stateDropdown').val();
    const citiesDropdown = $('#cityDropdown');

    citiesDropdown.empty().append('<option value="city">City</option>');

    $.ajax({
        type: "GET",
        url: `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states/${selectedState}/cities`,
        headers: {
            "X-CSCAPI-KEY": ApiKey
        },
        success: function (response) {
            response.forEach(city => {
                citiesDropdown.append(`<option value="${city.name}">${city.name}</option>`);
            });
        },
        error: function (error) {
            console.error('Error fetching cities:', error);
        }
    });
}

function checkWeather() {
    const selectedCountry = $('#locationDropdown').val();
    const selectedState = $('#stateDropdown').val();
    const selectedCity = $('#cityDropdown').val();
    const weatherIcon = document.querySelector('.weather-icon')

    if (selectedCountry === 'country' || selectedState === 'state' || selectedCity === 'city') {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.querySelector('.details').style.display = "none";
        return;
    }

    const cityName = selectedCity ? selectedCity : selectedState ? selectedState : selectedCountry;

    $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=be65043bc12440c4cbe24a5249b7a8a7&units=metric`,
        success: function (response) {
            console.log(response)
            document.querySelector(".city").innerHTML = response.name;
            document.querySelector(".country").innerHTML = "(" + response.sys.country + ")";
            document.querySelector(".temp").innerHTML = Math.round(response.main.temp) + "°c";
            document.querySelector(".humidity").innerHTML = response.main.humidity + "%";
            document.querySelector(".wind").innerHTML = response.wind.speed + " km/hr";
            document.querySelector("#Weather").innerHTML = response.weather[0].main;
            document.querySelector(".pressure").innerHTML = response.main.pressure + " mbar";

            if (response.weather[0].main == "Clouds" || response.weather[0].main == "Haze" || response.weather[0].main == "Smoke") {
                weatherIcon.src = "assets/images/clouds.png";
                weatherIcon.alt = "Cloudy";
            } 
            else if(response.weather[0].main == "Clear") {
                weatherIcon.src = "assets/images/clear.png";
                weatherIcon.alt = "Clear";
            }
            else if(response.weather[0].main == "Drizzle") {
                weatherIcon.src = "assets/images/drizzle.png";
                weatherIcon.alt = "Drizzle";
            }
            else if(response.weather[0].main == "Humidity") {
                weatherIcon.src = "assets/images/humidity.png";
                weatherIcon.alt = "Humidity";
            }
            else if(response.weather[0].main == "Mist") {
                weatherIcon.src = "assets/images/mist.png";
                weatherIcon.alt = "Mist";
            }
            else if(response.weather[0].main == "Rain") {
                weatherIcon.src = "assets/images/rain.png";
                weatherIcon.alt = "Rain";
            }
            else if(response.weather[0].main == "Snow") {
                weatherIcon.src = "assets/images/snow.png";
                weatherIcon.alt = "Snow";
            }
            else if(response.weather[0].main == "Wind") {
                weatherIcon.src = "assets/images/wind.png";
                weatherIcon.alt = "Wind";
            }

            document.querySelector('.weather').style.display = "block";
            document.querySelector('.error').style.display = "none";
            document.querySelector('.details').style.display = "flex"; 
        },
        error: function (error) {
            console.error('Error fetching weather data:', error);
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            document.querySelector('.details').style.display = "none";
        }
    });
}