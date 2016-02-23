var expect = require("chai").expect;

/*describe("AirFlow", function () {
	describe("Server", function() {
		it("should respond OK", function() {

		});
	});
});*/


describe("Testing Mocha", function() {
	it("should add numbers together", function() {
		var a = 5;
		var b = 2;
		var c = a + b;
		expect(c).to.equal(7);
	});
	it("should test the length of array", function() {
		var a = [1, 2, 3, 4];
		expect(a).to.have.length(4);
	});
	it("should fail", function() {
		var a = [1, 2, 3, 4];
		expect(a).to.have.length(8);
	});
});
