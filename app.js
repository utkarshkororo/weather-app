const path = require('path');
const express = require('express');
const hbs = require('hbs');
const dotenv = require('dotenv');
const { geocode } = require('./utils/geocode');
const { forecast } = require('./utils/forecast');

dotenv.config({ path: './config.env' });

const app = express();

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Setup static directory to serve
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Utkarsh',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Utkarsh',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'Utkarsh',
    helpText: 'You can reach me at honeykororo@gmail.com.',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.json({
      error: 'You must provide an address',
    });
  }

  geocode(
    req.query.address,
    (error, { longitude, latitude, location } = {}) => {
      if (error) {
        return res.json({ error: error.message });
      }

      forecast(longitude, latitude, (error, forecastData) => {
        if (error) {
          return res.json({ error: error.message });
        }

        res.json({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Utkarsh',
    errorMessage: 'Page not found.',
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
