module.exports.index = function(req, res){
  res.render('index', {
    title: "index",
    msg: "Hello from index"
  });
};

module.exports.partials = function(req, res) {
  res.render('partials/'+req.params.name);
};
