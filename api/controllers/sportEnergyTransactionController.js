var MongoClient = require('mongodb').MongoClient,
  url = 'mongodb://localhost:27017/';

exports.read_sportEnergyTransaction = function(req, res) {
  //Search by account id
  if (req.query._id) {
    console.log('Read sport energy transaction');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('sportEnergyDB');
      var whereStr = {'_id':ObjectID(req.query._id)};
      dbo.collection('sportEnergyTransaction').find(whereStr).toArray(function(err, sportEnergyTransaction) {
        if (err) throw err;
        res.json(sportEnergyTransaction);
        db.close();
      });
    });
  }
  //List all
  else if (!req.query) {
    console.log('Read all sport energy transactions');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('sportEnergyDB');
      dbo.collection('sportEnergyTransaction').find({}).toArray(function(err, sportEnergyTransaction) {
        if (err) throw err;
        res.json(sportEnergyTransaction);
        db.close();
      });
    });
  }
};

exports.create_sportEnergyTransaction = function(req, res) {
  console.log('Create sport energy transaction');
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db('sportEnergyDB');
    var whereStr = {'cardNumber':req.body.cardNumber};
    dbo.collection('sportEnergyAccount').find(whereStr).toArray(function(err, sportEnergyAccount_old) {
      if (err) throw err;
      else if (sportEnergyAccount_old[0]) {
        console.log(sportEnergyAccount_old);
        var myDate = new Date();
        // find & update current sport energy balance
        var updateStr = {$set:{'energyBalance':Number(req.body.energyUpdate)+Number(sportEnergyAccount_old[0].energyBalance), 'updateTime':myDate.toLocaleString( )}};
        dbo.collection('sportEnergyAccount').updateOne(whereStr, updateStr, function(err, sportEnergyAccount_new) {
          if (err) throw err;
          console.log(sportEnergyAccount_new);
          db.close();
        });
        // create sport energy transaction
        var myobj = {'cardNumber':req.body.cardNumber, 'energyUpdate': Number(req.body.energyUpdate), 'createTime':myDate.toLocaleString( ), 'updateTime':myDate.toLocaleString( )};
        dbo.collection('sportEnergyTransaction').insert(myobj, function(err, sportEnergyTransaction) {
          if (err) throw err;
          res.json(sportEnergyTransaction);
        });
      }
      else {
        res.json({Message: 'The card number doesn\'t exist!'})
        db.close();
      }
    });
  });
};

exports.delete_sportEnergyTransaction = function(req, res) {
  if (req.query.cardNumber) {
    console.log('Delete sport energy transaction by card number');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('sportEnergyDB');
      var whereStr = {'cardNumber':req.query.cardNumber};
      dbo.collection('sportEnergyTransaction').deleteOne(whereStr, function(err, sportEnergyTransaction) {
        if (err) throw err;
        res.json({Message: 'Delete sport energy account by card number successfully'});
        db.close();
      });
    });
  }
  else {
    res.json({Message: 'Please provide necessary information to remove sport leader.'})
  }
};

exports.update_sportEnergyTransaction = function(req, res) {
//   if (req.query.profile) {
//     console.log('Update sport leader by profile');
//     MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db('sportLeaderDB');
//     var whereStr = {'profile':req.query.profile};
//     var updateStr = {$set:req.body};
//     dbo.collection('sportLeader').updateOne(whereStr, updateStr, function(err, sportEnergyTransaction) {
//         if (err) throw err;
//         res.json(sportEnergyTransaction);
//         db.close();
//     });
// });
//   }
//   else {
//     res.json({Message: 'Please provide necessary information to update sport leader.'})
//   }
};