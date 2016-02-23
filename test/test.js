var expect = require("chai").expect;
var request = require("request");

var url = "http://localhost:4000";

describe("AirFlow", function () {
	describe("Server", function() {
		it("should respond OK", function(done) {
			request.get(url, function(error, response, body) {
	        	expect(response.statusCode).to.be.equal(200);
	        	done();
	     	});
		});
	});
});
