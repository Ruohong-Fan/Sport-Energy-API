var MongoClient = require('mongodb').MongoClient,
  ObjectID = require('mongodb').ObjectID,
  url = 'mongodb://localhost:27017/';

exports.read_sportEnergyTransaction = function(req, res) {
  //List all
  if (JSON.stringify(req.query) == '{}') {
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
  //Search by transaction id
  else if (req.query._id) {
    console.log('Read sport energy transaction by transaction id');
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
  //Search by card number
  else if (req.query.cardNumber) {
    console.log('Read sport energy transaction by card number.');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('sportEnergyDB');
      var whereStr = {'cardNumber':req.query.cardNumber};
      dbo.collection('sportEnergyTransaction').find(whereStr).toArray(function(err, sportEnergyTransaction) {
        if (err) throw err;
        res.json(sportEnergyTransaction);
        db.close();
      });
    });
  }
  //Other query params
  else {
    console.log('Read sport energy transaction failed.');
    res.json({Message: 'Not right information to read sport energy transaction.'});
  }
};

exports.create_sportEnergyTransaction = function(req, res) {
  if (req.body.cardNumber && req.body.energyUpdate && req.body.operator) {
    console.log('Create sport energy transaction');
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db('sportEnergyDB');
      var whereStr = {'cardNumber':req.body.cardNumber};
      dbo.collection('sportEnergyAccount').find(whereStr).toArray(function(err, sportEnergyAccount_old) {
        if (err) throw err;
        else if (sportEnergyAccount_old[0]) {
          var myDate = new Date();
          // find & update current sport energy balance
          var updateStr = {$set:{'energyBalance':Number(req.body.energyUpdate)+Number(sportEnergyAccount_old[0].energyBalance), 
            'updateTime':myDate.toLocaleString( ), 'updateBy':req.body.operator}};
          dbo.collection('sportEnergyAccount').updateOne(whereStr, updateStr, function(err, sportEnergyAccount_new) {
            if (err) throw err;
            console.log(sportEnergyAccount_new);
            db.close();
          });
          // create sport energy transaction
          var myobj = {'cardNumber':req.body.cardNumber, 'energyUpdate':Number(req.body.energyUpdate), 
            'sportEnergyAccount_id':ObjectID(sportEnergyAccount_old[0]._id), 'createTime':myDate.toLocaleString( ), 
            'updateTime':myDate.toLocaleString( ), 'createBy':req.body.operator, 'updateBy':req.body.operator};
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
  }
  else {
    res.json({Message: 'Sport energy transaction creation failed.'})
  }
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