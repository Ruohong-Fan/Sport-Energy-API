module.exports = function(app) {
  var sportLeaderAccount = require('../controllers/sportEnergyAccountController');
  var sportLeaderTransaction = require('../controllers/sportEnergyTransactionController');

  // sportLeaderAccount Routes
  app.route('/api/v1/sportEnergyAccount')
    .get(sportLeaderAccount.read_sportEnergyAccount)
    // .post(sportLeaderAccount.create_sportEnergyAccount)
    // .delete(sportLeaderAccount.delete_sportEnergyAccount)
    // .put(sportLeaderAccount.update_sportEnergyAccount);

  // sportLeaderTransaction Routes
  app.route('/api/v1/sportEnergyTransaction/')
    .get(sportLeaderTransaction.read_sportEnergyTransaction)
    .post(sportLeaderTransaction.create_sportEnergyTransaction)
    .delete(sportLeaderTransaction.delete_sportEnergyTransaction)
    .put(sportLeaderTransaction.update_sportEnergyTransaction);
};