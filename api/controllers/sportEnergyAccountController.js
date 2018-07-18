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

exports.read_sportEnergyAccount = function(req, res) {
  //If there is no query params, list all
  if (JSON.stringify(req.query) == '{}') {
    pool.connect((err, client, done) => {
      if (err) throw err
      const text = 'select * from sport_energy_account;'
      client.query(text, (err, sportEnergyAccount) => {
        done()
        if (err) {
          console.log(err.stack)
        } 
        else {
          data = sportEnergyAccount.rows;
          res.json({
            "code": "200",
            "message": "Success",
            "entity": "",
            data
          })
        }
      })
    });
  }

  //Search by account id
  else if (req.query.pointAccountId) {
    pool.connect((err, client, done) => {
      if (err) throw err
      const text = 'select * from sport_energy_account where point_account_id = $1;'
      const values = [req.query.pointAccountId];
      client.query(text, values, (err, sportEnergyAccount) => {
        done()
        if (err) {
          console.log(err.stack)
        } 
        else {
          data = sportEnergyAccount.rows;
          res.json({
            "code": "200",
            "message": "Success",
            "entity": "",
            data
          })
        }
      })
    });
  }

  //Search by card number
  else if (req.query.cardNumber) {
    pool.connect((err, client, done) => {
      if (err) throw err
      const text = 'select * from sport_energy_account where card_number = $1;'
      const values = [req.query.cardNumber];
      client.query(text, values, (err, sportEnergyAccount) => {
        done()
        if (err) {
          console.log(err.stack)
        } 
        else {
          data = sportEnergyAccount.rows;
          res.json({
            "code": "200",
            "message": "Success",
            "entity": "",
            data
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

exports.create_sportEnergyAccount = function(req, res) {
  //Create account only when card number and operator are both provided
  if (req.body.cardNumber && req.body.operator) {
    pool.connect((err, client, done) => {
      if (err) throw err;
      const text = 'insert into sport_energy_account values (DEFAULT, $1, 0, $2, now(), null);'
      const values = [req.body.cardNumber, req.body.operator];
      client.query(text, values, (err, sportEnergyAccount) => {
        done()
        if (err) {
          console.log(err.stack)
        } 
        else {
          data = sportEnergyAccount;
          res.send({
            "code": "200",
            "message": "success",
            "entity": "",
            data
          });
        }
      })
    });
  }
  //Otherwise, no account will be created
  else {
    res.json({
      "code": "400",
      "message": "No sufficient information, data not found.",
      "entity": ""
    });
  }
};

exports.delete_sportEnergyAccount = function(req, res) {
  //Delete by account id
  if (req.query.pointAccountId) {
    pool.connect((err, client, done) => {
      if (err) throw err;
      const text = 'delete from sport_energy_account where point_account_id = $1;'
      const values = [req.query.pointAccountId];
      client.query(text, values, (err, sportEnergyAccount) => {
        done()
        if (err) {
          console.log(err)
        } 
        else {
          data = sportEnergyAccount;
          res.send({
            "code": "200",
            "message": "success",
            "entity": "",
            data
          });
        }
      })
    });
  }

  //Delete by card number
  else if (req.query.cardNumber) {
    pool.connect((err, client, done) => {
      if (err) throw err;
      const text = 'delete from sport_energy_account where card_number = $1;'
      const values = [req.query.cardNumber];
      client.query(text, values, (err, sportEnergyAccount) => {
        done()
        if (err) {
          console.log(err)
        } 
        else {
          data = sportEnergyAccount;
          res.send({
            "code": "200",
            "message": "success",
            "entity": "",
            data
          });
        }
      })
    });
  }

  //Otherwise, no account will be deleted
  else {
    res.json({
      "code": "400",
      "message": "No sufficient information, data not found.",
      "entity": ""
    });
  }
};

exports.update_sportEnergyAccount = function(req, res) {
  //Update balance by account id
  if (req.query.pointAccountId && req.body.operator && req.body.pointBalance) {
    pool.connect((err, client, done) => {
      if (err) throw err;
      else {
        const text2 = 'update sport_energy_account set point_balance = $1, update_by = $2, update_time = now() where point_account_id = $3;'
        const values2 = [req.body.pointBalance, req.body.operator, req.query.pointAccountId]; 
        client.query(text2, values2, (err, sportEnergyAccount) => {
          done()
          if (err) {
            console.log(err)
          } 
          else {
            count = sportEnergyAccount.rowCount;
            data = sportEnergyAccount;
            if (count == 1) {
              res.send({
              "code": "200",
              "message": "success",
              "entity": "",
              data
              });
            }
            else if (count == 0) {
              res.send({
              "code": "404",
              "message": "Unable to find the point account id.",
              "entity": ""
              });
            }
          }
        })
      }
    })
  }
  //Otherwise, no account will be updated
  else {
    res.json({
      "code": "400",
      "message": "No sufficient information, data not found.",
      "entity": ""
    });
  }
};