module.exports = async (module_name, config, g) => {
  g['get_info_from_db'] = await sleep(
    1000,
    //a fake db func that return an info if given any word
    message => config['db'].info
  );
};

const sleep = (timeountMS, func) =>
  new Promise(resolve => {
    setTimeout(resolve(func), timeountMS);
  });
