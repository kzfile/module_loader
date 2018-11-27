# Module loader

Automatic loads modules in specially appointed configs and locations.

Somebody says that convention is greater than configuration,so I make some strict conventions to make my projects normalized and easy to extend.

## Install

```
npm i kz_loader -S
```

## Test

```
npm test
```

## Usage

you should prepare your modules in folders like below:

```
├─config
│      db.json
│      get_even_number.json
│
├─init
│      db.js
│
├─util
│      get_even_number.js
│
└─worker
        db.js
```

the modules in folder 'config' should be json files,and module in other folders should be js file.

a json file should be like this:

confA.json

```json
{
  "some_propertise": "some_content"
}
```

a js file will be like this:
module_A.js

```javascript
module.exports = async (module_name, config, g) => {
  //module_name is the module's filename,here the name is 'module_A'

  //config is all configs  of this application,you can get this by using config['some_propertise'],this will return 'some_content'

  //g is a global variable,you can set anything you want here

  //if you return something,you will get it after load
  return;
};
```

then you should prepare the config of these modules:

```javascript
const loader = require('module_loader');

//orders is the loading order of each type modules,modules not in this array won't load

//path point out the run folder,default for current foler
let configs = {
  orders: {
    config: ['db', 'redis'],
    util: ['get_even_number'],
    init: ['db', 'redis'],
    worker: ['db']
  },
  path: 'test/fake2'
};
my_loader = new loader(configs);

//you can get you want if you return something in module
let result = await my_loader.load();

//you can also get notified by event
/*
my_loader.on('ok', result => {
    ...
});
my_loader.load();
*/
```

> you can find the detail usage in test folder
