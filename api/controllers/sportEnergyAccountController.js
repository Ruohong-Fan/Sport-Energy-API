var MongoClient = require('mongodb').MongoClient,
  ObjectID = require('mongodb').ObjectID,
  url = 'mongodb://localhost:27017/';

exports.read_sportEnergyAccount = function(req, res) {
  //If there is no query params, list all
  if (!req.query) {
    console.log('Read all sport energy account');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('sportEnergyDB');
      dbo.collection('sportEnergyAccount').find({}).toArray(function(err, sportEnergyAccount) {
        if (err) throw err;
        res.json(sportEnergyAccount);
        db.close();
      });
    });
  }
  //Search by account id
  else if (req.query._id) {
    console.log('Read sport energy account by card number');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('sportEnergyDB');
      var whereStr = {'_id':ObjectID(req.query._id)};
      dbo.collection('sportEnergyAccount').find(whereStr).toArray(function(err, sportEnergyAccount) {
        if (err) throw err;
        res.json(sportEnergyAccount);
        db.close();
      });
    });
  }
  //Search by card number
  else if (req.query.cardNumber) {
    console.log('Read sport energy account by card number');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('sportEnergyDB');
      var whereStr = {'cardNumber':req.query.cardNumber};
      dbo.collection('sportEnergyAccount').find(whereStr).toArray(function(err, sportEnergyAccount) {
        if (err) throw err;
        res.json(sportEnergyAccount);
        db.close();
      });
    });
  }
  //Other query params
  else {
    res.json({Message: 'Not right information to read sport energy account.'});
  }
};

exports.create_sportEnergyAccount = function(req, res) {
  //Create account only when card number and operator are both provided
  if (req.body.cardNumber && req.body.operator) {
    console.log('Create sport energy account');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('sportEnergyDB');
      var myDate = new Date();
      var myobj = {'cardNumber':req.body.cardNumber, 'energyBalance': 0, 'accountStatus': 'valid',
        'createTime':myDate.toLocaleString( ), 'updateTime':myDate.toLocaleString( ), 
        'createBy':req.body.operator, 'updateBy':req.body.operator};
      dbo.collection('sportEnergyAccount').insert(myobj, function(err, sportEnergyAccount) {
          if (err) throw err;
          res.json(sportEnergyAccount);
          db.close();
      });
    });
  }
  //Otherwise, no account will be created
  else {
    res.json({Message: 'Not sufficient information to create sport energy account.'});
  }
};

exports.delete_sportEnergyAccount = function(req, res) {
  //Delete by account id
  if (req.query._id) {
    console.log('Delete sport energy account by card number');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('sportEnergyDB');
      var whereStr = {'_id':ObjectID(req.query._id)};
      dbo.collection('sportEnergyAccount').deleteOne(whereStr, function(err, sportEnergyAccount) {
        if (err) throw err;
        res.json(sportEnergyAccount);
        db.close();
      });
    });
  }
  //Otherwise, no account will be deleted
  else {
    res.json({Message: 'Please provide necessary information to remove sport energy account.'})
  }
};

exports.update_sportEnergyAccount = function(req, res) {
  //Update by account id
  if (req.query._id) {
    console.log('Update sport energy account by card number');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('sportEnergyDB');
      var myDate = new Date();
      var whereStr = {'_id':ObjectID(req.query._id)};
      var updateStr = {$set:{'cardNumber':req.body.cardNumber, 'energyBalance':Number(req.body.energyBalance), 'accountStatus':req.body.accountStatus, 'updateTime':myDate.toLocaleString( ), 'updateBy':req.body.operator}};
      dbo.collection('sportEnergyAccount').updateOne(whereStr, updateStr, function(err, sportEnergyAccount) {
          if (err) throw err;
          res.json(sportEnergyAccount);
          db.close();
      });
    });
  }
  //Otherwise, no account will be deleted
  else {
    res.json({Message: 'Please provide necessary information to update sport energy account.'})
  }
};