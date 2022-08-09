const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// console.log(__dirname);
// console.log(path.join(__dirname, '../public'));

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and views location

app.set('views engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index.hbs', {
    title: 'Weather App',
    name: 'Poko',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    title: 'About me',
    name: 'Poko',
  });
});

app.get('/help', (req, res) => {
  res.render('help.hbs', {
    title: 'Help',
    description: 'Here is help',
    name: 'Piki Poko',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address!',
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    });
  }

  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get('/help/*', (req, res) => {
  res.render('error404.hbs', {
    error: 'Help article not found',
    title: '404',
    name: 'Poko',
  });
});

app.get('*', (req, res) => {
  res.render('error404.hbs', {
    error: '404 Page not found',
    title: '404',
    name: 'Poko',
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
