var MongoClient = require('mongodb').MongoClient,
  url = "mongodb://localhost:27017/";

exports.read_sportEnergyTransaction = function(req, res) {
  //Search by name and profile
  if (req.query.name && req.query.profile) {
    console.log('Read sport leader by name & profile');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("sportLeaderDB");
      var whereStr = {'name':req.query.name, 'profile':req.query.profile};
      dbo.collection("sportLeader").find(whereStr).toArray(function(err, sportLeader) {
        if (err) throw err;
        res.json(sportLeader);
        db.close();
      });
    });
  }
  //Search by name
  else if (req.query.name) {
    console.log('Read sport leader by name')
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("sportLeaderDB");
      var whereStr = {'name':req.query.name};
      dbo.collection("sportLeader").find(whereStr).toArray(function(err, sportLeader) {
        if (err) throw err;
        res.json(sportLeader);
        db.close();
      });
    });
  }
  //Search by profile
  else if (req.query.profile) {
    console.log('Read sport leader by profile')
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("sportLeaderDB");
      var whereStr = {'profile':req.query.profile};
      dbo.collection("sportLeader").find(whereStr).toArray(function(err, sportLeader) {
        if (err) throw err;
        res.json(sportLeader);
        db.close();
      });
    });
  }
  //List all
  else {
    console.log('Read all sport leaders');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("sportLeaderDB");
      dbo.collection("sportLeader").find({}).toArray(function(err, sportLeader) {
        if (err) throw err;
        res.json(sportLeader);
        db.close();
      });
    });
  }
};

exports.create_sportEnergyTransaction = function(req, res) {
  console.log('Create sport leader');
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db('sportLeaderDB');
    var myobj = req.body;
    dbo.collection('sportLeader').insert(myobj, function(err, sportLeader) {
        if (err) throw err;
        res.json({Message: 'Create sport leader successfully'});
        db.close();
    });
  });
};

exports.delete_sportEnergyTransaction = function(req, res) {
  if (req.query.profile) {
    console.log('Delete sport leader by profile');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("sportLeaderDB");
      var whereStr = {'profile':req.query.profile};
      dbo.collection('sportLeader').deleteOne(whereStr, function(err, sportLeader) {
        if (err) throw err;
        res.json({Message: 'Delete sport leader by profile successfully'});
        db.close();
      });
    });
  }
  else {
    res.json({Message: 'Please provide necessary information to remove sport leader.'})
  }
};

exports.update_sportEnergyTransaction = function(req, res) {
  if (req.query.profile) {
    console.log('Update sport leader by profile');
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db('sportLeaderDB');
    var whereStr = {'profile':req.query.profile};
    var updateStr = {$set:req.body};
    dbo.collection('sportLeader').updateOne(whereStr, updateStr, function(err, sportLeader) {
        if (err) throw err;
        res.json(sportLeader);
        db.close();
    });
});
  }
  else {
    res.json({Message: 'Please provide necessary information to update sport leader.'})
  }
};