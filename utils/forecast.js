const axios = require('axios');

exports.forecast = async (longitude, latitude, callback) => {
  try {
    const { data } = await axios({
      method: 'get',
      url: 'http://api.weatherapi.com/v1/current.json',
      params: {
        key: `${process.env.WEATHERAPI_KEY}`,
        q: `${latitude},${longitude}`,
      },
    });
    callback(
      null,
      `${data.current.condition.text}. It is currently ${data.current.temp_c} °C out. There is ${data.current.precip_mm} mm precipitation. Wind speed is ${data.current.wind_kph} km/h in ${data.current.wind_dir} direction.`
    );
  } catch (error) {
    if (!error.response)
      callback(new Error('Unable to connect to weather service!'));
    else callback(new Error(error.response.data.error.message));
  }
};
