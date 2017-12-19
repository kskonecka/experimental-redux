var Cat = require('../models/Cat');

exports.catGet = function(req, res) {
  const cat = new Cat({
    name: 'Pat'
  })
  cat.save(function(err) {
    res.send('data saved');
  });
};
