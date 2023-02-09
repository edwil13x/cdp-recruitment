'use strict'

const cmdRegex = /^--filter=(.+)$/

/**
 * @param {Array<Country>} countries
 * @param {string} pattern
 * @returns {Array<Country>}
 */
function search(countries, pattern) {
  const matchCountries = [];
  countries.forEach(country => {
    const matchCountry = {
      name: country.name,
      people: []
    };
    country.people.forEach(person => {
      const matchAnimals = person.animals.filter(animal => animal.name.includes(pattern));
      if (matchAnimals.length > 0) {
        const matchPeople = {
          name: person.name,
          animals: matchAnimals
        };
        matchCountry.people.push(matchPeople);
      }
    });
    if (matchCountry.people.length > 0) {
      matchCountries.push(matchCountry)
    }
  });
  if (matchCountries.length > 0) {
    return matchCountries;
  }
}

/**
 * @param {Array<string>} args
 * @returns {boolean}
 */
function  isValidCmdLineArgs(args) {
  let valid = !!(args.length === 3 && args[2].match(cmdRegex))
  if (!valid) {
    console.log('Invalid command line');
    console.log('Usage: node app.js --filter=my-pattern');
  }
  return valid;
}

/**
 * @param {Array<Country>} data
 * @param {Array<string>} args
 */
function main(data, args) {
  if (isValidCmdLineArgs(args)) {
    const pattern = args[2].match(cmdRegex)[1];
    const matchCountries = search(data, pattern);
    if (matchCountries.length > 0) {
      console.log(JSON.stringify(matchCountries, null, 2));
    }
  }
}


/**
 * @typedef Animal
 * @property {string} name
 */

/**
 * @typedef People
 * @property {string} name
 * @property {Array<Animal>} animals
 */

/**
 * @typedef Country
 * @property {string} name
 * @property {Array<People>} people
 */


module.exports = {
  isValidCmdLineArgs,
  main,
  search
}
