import { Alert } from 'react-native';

export function fetchRoute(
    origin,
    destination,
    apikey,
    mode = "DRIVING",
    language = "en",
  ) {
    // Define the URL to call. Only add default parameters to the URL if it's a string.
    let url = "https://maps.googleapis.com/maps/api/directions/json";
    url += `?origin=${origin}&destination=${destination}&key=${apikey}&mode=${mode.toLowerCase()}&language=${language}&departure_time=now`;
    console.log('url : ', url)
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.status !== "OK") {
          const errorMessage = json.error_message || "Unknown error";
          return Promise.reject(errorMessage);
        }
        if (json.routes.length) {
          const route = json.routes[0];
          return Promise.resolve({
            nextStep: route.legs[0].steps[0]
          });
        } else {
          return Promise.reject();
        }
      })
      .catch(err => {
        console.log('Google MAP SDK Error: ', err)
      });
  }