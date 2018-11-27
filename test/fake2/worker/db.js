module.exports = (module_name, config, g) => info => {
  if (info == g.get_even_number()) return true;
  else return g.get_info_from_db();
};
