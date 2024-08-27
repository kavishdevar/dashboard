document.addEventListener('DOMContentLoaded', () => {

    const entities = [
        { name: "Pantry Light", entity_id: "light.pantry", type: "strip" },
        { name: "Crockery Light", entity_id: "light.crockery", type: "recessed" },
        { name: "Temple Strip light", entity_id: "light.temple_background", type: "strip" },
        { name: "Temple Drop Light", entity_id: "light.temple_top", type: "recessed" },
        { name: "Kavish's Air Conditioner", entity_id: "switch.kavish_ac", type: "ac" }
    ];

    entities.forEach(entity => {
        document.querySelector('#hass-grid').insertAdjacentHTML('beforeend',
            `
        <div class="grid-item hass" onclick="toggle(this)" data-entity="${entity.entity_id}" data-type="${entity.type}">
            <div class="grid-item-content">
            <span class="hass-entity-logo">${entity.logo}</span>
            <h1 class="hass-entity-name">${entity.name}</h1>
            </div>
        </div>
        `);

        el = document.querySelector(`[data-entity="${entity.entity_id}"]`);

        switch (entity.type) {
            case 'strip':
                el.querySelector('.hass-entity-logo').innerHTML = '􁏒';
                break;
            case 'recessed':
                el.querySelector('.hass-entity-logo').innerHTML = '􁌢';
                break;
            case 'ac':
                el.querySelector('.hass-entity-logo').innerHTML = '􁓮';
                break;
        }

    });

    init(entities);
});

function updateClock() {
    const now = new Date();
    var hours = now.getHours().toString().padStart(2, '0');
    if (hours == "00") {
        hours = "12";
    }
    if (hours.startsWith('0')) {
        hours = hours.substring(1);
    }
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').innerText = `${hours}:${minutes}`;
}

setInterval(updateClock, 1000);

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const date = now.toLocaleDateString('en-GB', options);
    document.getElementById('date').innerText = date;
}
setInterval(updateDate, 1000 * 60 * 60);

onload = () => {
    updateClock();
    updateDate();
}

var touchstartX = 0;
var touchstartY = 0;
var touchendX = 0;
var touchendY = 0;

let apiKey = '';

fetch('/data.json')
    .then(response => response.json())
    .then(data => data.weatherapi.key)
    .then(key => apiKey = key)
    .catch(error => console.error('Error:', error));

var lat = 28.41124559532952;
var lon = 76.91098173525167;

// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
// }

function errorFunction(e) {
    console.log(e);
}
function successFunction(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
}
url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=66c8eae54f8ec080296424cawfef11b`

fetch(url)
    .then(response => response.json())
    .then(data => {
        document.getElementById("location").innerHTML = 'neighbourhood' in data['address'] ? `${data.address.neighbourhood}  <span style="font-size: 0.95em;">􀋒</span>` : `${data.address.city} <span style="font-size: 0.95em;">􀋒</span>`;
    })
    .catch(error => {
        console.error('Error:', error);
        lat = 28.41124559532952
        lon = 76.91098173525167
    });

setTimeout(() => {
    fetchWeatherData();
}, 2000);

const SFicons = {
    "sun.min": "􀆫",
    "sun.min.fill": "􀆬",
    "sun.max": "􀆭",
    "sun.max.fill": "􀆮",
    "sun.max.circle": "􀷎",
    "sun.max.circle.fill": "􀷏",
    "sun.max.trianglebadge.exclamationmark": "􁜎",
    "sun.max.trianglebadge.exclamationmark.fill": "􁜏",
    "sunrise": "􀆱",
    "sunrise.fill": "􀆲",
    "sunrise.circle": "􁛁",
    "sunrise.circle.fill": "􁛂",
    "sunset": "􀆳",
    "sunset.fill": "􀆴",
    "sunset.circle": "􁛃",
    "sunset.circle.fill": "􁛄",
    "sun.horizon": "􀻞",
    "sun.horizon.fill": "􀻟",
    "sun.horizon.circle": "􁛅",
    "sun.horizon.circle.fill": "􁛆",
    "sun.dust": "􀆵",
    "sun.dust.fill": "􀆶",
    "sun.dust.circle": "􁛇",
    "sun.dust.circle.fill": "􁛈",
    "sun.haze": "􀆷",
    "sun.haze.fill": "􀆸",
    "sun.haze.circle": "􁛉",
    "sun.haze.circle.fill": "􁛊",
    "sun.rain": "􁷌",
    "sun.rain.fill": "􁷍",
    "sun.rain.circle": "􁷎",
    "sun.rain.circle.fill": "􁷏",
    "sun.snow": "􁷐",
    "sun.snow.fill": "􁷑",
    "sun.snow.circle": "􁷒",
    "sun.snow.circle.fill": "􁷓",
    "moon": "􀆹",
    "moon.fill": "􀆺",
    "moon.circle": "􀆻",
    "moon.circle.fill": "􀆼",
    "moon.dust": "􁶽",
    "moon.dust.fill": "􁶾",
    "moon.dust.circle": "􁶿",
    "moon.dust.circle.fill": "􁷀",
    "moon.haze": "􁑯",
    "moon.haze.fill": "􁑰",
    "moon.haze.circle": "􁜷",
    "moon.haze.circle.fill": "􁜸",
    "sparkles": "􀆿",
    "moon.stars": "􀇀",
    "moon.stars.fill": "􀇁",
    "moon.stars.circle": "􁛋",
    "moon.stars.circle.fill": "􁛌",
    "cloud": "􀇂",
    "cloud.fill": "􀇃",
    "cloud.circle": "􁛍",
    "cloud.circle.fill": "􁛎",
    "cloud.drizzle": "􀇄",
    "cloud.drizzle.fill": "􀇅",
    "cloud.drizzle.circle": "􁛏",
    "cloud.drizzle.circle.fill": "􁛐",
    "cloud.rain": "􀇆",
    "cloud.rain.fill": "􀇇",
    "cloud.rain.circle": "􁛑",
    "cloud.rain.circle.fill": "􁛒",
    "cloud.heavyrain": "􀇈",
    "cloud.heavyrain.fill": "􀇉",
    "cloud.heavyrain.circle": "􁛓",
    "cloud.heavyrain.circle.fill": "􁛔",
    "cloud.fog": "􀇊",
    "cloud.fog.fill": "􀇋",
    "cloud.fog.circle": "􁛕",
    "cloud.fog.circle.fill": "􁛖",
    "cloud.hail": "􀇌",
    "cloud.hail.fill": "􀇍",
    "cloud.hail.circle": "􁛗",
    "cloud.hail.circle.fill": "􁛘",
    "cloud.snow": "􀇎",
    "cloud.snow.fill": "􀇏",
    "cloud.snow.circle": "􁛙",
    "cloud.snow.circle.fill": "􁛚",
    "cloud.sleet": "􀇐",
    "cloud.sleet.fill": "􀇑",
    "cloud.sleet.circle": "􁛛",
    "cloud.sleet.circle.fill": "􁛜",
    "cloud.bolt": "􀇒",
    "cloud.bolt.fill": "􀇓",
    "cloud.bolt.circle": "􁛝",
    "cloud.bolt.circle.fill": "􁛞",
    "cloud.bolt.rain": "􀇞",
    "cloud.bolt.rain.fill": "􀇟",
    "cloud.bolt.rain.circle": "􁛟",
    "cloud.bolt.rain.circle.fill": "􁛠",
    "cloud.sun": "􀇔",
    "cloud.sun.fill": "􀇕",
    "cloud.sun.circle": "􁛡",
    "cloud.sun.circle.fill": "􁛢",
    "cloud.sun.rain": "􀇖",
    "cloud.sun.rain.fill": "􀇗",
    "cloud.sun.rain.circle": "􁛣",
    "cloud.sun.rain.circle.fill": "􁛤",
    "cloud.sun.bolt": "􀇘",
    "cloud.sun.bolt.fill": "􀇙",
    "cloud.sun.bolt.circle": "􁛥",
    "cloud.sun.bolt.circle.fill": "􁛦",
    "cloud.moon": "􀇚",
    "cloud.moon.fill": "􀇛",
    "cloud.moon.circle": "􁛧",
    "cloud.moon.circle.fill": "􁛨",
    "cloud.moon.rain": "􀇜",
    "cloud.moon.rain.fill": "􀇝",
    "cloud.moon.rain.circle": "􁛩",
    "cloud.moon.rain.circle.fill": "􁛪",
    "cloud.moon.bolt": "􀇠",
    "cloud.moon.bolt.fill": "􀇡",
    "cloud.moon.bolt.circle": "􁛫",
    "cloud.moon.bolt.circle.fill": "􁛬",
    "smoke": "􀇢",
    "smoke.fill": "􀇣",
    "smoke.circle": "􁛭",
    "smoke.circle.fill": "􁛮",
    "wind": "􀇤",
    "wind.circle": "􁛯",
    "wind.circle.fill": "􁛰",
    "wind.snow": "􀇦",
    "wind.snow.circle": "􁛱",
    "wind.snow.circle.fill": "􁛲",
    "snowflake": "􀇥",
    "snowflake.circle": "􁇌",
    "snowflake.circle.fill": "􁇍",
    "snowflake.slash": "􁠂",
    "tornado": "􀇧",
    "tornado.circle": "􁛳",
    "tornado.circle.fill": "􁛴",
    "tropicalstorm": "􀇨",
    "tropicalstorm.circle": "􁛵",
    "tropicalstorm.circle.fill": "􁛶",
    "hurricane": "􀇩",
    "hurricane.circle": "􁛷",
    "hurricane.circle.fill": "􁛸",
    "thermometer.sun": "􀇪",
    "thermometer.sun.fill": "􀦜",
    "thermometer.sun.circle": "􁛹",
    "thermometer.sun.circle.fill": "􁛺",
    "thermometer.snowflake": "􀇫",
    "thermometer.snowflake.circle": "􁛻",
    "thermometer.snowflake.circle.fill": "􁛼",
    "thermometer.variable": "􂬮",
    "thermometer.variable.and.figure": "􁷉",
    "thermometer.variable.and.figure.circle": "􁷊",
    "thermometer.variable.and.figure.circle.fill": "􁷋",
    "thermometer.low": "􁏃",
    "thermometer.medium": "􀇬",
    "thermometer.high": "􁏄",
    "thermometer.medium.slash": "􁗄",
    "degreesign.farenheit": "􂧣",
    "degreesign.celsius": "􂧤",
    "aqi.low": "􀴾",
    "aqi.medium": "􀴿",
    "aqi.high": "􀵀",
    "humidity": "􁃚",
    "humidity.fill": "􁃛",
    "rainbow": "􀼭",
    "cloud.rainbow.crop": "􁷞",
    "cloud.rainbow.crop.fill": "􁷠",
    "carbon.monoxide.cloud": "􁒶",
    "carbon.monoxide.cloud.fill": "􁒷",
    "carbon.dioxide.cloud": "􁒸",
    "carbon.dioxide.cloud.fill": "􁒹"
}

const weatherIconMappingOWM = {
    // Clear sky
    "01d": SFicons["sun.max"],
    "01n": SFicons["moon.stars"],

    // Few clouds
    "02d": SFicons["cloud.sun"],
    "02n": SFicons["cloud.moon"],

    // Scattered clouds
    "03d": SFicons["cloud.fill"],
    "03n": SFicons["cloud"],

    // Broken clouds
    "04d": SFicons["cloud.sun.fill"],
    "04n": SFicons["cloud.moon.fill"],

    // Shower rain
    "09d": SFicons["cloud.drizzle.fill"],
    "09n": SFicons["cloud.drizzle.fill"],

    // Rain
    "10d": SFicons["cloud.rain"],
    "10n": SFicons["cloud.rain.fill"],

    // Thunderstorm
    "11d": SFicons["cloud.storm"],
    "11n": SFicons["cloud.bolt.fill"],

    // Snow
    "13d": SFicons["snowflake"],
    "13n": SFicons["snowflake.circle.fill"],

    // Extreme rain
    "50d": SFicons["mist"],
    "50n": SFicons["mist.fill"],

    // Drizzle
    "02d": SFicons["cloud.drizzle"],
    "02n": SFicons["cloud.drizzle.fill"],
    "30d": SFicons["cloud.drizzle"],
    "30n": SFicons["cloud.drizzle.fill"],
    "31d": SFicons["cloud.drizzle"],
    "31n": SFicons["cloud.drizzle.fill"],
    "32d": SFicons["cloud.drizzle"],
    "32n": SFicons["cloud.drizzle.fill"],

    // Fog
    "50d": SFicons["cloud.fog"],
    "50n": SFicons["cloud.fog.fill"],

    // Haze
    "50d": SFicons["cloud.haze"],
    "50n": SFicons["cloud.haze.fill"],

    // Dust
    "50d": SFicons["cloud.dust"],
    "50n": SFicons["cloud.dust.fill"],

    // Sand
    "50d": SFicons["cloud.dust"],
    "50n": SFicons["cloud.dust.fill"],

    // Ash
    "50d": SFicons["cloud.smoke"],
    "50n": SFicons["cloud.smoke.fill"],

    // Squall
    "50d": SFicons["wind"],
    "50n": SFicons["wind.fill"],

    // Tornado
    "50d": SFicons["tornado"],
    "50n": SFicons["tornado.fill"],
};


wapilist = [
    {
        "code": 1000,
        "day": "Sunny",
        "night": "Clear",
        "icon": 113
    },
    {
        "code": 1003,
        "day": "Partly cloudy",
        "night": "Partly cloudy",
        "icon": 116
    },
    {
        "code": 1006,
        "day": "Cloudy",
        "night": "Cloudy",
        "icon": 119
    },
    {
        "code": 1009,
        "day": "Overcast",
        "night": "Overcast",
        "icon": 122
    },
    {
        "code": 1030,
        "day": "Mist",
        "night": "Mist",
        "icon": 143
    },
    {
        "code": 1063,
        "day": "Patchy rain possible",
        "night": "Patchy rain possible",
        "icon": 176
    },
    {
        "code": 1066,
        "day": "Patchy snow possible",
        "night": "Patchy snow possible",
        "icon": 179
    },
    {
        "code": 1069,
        "day": "Patchy sleet possible",
        "night": "Patchy sleet possible",
        "icon": 182
    },
    {
        "code": 1072,
        "day": "Patchy freezing drizzle possible",
        "night": "Patchy freezing drizzle possible",
        "icon": 185
    },
    {
        "code": 1087,
        "day": "Thundery outbreaks possible",
        "night": "Thundery outbreaks possible",
        "icon": 200
    },
    {
        "code": 1114,
        "day": "Blowing snow",
        "night": "Blowing snow",
        "icon": 227
    },
    {
        "code": 1117,
        "day": "Blizzard",
        "night": "Blizzard",
        "icon": 230
    },
    {
        "code": 1135,
        "day": "Fog",
        "night": "Fog",
        "icon": 248
    },
    {
        "code": 1147,
        "day": "Freezing fog",
        "night": "Freezing fog",
        "icon": 260
    },
    {
        "code": 1150,
        "day": "Patchy light drizzle",
        "night": "Patchy light drizzle",
        "icon": 263
    },
    {
        "code": 1153,
        "day": "Light drizzle",
        "night": "Light drizzle",
        "icon": 266
    },
    {
        "code": 1168,
        "day": "Freezing drizzle",
        "night": "Freezing drizzle",
        "icon": 281
    },
    {
        "code": 1171,
        "day": "Heavy freezing drizzle",
        "night": "Heavy freezing drizzle",
        "icon": 284
    },
    {
        "code": 1180,
        "day": "Patchy light rain",
        "night": "Patchy light rain",
        "icon": 293
    },
    {
        "code": 1183,
        "day": "Light rain",
        "night": "Light rain",
        "icon": 296
    },
    {
        "code": 1186,
        "day": "Moderate rain at times",
        "night": "Moderate rain at times",
        "icon": 299
    },
    {
        "code": 1189,
        "day": "Moderate rain",
        "night": "Moderate rain",
        "icon": 302
    },
    {
        "code": 1192,
        "day": "Heavy rain at times",
        "night": "Heavy rain at times",
        "icon": 305
    },
    {
        "code": 1195,
        "day": "Heavy rain",
        "night": "Heavy rain",
        "icon": 308
    },
    {
        "code": 1198,
        "day": "Light freezing rain",
        "night": "Light freezing rain",
        "icon": 311
    },
    {
        "code": 1201,
        "day": "Moderate or heavy freezing rain",
        "night": "Moderate or heavy freezing rain",
        "icon": 314
    },
    {
        "code": 1204,
        "day": "Light sleet",
        "night": "Light sleet",
        "icon": 317
    },
    {
        "code": 1207,
        "day": "Moderate or heavy sleet",
        "night": "Moderate or heavy sleet",
        "icon": 320
    },
    {
        "code": 1210,
        "day": "Patchy light snow",
        "night": "Patchy light snow",
        "icon": 323
    },
    {
        "code": 1213,
        "day": "Light snow",
        "night": "Light snow",
        "icon": 326
    },
    {
        "code": 1216,
        "day": "Patchy moderate snow",
        "night": "Patchy moderate snow",
        "icon": 329
    },
    {
        "code": 1219,
        "day": "Moderate snow",
        "night": "Moderate snow",
        "icon": 332
    },
    {
        "code": 1222,
        "day": "Patchy heavy snow",
        "night": "Patchy heavy snow",
        "icon": 335
    },
    {
        "code": 1225,
        "day": "Heavy snow",
        "night": "Heavy snow",
        "icon": 338
    },
    {
        "code": 1237,
        "day": "Ice pellets",
        "night": "Ice pellets",
        "icon": 350
    },
    {
        "code": 1240,
        "day": "Light rain shower",
        "night": "Light rain shower",
        "icon": 353
    },
    {
        "code": 1243,
        "day": "Moderate or heavy rain shower",
        "night": "Moderate or heavy rain shower",
        "icon": 356
    },
    {
        "code": 1246,
        "day": "Torrential rain shower",
        "night": "Torrential rain shower",
        "icon": 359
    },
    {
        "code": 1249,
        "day": "Light sleet showers",
        "night": "Light sleet showers",
        "icon": 362
    },
    {
        "code": 1252,
        "day": "Moderate or heavy sleet showers",
        "night": "Moderate or heavy sleet showers",
        "icon": 365
    },
    {
        "code": 1255,
        "day": "Light snow showers",
        "night": "Light snow showers",
        "icon": 368
    },
    {
        "code": 1258,
        "day": "Moderate or heavy snow showers",
        "night": "Moderate or heavy snow showers",
        "icon": 371
    },
    {
        "code": 1261,
        "day": "Light showers of ice pellets",
        "night": "Light showers of ice pellets",
        "icon": 374
    },
    {
        "code": 1264,
        "day": "Moderate or heavy showers of ice pellets",
        "night": "Moderate or heavy showers of ice pellets",
        "icon": 377
    },
    {
        "code": 1273,
        "day": "Patchy light rain with thunder",
        "night": "Patchy light rain with thunder",
        "icon": 386
    },
    {
        "code": 1276,
        "day": "Moderate or heavy rain with thunder",
        "night": "Moderate or heavy rain with thunder",
        "icon": 389
    },
    {
        "code": 1279,
        "day": "Patchy light snow with thunder",
        "night": "Patchy light snow with thunder",
        "icon": 392
    },
    {
        "code": 1282,
        "day": "Moderate or heavy snow with thunder",
        "night": "Moderate or heavy snow with thunder",
        "icon": 395
    }
]

const weatherIconMappingWAPI = {
    1000: SFicons["sun.max"],
    1003: SFicons["cloud.sun"],
    1006: SFicons["cloud.fill"],
    1009: SFicons["cloud.fill"],
    1030: SFicons["cloud.fog"],
    1063: SFicons["cloud.drizzle.fill"],
    1066: SFicons["cloud.snow"],
    1069: SFicons["cloud.sleet"],
    1072: SFicons["cloud.bolt.fill"],
    1087: SFicons["cloud.bolt.fill"],
    1114: SFicons["cloud.snow"],
    1117: SFicons["cloud.snow"],
    1135: SFicons["cloud.fog"],
    1147: SFicons["cloud.fog"],
    1150: SFicons["cloud.drizzle.fill"],
    1153: SFicons["cloud.drizzle.fill"],
    1168: SFicons["cloud.drizzle.fill"],
    1171: SFicons["cloud.drizzle.fill"],
    1180: SFicons["cloud.rain"],
    1183: SFicons["cloud.rain"],
    1186: SFicons["cloud.rain"],
    1189: SFicons["cloud.rain"],
    1192: SFicons["cloud.rain"],
    1195: SFicons["cloud.rain"],
    1198: SFicons["cloud.sleet"],
    1201: SFicons["cloud.sleet"],
    1204: SFicons["cloud.sleet"],
    1207: SFicons["cloud.sleet"],
    1210: SFicons["cloud.snow"],
    1213: SFicons["cloud.snow"],
    1216: SFicons["cloud.snow"],
    1219: SFicons["cloud.snow"],
    1222: SFicons["cloud.snow"],
    1225: SFicons["cloud.snow"],
    1237: SFicons["cloud.sleet"],
    1240: SFicons["cloud.rain"],
    1243: SFicons["cloud.rain"],
    1246: SFicons["cloud.rain"],
    1249: SFicons["cloud.sleet"],
    1252: SFicons["cloud.sleet"],
    1255: SFicons["cloud.snow"],
    1258: SFicons["cloud.snow"],
    1261: SFicons["cloud.sleet"],
    1264: SFicons["cloud.sleet"],
    1273: SFicons["cloud.bolt.fill"],
    1276: SFicons["cloud.bolt.fill"],
    1279: SFicons["cloud.snow"],
    1282: SFicons["cloud.snow"],
}

async function fetchWeatherDataOWM() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°`;
        document.getElementById("weather-description").textContent = data.weather[0].main;
        document.getElementById("high-low").textContent = `H: ${Math.round(data.main.temp_max)}° L: ${Math.round(data.main.temp_min)}°`;

        const weather = document.getElementById("weather");

        const iconCode = data.weather[0].icon;
        const sunrise = new Date(sunrise * 1000);
        const sunset = new Date(dsunset * 1000);
        const currentTime = new Date();

        if (currentTime > sunrise && currentTime < sunset) {
            weather.style.backgroundImage = "linear-gradient(0deg, rgb(70, 150, 185), rgb(0, 122, 176))";
        } else {
            weather.style.backgroundImage = "linear-gradient(0deg, rgb(45, 50, 65), rgb(4, 12, 30))";
        }

        let weatherIcon;
        if (weatherIconMapping.hasOwnProperty(iconCode)) {
            weatherIcon = weatherIconMapping[iconCode];
        } else {
            console.warn(`No SFicon mapping found for icon code: ${iconCode}`);
            weatherIcon = SFicons["cloud"];
        }

        document.getElementById("weather-icon").textContent = weatherIcon;
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

async function fetchWeatherWAPI() {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&aqi=yes`);
        const data = await response.json();

        document.getElementById("temperature").textContent = `${Math.round(data.current.temp_c)}°`;
        document.getElementById("weather-description").textContent = data.current.condition.text;
        document.getElementById("high-low").textContent = `H: ${Math.round(data.forecast.forecastday[0].day.maxtemp_c)}° L: ${Math.round(data.forecast.forecastday[0].day.mintemp_c)}°`;

        const weather = document.getElementById("weather");

        let weatherIcon;

        if (data.current.is_day == 1) {
            weather.style.backgroundImage = "linear-gradient(0deg, rgb(70, 150, 185), rgb(0, 122, 176))";
            const specificIcons = [
                "cloud.sleet.fill.png",
                "aqi.high.png",
                "cloud.bolt.rain.fill.png",
                "cloud.drizzle.fill.png",
                "cloud.heavyrain.fill.png",
                "cloud.moon.rain.circle.png",
                "cloud.moon.rain.fill.png",
                "cloud.rain.fill.png",
                "cloud.rainbow.crop.fill.png",
                "cloud.rainbow.crop.png",
                "cloud.sun.bolt.fill.png",
                "cloud.sun.fill.png",
                "cloud.sun.rain.fill.png",
                "moon.circle.fill.png",
                "rainbow.png",
                "sparkles.png",
                "sun.dust.fill.png",
                "sun.haze.fill.png",
                "sun.horizon.fill.png",
                "sun.max.fill.png",
                "sun.max.trianglebadge.exclamationmark.fill.png",
                "sun.max.trianglebadge.exclamationmark.png",
                "sun.rain.fill.png",
                "sun.snow.fill.png",
                "sunrise.fill.png",
                "sunset.fill.png",
                "thermometer.high.png",
                "thermometer.low.png",
                "thermometer.snowflake.png",
                "thermometer.sun.fill.png"
            ];

            const currentIcon = weatherIconMappingWAPI[data.current.condition.code];

            if (specificIcons.includes(currentIcon)) {
                for (icon in SFicons) {
                    if (currentIcon == SFicons[icon]) {
                        weatherIcon = icon;
                        break;
                    }
                }
                document.getElementById("weather-icon").innerHTML = `<img src="/icons/${weatherIcon}.png" alt="weather-icon" style="width: 20px; height: 20px; filter: invert(100%) sepia(0%) saturate(7500%) hue-rotate(7deg) brightness(109%) contrast(110%);">`;
            } else {
                weatherIcon = currentIcon;
                document.getElementById("weather-icon").innerHTML = weatherIcon;
            }
        } else {
            weather.style.backgroundImage = "linear-gradient(0deg, rgb(45, 50, 65), rgb(4, 12, 30))";

            weatherIcon = weatherIconMappingWAPI[data.current.condition.code];
            document.getElementById("weather-icon").textContent = weatherIcon;
        }

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

fetchWeatherData = fetchWeatherWAPI;

function closeNotif() {
    document.getElementById('notif-div').classList.remove('show');
    setTimeout(() => {
        document.getElementById('notif-div').style.display = 'none';
    }, 500);
}

function showNotif() {
    document.getElementById('notif-div').style.display = 'block';
    setTimeout(() => { document.getElementById('notif-div').classList.add('show'); }, 100);
}

setInterval(() => {
    fetchWeatherData();
}, 1000 * 60 * 10);

spotifyExpiresAt = 1727771714095;
spotifyToken = 'BQBYtINI7uN25VJk6rgpTSZ2OpSVHahuC6N472zvYU5S8mNxJmpSggXeBtV-CZV4kZbkphSvfHlbWSvHTuj82YAWIjj7hrraIx6S9c8ZAz6OKhrqgvMvJHH9TEXJdCsUURLaMUtS9sS5juEuI4Pqfii-rW00SXn5BnHf5l4aketQO_L1i0AR9752UBQR9vjRU7GNOQ09iICv4U-_j6ZbkUHtAFwtNTya';
var isPlaying = false;
async function getSpotifyPlaybackState() {
    let token;

    if (new Date().getTime() > spotifyExpiresAt) {
        const response = await fetch('/data.json');
        const data = await response.json();
        id = data.spotify.id;
        secret = data.spotify.secret;
        refresh_token = data.spotify.refresh_token;

        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${id}:${secret}`)}`,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, access-control-allow-origin, Authorization'

            },
            body: `grant_type=refresh_token&refresh_token=${refresh_token}`
        });

        const tokenData = await tokenResponse.json();
        expiresIn = tokenData.expires_in;
        spotifyExpiresAt = new Date().getTime() + expiresIn * 1000;
        spotifyToken = tokenData.access_token;
        token = spotifyToken;
    } else {
        token = spotifyToken;
    }

    fetch('https://api.spotify.com/v1/me/player', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json().catch(error => {
            isPlaying = false;
        }))
        .then(data => {
            const title = document.getElementById('spotify-title');
            const artist = document.getElementById('spotify-artist');
            const album = document.getElementById('spotify-album');
            const albumArt = document.getElementById('spotify-album-art');
            const progress = document.getElementById('spotify-progress-bar');

            title.textContent = data.item.name;
            artist.textContent = data.item.artists[0].name;
            album.textContent = data.item.album.name;
            albumArt.style.backgroundImage = `url(${data.item.album.images[0].url})`;
            progress.style.width = `${data.progress_ms / data.item.duration_ms * 100}%`;
            
            isPlaying = true
        })
        .catch(error => console.error('Error:', error));
}

toggleSpotify = () => {
    if (isPlaying) {
        pauseSpotify();
    } else {
        playSpotify();
    }
}

pauseSpotify = () => {
    fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${spotifyToken}`
        }
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

    isPlaying = false;
    document.getElementById('spotify-toggle').innerHTML = '􀊄';
}

playSpotify = () => {
    fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${spotifyToken}`
        }
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

    isPlaying = true;
    document.getElementById('spotify-toggle').innerHTML = '􀊃';
}

document.addEventListener('DOMContentLoaded', function () {document.getElementById('spotify-toggle').addEventListener('click', toggleSpotify)});

getSpotifyPlaybackState()

setInterval(() => {
    getSpotifyPlaybackState();
}, 1000);