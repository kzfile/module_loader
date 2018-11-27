const { join, extname, basename } = require('path');
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;

let defualt = {
  path: '',
  g: {},
  error_handle: err => {},
  modules: ['init', 'util', 'worker'],
  config: {},
  orders: {},
  result: {}
};

class module_loader extends EventEmitter {
  constructor(configs = defualt) {
    super();
    //merge given config with given
    if (typeof configs !== 'object') configs = defualt;
    else configs = Object.assign(defualt, configs);
    merge_object(this, configs);
    this.path = join(process.cwd(), this.path);
  }

  async load() {
    this.all_module_path = this.modules.reduce(
      (prev, next) => ((prev[next] = join(this.path, next)), prev),
      {}
    );

    //load configs in folder
    let config_folder = join(this.path, 'config');
    if (fs.existsSync(config_folder)) {
      let configs = fs.readdirSync(config_folder);
      configs.forEach(config_name => {
        try {
          let config = require(join(this.path, 'config', config_name));
          if (extname(config_name) == '.json') {
            this.config[basename(config_name, '.json')] = config;
          }
        } catch (error) {
          this.error_handle(error);
        }
      });
    }
    await this.load_all_module();
    this.emit('ok', this.result);
    return this.result;
  }

  async load_all_module() {
    for (let module_type in this.all_module_path) {
      const each_module = this.all_module_path[module_type];
      if (!fs.existsSync(each_module)) continue;
      //load module in turns
      const order = this.orders[module_type];
      if (order)
        for (let module_name of order) {
          try {
            let content = require(join(this.path, module_type, module_name));
            let result = await content(module_name, this.config, this.g);
            if (result) this.result[module_name] = result;
          } catch (error) {
            this.error_handle(error);
          }
        }
    }
  }
}

//add or alter propertices of an object
function merge_object(target, source, overide = false) {
  Object.keys(source).forEach(element => {
    if (overide) target[element] = source[element];
    else target[element] = target[element] ? target[element] : source[element];
  });
}

module.exports = module_loader;
/*
let configs = {
  orders: {
    config: ['db'],
    util: ['get_even_number'],
    init: ['db'],
    worker: ['db']
  },
  path: 'test/fake2'
};

let ss = new module_loader(configs);
ss.on('ok', workers => {
  console.log(workers.db(2));
});
ss.load();
*/
