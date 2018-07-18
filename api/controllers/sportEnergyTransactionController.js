const { Pool, Client } = require('pg');
// clients will use environment variables
// for connection information
const pool = new Pool();
// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

exports.read_sportEnergyTransaction = function(req, res) {
  //Search by transaction id
  if (req.query.pointTransactionId) {
    pool.connect((err, client, done) => {
      if (err) throw err
      const text = 'select * from sport_energy_transaction a inner join sport_energy_transaction_detail b on a.point_transaction_id = b.point_transaction_id where a.point_transaction_id = $1;'
      const values = [req.query.pointTransactionId];
      client.query(text, values, (err, sportEnergyTransaction) => {
        done()
        if (err) {
          console.log(err.stack)
        } 
        else {
          data1 = sportEnergyTransaction.rows;
          var i = 0;
          var transaction_detail = new Array(data1.length);
          console.log(transaction_detail);
          while (i<data1.length) {
            transaction_detail[i] = {
              "item_code": data1[i].item_code,
              "line_number": data1[i].line_number,
              "quantity": data1[i].quantity,
              "point_change_item": data1[i].point_change_item
            };
            i++;
          }
          res.json({
            "code": "200",
            "message": "Success",
            "entity": "",
            "data": [
              {
                "point_transaction_id": data1[0].point_transaction_id,
                "point_account_id": data1[0].point_account_id,
                "point_change": data1[0].point_change,
                "point_status": data1[0].point_status,
                "event_id": data1[0].event_id,
                "create_by": data1[0].create_by,
                "create_time": data1[0].create_time,
                "update_by": data1[0].update_by,
                "update_time": data1[0].update_time,
                "expire_time": data1[0].expire_time,
                "external_id": data1[0].external_id,
                transaction_detail
              },
            ]
          })
        }
      })
    });
  }
  //Search by point account
  else if (req.query.pointAccountId) {
    pool.connect((err, client, done) => {
      if (err) throw err
      const text = 'select * from sport_energy_transaction a inner join sport_energy_transaction_detail b on a.point_transaction_id = b.point_transaction_id where a.point_account_id = $1;'
      const values = [req.query.pointAccountId];
      client.query(text, values, (err, sportEnergyTransaction) => {
        done()
        if (err) {
          console.log(err.stack)
        } 
        else {
          data1 = sportEnergyTransaction.rows;
          var i = 0;
          var transaction_detail = new Array(data1.length);
          console.log(transaction_detail);
          while (i<data1.length) {
            transaction_detail[i] = {
              "item_code": data1[i].item_code,
              "line_number": data1[i].line_number,
              "quantity": data1[i].quantity,
              "point_change_item": data1[i].point_change_item
            };
            i++;
          }
          res.json({
            "code": "200",
            "message": "Success",
            "entity": "",
            "data": [
              {
                "point_transaction_id": data1[0].point_transaction_id,
                "point_account_id": data1[0].point_account_id,
                "point_change": data1[0].point_change,
                "point_status": data1[0].point_status,
                "event_id": data1[0].event_id,
                "create_by": data1[0].create_by,
                "create_time": data1[0].create_time,
                "update_by": data1[0].update_by,
                "update_time": data1[0].update_time,
                "expire_time": data1[0].expire_time,
                "external_id": data1[0].external_id,
                transaction_detail
              },
            ]
          })
        }
      })
    });
  }
  //Other query params
  else {
    res.json({
      "code": "400",
      "message": "No sufficient information, data not found.",
      "entity": ""
    });
  }
};

exports.create_sportEnergyTransaction = function(req, res) {
  if (req.body.cardNumber && req.body.energyUpdate && req.body.operator) {
    // MongoClient.connect(url, function(err, db) {
    //   if (err) throw err;
    //   var dbo = db.db('sportEnergyDB');
    //   var whereStr = {'cardNumber':req.body.cardNumber};
    //   dbo.collection('sportEnergyAccount').find(whereStr).toArray(function(err, sportEnergyAccount_old) {
    //     if (err) throw err;
    //     else if (sportEnergyAccount_old[0]) {
    //       var myDate = new Date();
    //       // find & update current sport energy balance
    //       var updateStr = {$set:{'energyBalance':Number(req.body.energyUpdate)+Number(sportEnergyAccount_old[0].energyBalance), 
    //         'updateTime':myDate.toLocaleString( ), 'updateBy':req.body.operator}};
    //       dbo.collection('sportEnergyAccount').updateOne(whereStr, updateStr, function(err, sportEnergyAccount_new) {
    //         if (err) throw err;
    //         db.close();
    //       });
    //       // create sport energy transaction
    //       var myobj = {'cardNumber':req.body.cardNumber, 'energyUpdate':Number(req.body.energyUpdate), 
    //         'sportEnergyAccount_id':ObjectID(sportEnergyAccount_old[0]._id), 'createTime':myDate.toLocaleString( ), 
    //         'updateTime':myDate.toLocaleString( ), 'createBy':req.body.operator, 'updateBy':req.body.operator};
    //       dbo.collection('sportEnergyTransaction').insert(myobj, function(err, sportEnergyTransaction) {
    //         if (err) throw err;
    //         res.json(sportEnergyTransaction);
    //       });
    //     }
    //     else {
    //       res.json({Message: 'The card number doesn\'t exist!'})
    //       db.close();
    //     }
    //   });
    // });
  }
  else {
    res.json({Message: 'Not sufficient information to create sport energy transaction.'})
  }
};
