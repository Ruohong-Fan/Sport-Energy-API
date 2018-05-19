var MongoClient = require('mongodb').MongoClient,
  url = "mongodb://localhost:27017/";

exports.read_sportEnergyAccount = function(req, res) {
  //Search by name and profile
  if (req.query.cardNumber) {
    console.log('Read sport energy account by card number');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("sportEnergyDB");
      var whereStr = {'cardNumber':req.query.cardNumber};
      dbo.collection("sportEnergyAccount").find(whereStr).toArray(function(err, sportEnergyAccount) {
        if (err) throw err;
        res.json(sportEnergyAccount);
        db.close();
      });
    });
  }
  //List all
  else {
    console.log('Read all sport energy account');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("sportEnergyDB");
      dbo.collection("sportEnergyAccount").find({}).toArray(function(err, sportEnergyAccount) {
        if (err) throw err;
        res.json(sportEnergyAccount);
        db.close();
      });
    });
  }
};

exports.create_sportEnergyAccount = function(req, res) {
  console.log('Create sport energy account');
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db('sportEnergyDB');
    var myobj = {'cardNumber':req.body.cardNumber, 'energyBalance': 0};
    console.log(myobj);
    dbo.collection('sportEnergyAccount').insert(myobj, function(err, sportEnergyAccount) {
        if (err) throw err;
        res.json(sportEnergyAccount);
        db.close();
    });
  });
};

exports.delete_sportEnergyAccount = function(req, res) {
  if (req.query.cardNumber) {
    console.log('Delete sport energy account by card number');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("sportEnergyDB");
      var whereStr = {'cardNumber':req.query.cardNumber};
      dbo.collection('sportEnergyAccount').deleteOne(whereStr, function(err, sportEnergyAccount) {
        if (err) throw err;
        res.json(sportEnergyAccount);
        db.close();
      });
    });
  }
  else {
    res.json({Message: 'Please provide necessary information to remove sport energy account.'})
  }
};

exports.update_sportEnergyAccount = function(req, res) {
  if (req.query.cardNumber) {
    console.log('Update sport energy account by card number');
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db('sportEnergyDB');
    var whereStr = {'cardNumber':req.query.cardNumber};
    var updateStr = {$set:req.body};
    dbo.collection('sportEnergyAccount').updateOne(whereStr, updateStr, function(err, sportEnergyAccount) {
        if (err) throw err;
        res.json(sportEnergyAccount);
        db.close();
    });
});
  }
  else {
    res.json({Message: 'Please provide necessary information to update sport leader.'})
  }
};