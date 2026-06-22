const { Country } = require('country-state-city');
const c = Country.getAllCountries()[0];
console.log(Object.keys(c));
console.log(c);
// Find a few to see region
const france = Country.getCountryByCode('FR');
console.log(france);
