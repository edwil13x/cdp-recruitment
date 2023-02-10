'use strict'

const {main, search, isValidCmdLineArgs} = require('../src/lib.js');

const invalidArgs = ['/bin/node', 'file/path'];
const validArgs = ['/bin/node', 'file/path', '--filter=idna'];

describe('app', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('checkCmdLine', () => {

    it('Missing command line option', () => {
      const log = jest.spyOn(console, 'log').mockImplementation(() => {});
      expect(isValidCmdLineArgs(invalidArgs)).toEqual(false);
      expect(log).toBeCalledWith('Invalid command line');
      expect(log).toBeCalledWith('Usage: node app.js --filter=my-pattern');
    });

    it('Unparseable command line option', () => {
      const log = jest.spyOn(console, 'log').mockImplementation(() => {});
      const invalid = '--filter';
      expect(isValidCmdLineArgs(invalidArgs.concat([invalid]))).toEqual(false);
      expect(log).toBeCalledWith('Invalid command line');
      expect(log).toBeCalledWith('Usage: node app.js --filter=my-pattern');
    });

    it('Too many command line options', () => {
      const log = jest.spyOn(console, 'log').mockImplementation(() => {});
      const invalid = '--filter';
      expect(isValidCmdLineArgs(invalidArgs.concat(['--filter=zzzz', invalid]))).toEqual(false);
      expect(log).toBeCalledWith('Invalid command line');
      expect(log).toBeCalledWith('Usage: node app.js --filter=my-pattern');
    });
  });

  describe('search', () => {
    const countries = [{
      name: 'Dillauti',
      people:
        [{
          name: 'Winifred Graham',
          animals:
            [{name: 'Anoa'},
              {name: 'Duck'},
              {name: 'Narwhal'},
              {name: 'Badger'},
              {name: 'Cobra'},
              {name: 'Crow'}]
        },
          {
            name: 'Blanche Viciani',
            animals:
              [{name: 'Barbet'},
                {name: 'Rhea'},
                {name: 'Snakes'},
                {name: 'Antelope'},
                {name: 'Echidna'},
                {name: 'Crow'},
                {name: 'Guinea Fowl'},
                {name: 'Deer Mouse'}]
          }]
    }];

    it('should return matching countries when match exists', () => {
      expect(search(countries, 'idna')).toEqual([{
        name: 'Dillauti',
        people: [{animals: [{name: 'Echidna'}], name: 'Blanche Viciani'}]
      }]);
    });

    it('should not return matching when no match exists', () => {
      expect(search(countries, 'manchester united')).toEqual(undefined);
    });
  });

  describe('main', () => {
    it('do nothing on invalid command line', () => {
      const log = jest.spyOn(console, 'log').mockImplementation(() => {});
      main([], invalidArgs);
      expect(log).toBeCalledWith('Invalid command line')
      expect(log).toBeCalledWith('Usage: node app.js --filter=my-pattern')
      expect(log.mock.calls.length).toEqual(2);
    });

    it('print result if match found', () => {
      const log = jest.spyOn(console, 'log').mockImplementation(() => {});
      const countries = [{
        name: 'Dillauti',
        people:
          [{
            name: 'Winifred Graham',
            animals:
              [{name: 'Anoa'},
                {name: 'Duck'},
                {name: 'Narwhal'},
                {name: 'Badger'},
                {name: 'Cobra'},
                {name: 'Crow'}]
          },
            {
              name: 'Blanche Viciani',
              animals:
                [{name: 'Barbet'},
                  {name: 'Rhea'},
                  {name: 'Snakes'},
                  {name: 'Antelope'},
                  {name: 'Echidna'},
                  {name: 'Crow'},
                  {name: 'Guinea Fowl'},
                  {name: 'Deer Mouse'}]
            }]
      }];
      main(countries, validArgs);
      expect(log).toBeCalledWith(JSON.stringify([{
        name: 'Dillauti',
        people: [{name: 'Blanche Viciani', animals: [{name: 'Echidna'}]}]
      }], null, 2));
      expect(log.mock.calls.length).toEqual(1);
    });
  });
})
