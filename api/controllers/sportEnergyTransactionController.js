const { Pool, Client } = require('pg');
var request = require('request');
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
          res.send(err.stack)
        } 
        else {
          if (sportEnergyTransaction.rows[0]) {
            data1 = sportEnergyTransaction.rows;
            var i = 0;
            var transaction_detail = new Array(data1.length);
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
              "message": "Read data successfully.",
              "entity": "sportEnergyTransactionController",
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
                  "card_number": data1[0].card_number,
                  transaction_detail
                },
              ]
            })
          }
          else {
            res.json({
              "code": "401",
              "message": "This transaction id does not exist.",
              "entity": "sportEnergyTransactionController"
            })
          }
        }
      })
    });
  }
  //Search by point account
  else if (req.query.pointAccountId) {
    pool.connect((err, client, done) => {
      if (err) throw err
      const text = 'select * from sport_energy_transaction where point_account_id = $1;'
      const values = [req.query.pointAccountId];
      client.query(text, values, (err, sportEnergyTransaction) => {
        done()
        if (err) {
          res.send(err.stack)
        } 
        else {
          if (sportEnergyTransaction.rows[0]) {
            data1 = sportEnergyTransaction.rows;
            res.json({
              "code": "200",
              "message": "Read data successfully.",
              "entity": "sportEnergyTransactionController",
              data1
            })
          }
          else {
            res.json({
              "code": "401",
              "message": "This account id does not have related energy point transactions.",
              "entity": "sportEnergyTransactionController"
            })
          }
        }
      })
    });
  }
  //Search by card number
  else if (req.query.cardNumber) {
    pool.connect((err, client, done) => {
      if (err) throw err
      const text = 'select * from sport_energy_transaction where card_number = $1;'
      const values = [req.query.cardNumber];
      client.query(text, values, (err, sportEnergyTransaction) => {
        done()
        if (err) {
          res.send(err.stack)
        } 
        else {
          if (sportEnergyTransaction.rows[0]) {
            data1 = sportEnergyTransaction.rows;
            res.json({
              "code": "200",
              "message": "Read data successfully.",
              "entity": "sportEnergyTransactionController",
              data1
            })
          }
          else {
            res.json({
              "code": "401",
              "message": "This card number does not have related energy point transactions.",
              "entity": "sportEnergyTransactionController"
            })
          }
        }
      })
    });
  }
  //Other query params
  else {
    res.json({
      "code": "400",
      "message": "1 of the 3 parameters must provided to get correct information: pointTransactionId, pointAccountId or cardNumber.",
      "entity": "sportEnergyTransactionController"
    });
  }
};

exports.create_sportEnergyTransaction = function(req, res) {
  if (req.body.cardNumber && req.body.pointChange && req.body.eventId && req.body.operator && req.body.expireTime && req.body.externalId && req.body.transactionDetail) {
    pool.connect((err, client, done) => {
      const shouldAbort = (err) => {
        if (err) {
          console.error('Error in transaction', err.stack)
          client.query('ROLLBACK', (err) => {
            if (err) {
              console.error('Error rolling back client', err.stack)
            }
            // release the client back to the pool
            done()
          })
        }
        return !!err
      }
      client.query('select point_account_id, point_balance from sport_energy_account where card_number = $1;', [req.body.cardNumber], (err, res1) => {
        if (shouldAbort(err)) return;
        if (res1.rows.length == 0) {
          var options = { 
            method: 'POST',
            url: '/api/v1/sportEnergyAccount/',
            headers: 
             { 'cache-control': 'no-cache',
               'content-type': 'application/json' },
            body: { cardNumber: req.body.cardNumber, operator: req.body.operator },
            json: true 
          };
          request(options, function (error, response, body) {
            if (error) throw new Error(error);
            const text1 = 'insert into sport_energy_transaction VALUES (DEFAULT, $1, $2, null, $3, $4, now(), null, null, $5, $6, $7) RETURNING point_transaction_id;'
            const values1 = [body.data[0].point_account_id, req.body.pointChange, req.body.eventId, req.body.operator, req.body.expireTime, req.body.externalId, req.body.cardNumber]
            client.query(text1, values1, (err, res2) => {
              if (shouldAbort(err)) return
              var i = 0;
              const text2 = 'insert into sport_energy_transaction_detail VALUES ($1, $2, $3, $4, $5, null);'
              while (i < req.body.transactionDetail.length) {
                values2 = [res2.rows[0].point_transaction_id, req.body.transactionDetail[i].itemCode, req.body.transactionDetail[i].lineNumber, req.body.transactionDetail[i].quantity, req.body.transactionDetail[i].pointChangeItem];
                client.query(text2, values2, (err) => {
                  if (err) {
                    console.error('Error committing transaction', err.stack)
                  }
                  done()
                })
                i++;
              }
              client.query('update sport_energy_account set point_balance = $1 where card_number = $2;', [body.data[0].point_balance+req.body.pointChange, req.body.cardNumber], (err) => {
                if (shouldAbort(err)) return;
                done()
              })
              res.json({
                "code": "200",
                "message": "Transaction created successfully.",
                "entity": "sportEnergyTransactionController"
              })
              done()
            })
          });
        }
        else if (res1.rows.length > 0) {
          const text1 = 'insert into sport_energy_transaction VALUES (DEFAULT, $1, $2, null, $3, $4, now(), null, null, $5, $6, $7) RETURNING point_transaction_id;'
          const values1 = [res1.rows[0].point_account_id, req.body.pointChange, req.body.eventId, req.body.operator, req.body.expireTime, req.body.externalId, req.body.cardNumber]
          client.query(text1, values1, (err, res2) => {
            if (shouldAbort(err)) return
            var i = 0;
            const text2 = 'insert into sport_energy_transaction_detail VALUES ($1, $2, $3, $4, $5, null);'
            while (i < req.body.transactionDetail.length) {
              values2 = [res2.rows[0].point_transaction_id, req.body.transactionDetail[i].itemCode, req.body.transactionDetail[i].lineNumber, req.body.transactionDetail[i].quantity, req.body.transactionDetail[i].pointChangeItem];
              client.query(text2, values2, (err) => {
                if (err) {
                  console.error('Error committing transaction', err.stack)
                }
                done()
              })
              i++;
            }
            client.query('update sport_energy_account set point_balance = $1 where card_number = $2;', [res1.rows[0].point_balance+req.body.pointChange, req.body.cardNumber], (err) => {
              if (shouldAbort(err)) return;
              done()
            })
            res.json({
              "code": "200",
              "message": "Transaction created successfully.",
              "entity": "sportEnergyTransactionController"
            })
            done()
          })
        }
      })
    });
  }
  else {
    res.json({
      "code": "400",
      "message": "Information not sufficient, no transaction created.",
      "entity": "sportEnergyTransactionController"
    })
  }
};
