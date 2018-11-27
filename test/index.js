var chai = require('chai');
var Mocha = require('Mocha');
const mocha = new Mocha();
var expect = chai.expect;
var loader = require('../module_loader.js');

mocha.run(() => {
  describe('test module_loader fake1', () => {
    describe('test empty config by await', () => {
      it('result will be empty object', async () => {
        //make an empty config
        let configs = {
          orders: {
            config: ['fake_config'],
            util: ['fake_lib'],
            init: ['fake_db'],
            worker: ['fake_worker']
          },
          path: 'test/fake1'
        };
        my_loader = new loader(configs);
        let result = await my_loader.load();
        expect(result).to.eql({});
      });
    });

    describe('test empty config notified by event', () => {
      it('result will be empty object', done => {
        let configs = {
          orders: {
            config: ['fake_config'],
            util: ['fake_lib'],
            init: ['fake_db'],
            worker: ['fake_worker']
          },
          path: 'test/fake1'
        };
        my_loader = new loader(configs);
        //listen event before load
        my_loader.on('ok', result => {
          expect(result).to.eql({});
          done();
        });
        my_loader.load();
      });
    });

    describe('test error config1', () => {
      it('result will be empty object', async () => {
        //make a fake json
        my_loader = new loader('fake');
        let result = await my_loader.load();
        expect(result).to.eql({});
      });
    });

    describe('test error config2', () => {
      it('result will be empty object', async () => {
        let configs = {
          orders: {
            config: ['fake'],
            util: ['fake'],
            init: ['fake'],
            worker: ['fake']
          },
          path: 'test/fake1'
        };
        my_loader = new loader(configs);
        let result = await my_loader.load();
        expect(result).to.eql({});
      });
    });
  });

  describe('test module_loader fake2', () => {
    describe('normal test', () => {
      it('config module,util module and worker module will work well', async () => {
        //make a new config
        let configs = {
          orders: {
            config: ['db'],
            util: ['get_even_number'],
            init: ['db'],
            worker: ['db']
          },
          path: 'test/fake2'
        };
        my_loader = new loader(configs);
        let result = await my_loader.load();
        expect(result.db(2)).to.eql(true);
      });
    });

    describe('normal test', () => {
      it(' init module will work well', async () => {
        //make a new config
        let configs = {
          orders: {
            config: ['db'],
            util: ['get_even_number'],
            init: ['db'],
            worker: ['db']
          },
          path: 'test/fake2'
        };
        my_loader = new loader(configs);
        let result = await my_loader.load();
        expect(result.db(1)).to.eql('fake');
      });
    });
  });
});
