const axios = require('axios');

exports.geocode = async (address, callback) => {
  try {
    const { data } = await axios({
      method: 'get',
      url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json`,
      params: {
        access_token: `${process.env.MAPBOX_ACCESS_TOKEN}`,
        limit: 1,
      },
    });

    if (data.features.length === 0) {
      return callback(
        new Error('Unable to find location. Try another search!')
      );
    }

    callback(null, {
      longitude: data.features[0].center[0],
      latitude: data.features[0].center[1],
      location: data.features[0].place_name,
    });
  } catch (error) {
    if (!error.response)
      callback(new Error('Unable to connect to geocoding service!'));
    else callback(new Error(error.response.data.message));
  }
};
