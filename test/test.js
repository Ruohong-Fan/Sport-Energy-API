var app = require('../app');
var request = require('supertest')(app);
var should = require("should"); 

describe('sportEnergyAccount/test.js', function() {

	describe('GET method', function(){
		it('case 1 : should search by card number when card number exists', function(done){
			request.get('/sportEnergyAccount/api/v1/')
            .query({ cardNumber: '1122' })
            .expect(200, function(err, res) {
            	res.text.should.containEql('cardNumber');
                should.not.exist(err);
                done();
            });
		});
		it('case 2 : should return empty set [] when card number doesn\'t exist', function(done){
			request.get('/sportEnergyAccount/api/v1/')
            .query({ cardNumber: '2090537712048' })
            .expect(200, function(err, res) {
            	res.text.should.equal('[]');
                should.not.exist(err);
                done();
            });
		});
		it('case 3 : should return fail message when wrong query params are provided', function(done){
			request.get('/sportEnergyAccount/api/v1/')
            .query({ cardNumberr: '2090537712048' })
            .expect(200, function(err, res) {
            	res.text.should.containEql('Not right information to read sport energy account.');
                done();
            });
		});
	});

})

