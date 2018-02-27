const data = {};

module.exports.list = () => {
  return Object.keys(data);
};

module.exports.get = (id) => {
  if (data[id] == null) return '';
  return data[id];
};

module.exports.put = (id, val) => {
  data[id] = val;
};

module.exports.post = (id, val) => {
  data[id] = val;
};

module.exports.delete = (id, val) => {
  data[id] = val;
};
