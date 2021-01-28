const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();
const URL = require("../models/url");

chai.use(chaiHttp);

describe("URL", () => {
  let urlTest = { url: "https://www.youtube.com", userShortCode: "hellooo" };

  before((done) => {
    URL.remove({}, (err) => {
      done();
    });
  });

  describe("/POST URL", () => {
    it("it should not post a URL if no URL was provided", (done) => {
      let url = {};
      chai
        .request(server)
        .post("/")
        .send(url)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("msg").eql("url not provided");
          done();
        });
    });
    it("it should not post a URL if no valid URL was provided", (done) => {
      let url = { url: "hola" };
      chai
        .request(server)
        .post("/")
        .send(url)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("msg").eql("invalid url");
          done();
        });
    });
    it("it should not post a URL if provided shortcode's character length less than 4", (done) => {
      let url = { url: "https://www.marca.com", userShortCode: "he" };
      chai
        .request(server)
        .post("/")
        .send(url)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have
            .property("msg")
            .eql("short code provided must be at least 4 characters long");
          done();
        });
    });
    it("it should post a URL and generate short code if none was provided", (done) => {
      let url = { url: "https://www.youtube.com" };

      chai
        .request(server)
        .post("/")
        .send(url)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("url").eql("https://www.youtube.com");
          res.body.should.have.property("shortCode");
          done();
        });
    });
    it("it should post a URL with given shortcode", (done) => {
      let url = { url: "https://www.marca.com", userShortCode: "hello" };

      chai
        .request(server)
        .post("/")
        .send(url)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("url").eql("https://www.marca.com");
          res.body.should.have.property("shortCode").eql("hello");
          done();
        });
    });
    it("it should not post a URL if provided shortcode already in use", (done) => {
      let url = { url: "https://www.elpais.com", userShortCode: "hello" };
      chai
        .request(server)
        .post("/")
        .send(url)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have
            .property("msg")
            .eql("short code is not available");
          done();
        });
    });
    it("it should not post a URL if provided url already in use", (done) => {
      let url = { url: "https://www.youtube.com", userShortCode: "helloooooo" };
      chai
        .request(server)
        .post("/")
        .send(url)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a("object");
          res.body.should.have.property("msg").eql("url already in database");
          done();
        });
    });
  });
  describe("/GET Redirect", () => {
    it("it should not redirect if shortcode not on data base", (done) => {
      chai
        .request(server)
        .get("/test34")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("msg").eql("invalid url id");
          done();
        });
    });
    it("it should redirect if correct shortcode provided", (done) => {
      chai
        .request(server)
        .get("/hello")
        .end((err, res) => {
          res.should.redirectTo("https://www.marca.com/");
          done();
        });
    });
  });

  describe("/GET Stats", () => {
    it("it should retrieve stats of url if correct shortcode provided", (done) => {
      chai
        .request(server)
        .get("/hello/stats")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("shortCode").eql("hello");
          res.body.should.have.property("url");
          res.body.should.have.property("registered");
          res.body.should.have.property("lastAccess");
          res.body.should.have.property("visits");
          done();
        });
    });
    it("it should count the visits", (done) => {
      chai
        .request(server)
        .get("/hello/stats")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("visits").eql(1);
          done();
        });
    });
  });
});
