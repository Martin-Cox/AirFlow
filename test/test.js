var expect = require("chai").expect;
var request = require("request");

var baseURL = "http://localhost:4000";

describe("AirFlow", function () {
	describe("Server", function() {
		it("should respond OK", function(done) {
			request.get(baseURL, function(error, response, body) {
	        	expect(response.statusCode).to.be.equal(200);
	        	done();
	     	});
		});
		describe("Default Case", function() {
			it("should have defaultCase.json", function(done) {
				request.get(baseURL + "/json/defaultCase.json", function(error, response, body) {
		        	expect(response.statusCode).to.be.equal(200);
		        	done();
		     	});
			});
			it("should be a valid .json", function(done) {
				request.get(baseURL + "/json/defaultCase.json", function(error, response, body) {
		        	expect(body).to.be.json;
		        	done();
		     	});
			});
			it("should contain: materials", function(done) {
				request.get(baseURL + "/json/defaultCase.json", function(error, response, body) {
		        	expect(body).to.contain("materials");
		        	done();
		     	});
			});
			it("should contain: dimensions", function(done) {
				request.get(baseURL + "/json/defaultCase.json", function(error, response, body) {
		        	expect(body).to.contain("dimensions");
		        	done();
		     	});
			});
		});
		describe("Default Fans", function() {
			it("should have defaultFans.json", function(done) {
				request.get(baseURL + "/json/defaultFans.json", function(error, response, body) {
		        	expect(response.statusCode).to.be.equal(200);
		        	done();
		     	});
			});
			it("should be a valid .json", function(done) {
				request.get(baseURL + "/json/defaultFans.json", function(error, response, body) {
		        	expect(body).to.be.json;
		        	done();
		     	});
			});
			it("should contain: at least one fan", function(done) {
				request.get(baseURL + "/json/defaultFans.json", function(error, response, body) {
		        	expect(body).to.contain("fanOne");
		        	done();
		     	});
			});
			it("fan should contain: a fan object", function(done) {
				request.get(baseURL + "/json/defaultFans.json", function(error, response, body) {
		        	expect(body).to.contain("fanObject");
		        	done();
		     	});
			});
			it("fan should contain: a fan AOE object", function(done) {
				request.get(baseURL + "/json/defaultFans.json", function(error, response, body) {
		        	expect(body).to.contain("fanAOEObject");
		        	done();
		     	});
			});
			it("fan should contain: properties", function(done) {
				request.get(baseURL + "/json/defaultFans.json", function(error, response, body) {
		        	expect(body).to.contain("properties");
		        	done();
		     	});
			});
		});
	});
});