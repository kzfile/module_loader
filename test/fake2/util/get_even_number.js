module.exports = (module_name, config, g) => {
  g[module_name] = () => config['get_even_number'].number;
};
