const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const request = require('request');
const apiKey = '3c212e0791daea8f973ba432f9f290d3';


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));



const logRequestStart = (req, res, next) => {
  console.info(`${req.method} ${req.originalUrl}`) 

  res.on('finish', () => {
      console.info(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`)
  })

  next()
}

app.use(logRequestStart)


app.get('/', function (req, res) {
  res.render('index')
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        var Array = weather.weather;
        let weatherText = `It's ${weather.main.temp} degrees and ${Array[0].main.toLowerCase()} in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
