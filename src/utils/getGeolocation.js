export default function (options) {
  options = Object.assign({
    enableHighAccuracy: false,
    maximumAge: 30000,
    timeout: 27000
  }, options || {});

  return new Promise((resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}