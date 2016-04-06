var expect = require("chai").expect;
var request = require("request");

var baseURL = "http://localhost:4000";

describe("AirFlow Server", function () {
	describe("Server", function() {
		it("should respond OK", function(done) {
			request.get(baseURL, function(error, response, body) {
	        	expect(response.statusCode).to.be.equal(200);
	        	done();
	     	});
		});
	});
	describe("Default Project Details", function() {
		it("should have defaultProjectDetails.json", function(done) {
			request.get(baseURL + "/json/defaultProjectDetails.json", function(error, response, body) {
	        	expect(response.statusCode).to.be.equal(200);
	        	done();
	     	});
		});
		it("should be a valid .json", function(done) {
			request.get(baseURL + "/json/defaultProjectDetails.json", function(error, response, body) {
	        	expect(body).to.be.json;
	        	done();
	     	});
		});
		it("should contain a default project definition", function(done) {
			request.get(baseURL + "/json/defaultProjectDetails.json", function(error, response, body) {
	        	expect(body).to.contain("projectName");
	        	expect(body).to.contain("author");
	        	expect(body).to.contain("version");
	        	done();
	     	});
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
		it("should contain a case definition", function(done) {
			request.get(baseURL + "/json/defaultCase.json", function(error, response, body) {
	        	expect(body).to.contain("materials");
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
		it("should contain at least one fan definition", function(done) {
			request.get(baseURL + "/json/defaultFans.json", function(error, response, body) {
	        	expect(body).to.contain("fanOne");
	        	expect(body).to.contain("fanObject");
	        	expect(body).to.contain("fanAOEObject");
	        	expect(body).to.contain("properties");
	        	done();
	     	});
		});
	});
	describe("Default New Fan", function() {
		it("should have defaultNewFanDetails.json", function(done) {
			request.get(baseURL + "/json/defaultNewFanDetails.json", function(error, response, body) {
	        	expect(response.statusCode).to.be.equal(200);
	        	done();
	     	});
		});
		it("should be a valid .json", function(done) {
			request.get(baseURL + "/json/defaultNewFanDetails.json", function(error, response, body) {
	        	expect(body).to.be.json;
	        	done();
	     	});
		});
		it("should contain a default new fan definition", function(done) {
			request.get(baseURL + "/json/defaultNewFanDetails.json", function(error, response, body) {
	        	expect(body).to.contain("fanObject");
	        	expect(body).to.contain("material");
	        	expect(body).to.contain("fanAOEObject");
	        	expect(body).to.contain("properties");
	        	done();
	     	});
		});
	});
	describe("Stats Analysis JSON", function() {
		it("should have statsAnalysis.json", function(done) {
			request.get(baseURL + "/json/statsAnalysis.json", function(error, response, body) {
	        	expect(response.statusCode).to.be.equal(200);
	        	done();
	     	});
		});
		it("should be a valid .json", function(done) {
			request.get(baseURL + "/json/statsAnalysis.json", function(error, response, body) {
	        	expect(body).to.be.json;
	        	done();
	     	});
		});
		it("should contain stats analysis values", function(done) {
			request.get(baseURL + "/json/statsAnalysis.json", function(error, response, body) {
	        	expect(body).to.contain("overall");
	        	expect(body).to.contain("result");
	        	expect(body).to.contain("numFans");
	        	expect(body).to.contain("particleSuccessRatio");
	        	expect(body).to.contain("fanRatio");
	        	done();
	     	});
		});
	});
});