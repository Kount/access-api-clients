var kount = require('../lib/kount-access-api.js');
var expect = require("chai").expect;
var nock = require('nock');

//Default vaules for tests
var sessionId = "VALID_SESSION_ID";
var merchantId = 123456;
var apiKey = 'SOME_VALID_KEY';
var badApiKey = 'BAD_KEY';
var serverName = 'server.com';
var version = '0200';
var oldVersion = '0103';
var badVersion = '0100';
var user = 'admin';
var password = 'password';
var expectedGetOutput = { 'some':'data' };

// Test getDevice()
describe("kount-access", function() {
    describe(".getDevice", function() {
        it("should return a JSON array and no errors", function(done) {
            var mockApiServer = nock('https://server.com')
            .get('/api/device?s=' + sessionId + '&v=0200')
            .reply(200, expectedGetOutput);
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getDevice(sessionId, function(err,data){
              expect(err).equal(null);
              expect(data).is.not.equal(null);
              done();
            });
        });
        it("should catch the missing sessionId and report up the error in the callback", function(done) {
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getDevice("", function(err,data){
              expect(err).is.equal("Invalid sessionId []");
              done();
            });
        });
        it("should catch the 403 and report up the error in the callback", function(done) {
            var mockApiServer = nock('https://server.com')
            .get('/api/device?s=' + sessionId + '&v=0200')
            .reply(403);
            var ka = new kount(merchantId, badApiKey, serverName);
            var results = ka.getDevice(sessionId, function(err,data){
              expect(err).is.equal("HTTP ERROR STATUS:403");
              done();
            });
        });
        it("should return an HTML Help page", function(done) {
            var mockApiServer = nock('https://server.com')
            .get('/api/device?help=true&v=' + version)
            .reply(200, "<html><head></head><body>help page</body></html>");
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getDeviceHelp(version, function(err,data){
              expect(err).is.equal(null);
              expect(data);
              done();
            });
        });
        it("should throw an error(400) when an invalid version is passed", function(done) {
            var mockApiServer = nock('https://server.com')
            .get('/api/device?help=true&v=' + badVersion)
            .reply(400);
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getDeviceHelp(badVersion, function(err,data){
              expect(err).is.equal("HTTP ERROR STATUS:400");
              done();
            });
        });
    });
});

//Test getVelocity()
describe("kount-access", function() {
    describe(".getVelocity", function() {
        it("should return a JSON array and no errors", function(done) {
            var mockApiServer = nock('https://server.com')
            .post('/api/velocity')
            .reply(200, expectedGetOutput);
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getVelocity(sessionId, user,password, function(err,data){
              expect(err).is.equal(null);
              expect(data);
              done();
            });
        });
        it("should return a JSON array and no errors with an optional version", function(done) {
            var mockApiServer = nock('https://server.com')
            .post('/api/velocity')
            .reply(200, expectedGetOutput);
            var ka = new kount(merchantId, apiKey, serverName, oldVersion);
            var results = ka.getVelocity(sessionId, user,password, function(err,data){
              expect(err).is.equal(null);
              expect(data);
              done();
            });
        });
        it("should catch the missing sessionId and report up the error in the callback", function(done) {
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getVelocity(null, user, password, function(err,data){
              expect(err).is.equal("Invalid sessionId [null]");
              done();
            });
        });
        it("should catch the missing user name and report up the error in the callback", function(done) {
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getVelocity(sessionId, "", password, function(err,data){
              expect(err).is.equal("Missing user");
              done();
            });
        });
        it("should catch the missing password and report up the error in the callback", function(done) {
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getVelocity(sessionId, user, null, function(err,data){
              expect(err).is.equal("Missing password");
              done();
            });
        });
        it("should catch the 403 and report up the error in the callback", function(done) {
            var mockApiServer = nock('https://server.com')
            .post('/api/velocity')
            .reply(403);
            var ka = new kount(merchantId, badApiKey, serverName);
            var results = ka.getVelocity(sessionId, user, password, function(err,data){
              expect(err).is.equal("HTTP ERROR STATUS:403");
              done();
            });
        });
        it("should return an HTML Help page", function(done) {
            var mockApiServer = nock('https://server.com')
            .post('/api/velocity', {help: "true", v: version})
            .reply(200, "<html><head></head><body>help page</body></html>");
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getVelocityHelp(version, function(err,data){
              expect(err).is.equal(null);
              expect(data);
              done();
            });
        });
        it("should throw an error(400) when an invalid version is passed", function(done) {
            var mockApiServer = nock('https://server.com')
            .post('/api/velocity', {help: "true", v: badVersion})
            .reply(400);
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getVelocityHelp(badVersion, function(err,data){
              expect(err).is.equal("HTTP ERROR STATUS:400");
              done();
            });
        });
    });
});

//Test getDecision()
describe("kount-access", function() {
    describe(".getDecision", function() {
        it("should return a JSON array with decision and device and velcity information", function(done) {
            var mockApiServer = nock('https://server.com')
            .post('/api/decision')
            .reply(200, expectedGetOutput);
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getDecision(sessionId, user, password, function(err,data){
              expect(err).is.equal(null);
              expect(data);
              done();
            });
        });
        it("should catch the missing sessionId and report up the error in the callback", function(done) {
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getDecision(null, user, password, function(err,data){
              expect(err).is.equal("Invalid sessionId [null]");
              done();
            });
        });
        it("should catch the missing user name and report up the error in the callback", function(done) {
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getDecision(sessionId, "", password, function(err,data){
              expect(err).is.equal("Missing user");
              done();
            });
        });
        it("should catch the missing password and report up the error in the callback", function(done) {
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getDecision(sessionId, user, null, function(err,data){
              expect(err).is.equal("Missing password");
              done();
            });
        });
        it("should catch the 403 and report up the error in the callback", function(done) {
            var mockApiServer = nock('https://server.com')
            .post('/api/decision')
            .reply(403);
            var ka = new kount(merchantId, "BAD_KEY", serverName);
            var results = ka.getDecision(sessionId, user, password, function(err,data){
              expect(err).is.equal("HTTP ERROR STATUS:403");
              done();
            });
        });
        it("should return an HTML Help page", function(done) {
            var mockApiServer = nock('https://server.com')
            .post('/api/decision', {help: "true", v: version})
            .reply(200, "<html><head></head><body>help page</body></html>");
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getDecisionHelp(version, function(err,data){
              expect(err).is.equal(null);
              expect(data);
              done();
            });
        });
        it("should throw an error(400) when an invalid version is passed", function(done) {
            var mockApiServer = nock('https://server.com')
            .post('/api/decision', {help: "true", v: badVersion})
            .reply(400);
            var ka = new kount(merchantId, apiKey, serverName);
            var results = ka.getDecisionHelp(badVersion, function(err,data){
              expect(err).is.equal("HTTP ERROR STATUS:400");
              done();
            });
        });
    });
});


