var app = require('../app');
var request = require('supertest')(app);
var should = require("should"); 

describe('test sportEnergyAccount', function() {

	describe('GET method', function(){
		it('case 0 : no query parameter, return all energy account', function(done){
			request.get('/sportEnergyAccount/api/v1/')
            .query({})
            .expect(200, function(err, res) {
            	res.text.should.containEql('cardNumber');
                should.not.exist(err);
                done();
            });
		});
		it('case 1 : search by existent card number, return valid result', function(done){
			request.get('/sportEnergyAccount/api/v1/')
            .query({ cardNumber: '1122' })
            .expect(200, function(err, res) {
            	should.equal(res.body[0].cardNumber, '1122');
                should.not.exist(err);
                done();
            });
		});
		it('case 2 : search by non-existent card number, return []', function(done){
			request.get('/sportEnergyAccount/api/v1/')
            .query({ cardNumber: '2090537712048' })
            .expect(200, function(err, res) {
            	should.equal(res.text, '[]');
                should.not.exist(err);
                done();
            });
		});
		it('case 3 : search by existent id, return valid result', function(done){
			request.get('/sportEnergyAccount/api/v1/')
            .query({ _id: '5b1bc2bbd2fc771c5e93c580' })
            .expect(200, function(err, res) {
            	should.equal(res.body[0]._id, '5b1bc2bbd2fc771c5e93c580');
                should.not.exist(err);
                done();
            });
		});
		it('case 4 : search by non-existent id, return []', function(done){
			request.get('/sportEnergyAccount/api/v1/')
            .query({ _id: '5b01364c9799756b73a46381' })
            .expect(200, function(err, res) {
            	should.equal(res.text, '[]');
                should.not.exist(err);
                done();
            });
		});
		it('case 5 : no correct query parameter, return failed message', function(done){
			request.get('/sportEnergyAccount/api/v1/')
            .query({ cardNumberr: '2090537712048' })
            .expect(200, function(err, res) {
            	res.text.should.containEql('Not right information to read sport energy account.');
                done();
            });
		});
	});

	describe('POST method', function(){
		it('case 0 : provide valid card number and operator, return success', function(done){
			request.post('/sportEnergyAccount/api/v1/')
            .send({cardNumber: '2090537712048', operator: 'RFAN27'})
            .expect(200, function(err, res) {
            	var accountId = res.body.ops[0]._id;
            	should.equal(res.body.result.ok, 1);
                should.not.exist(err);
                done();
            });
		});
		it('case 1 : provide existent card number, return failed message', function(done){
			request.post('/sportEnergyAccount/api/v1/')
            .send({cardNumber: '2090537712048', operator: 'RFAN27'})
            .expect(200, function(err, res) {
            	res.text.should.containEql('This card number already has an energy account.');
                should.not.exist(err);
                done();
            });
		});
		it('case 2 : no card number provided, return failed message', function(done){
			request.post('/sportEnergyAccount/api/v1/')
            .send({operator: 'RFAN27'})
            .expect(200, function(err, res) {
            	res.text.should.containEql('Not sufficient information to create sport energy account.');
                should.not.exist(err);
                done();
            });
		});
		it('case 3 : no operator provided, return failed message', function(done){
			request.post('/sportEnergyAccount/api/v1/')
            .send({cardNumber: '2090537712048'})
            .expect(200, function(err, res) {
            	res.text.should.containEql('Not sufficient information to create sport energy account.');
                should.not.exist(err);
                done();
            });
		});
	});

	describe('DELETE method', function(){
		it('case 0 : provide existent card number, delete linked energy account', function(done){
			request.delete('/sportEnergyAccount/api/v1/')
            .query({cardNumber: '2090537712048'})
            .expect(200, function(err, res) {
            	should.equal(res.body.ok, 1);
                should.not.exist(err);
                done();
            });
		});
	});

	describe('PUT method', function(){
	});
});



describe('test sportEnergyTransaction', function() {

	describe('GET method', function(){
		it('case 0 : search by existent card number, return valid result', function(done){
			request.get('/sportEnergyTransaction/api/v1/')
            .query({ cardNumber: '1111' })
            .expect(200, function(err, res) {
            	should.equal(res.body[0].cardNumber, '1111');
                should.not.exist(err);
                done();
            });
		});
		it('case 1 : search by non-existent card number, return []', function(done){
			request.get('/sportEnergyTransaction/api/v1/')
            .query({ cardNumber: '2090537712048' })
            .expect(200, function(err, res) {
            	should.equal(res.text, '[]');
                should.not.exist(err);
                done();
            });
		});
		it('case 2 : search by existent transaction id, return valid result', function(done){
			request.get('/sportEnergyTransaction/api/v1/')
            .query({ _id: '5b1b735b00efcd1a1409d6cf' })
            .expect(200, function(err, res) {
            	should.equal(res.body[0]._id, '5b1b735b00efcd1a1409d6cf');
                should.not.exist(err);
                done();
            });
		});
		it('case 3 : search by non-existent transaction id, return []', function(done){
			request.get('/sportEnergyTransaction/api/v1/')
            .query({ _id: '5b01364c9799756b73a46381' })
            .expect(200, function(err, res) {
            	should.equal(res.text, '[]');
                should.not.exist(err);
                done();
            });
		});
		it('case 4 : no correct query parameter, return failed message', function(done){
			request.get('/sportEnergyTransaction/api/v1/')
            .query({ cardNumberr: '2090537712048' })
            .expect(200, function(err, res) {
            	res.text.should.containEql('Not right information to read sport energy transaction.');
                done();
            });
		});
	});

	describe('POST method', function(){
		it('case 0 : provide valid card number, energy update value and operator, return success', function(done){
			request.post('/sportEnergyTransaction/api/v1/')
            .send({cardNumber: '1122', energyUpdate: '200', operator: 'RFAN27'})
            .expect(200, function(err, res) {
            	var accountId = res.body.ops[0]._id;
            	should.equal(res.body.result.ok, 1);
                should.not.exist(err);
                done();
            });
		});
		it('case 1 : provide non-existent card number, return failed message', function(done){
			request.post('/sportEnergyTransaction/api/v1/')
            .send({cardNumber: '2090537712048', energyUpdate: '200', operator: 'RFAN27'})
            .expect(200, function(err, res) {
            	res.text.should.containEql('The card number doesn\'t exist!');
                should.not.exist(err);
                done();
            });
		});
		it('case 2 : no sufficient information provided, return failed message', function(done){
			request.post('/sportEnergyTransaction/api/v1/')
            .send({operator: 'RFAN27'})
            .expect(200, function(err, res) {
            	res.text.should.containEql('Not sufficient information to create sport energy transaction.');
                should.not.exist(err);
                done();
            });
		});
	});

	// describe('DELETE method', function(){
	// 	it('case 0 : provide existent card number, delete linked energy account', function(done){
	// 		request.delete('/sportEnergyAccount/api/v1/')
 //            .query({cardNumber: '2090537712048'})
 //            .expect(200, function(err, res) {
 //            	should.equal(res.body.ok, 1);
 //                should.not.exist(err);
 //                done();
 //            });
	// 	});
	// });

})
