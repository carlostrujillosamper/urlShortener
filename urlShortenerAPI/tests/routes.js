const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../bin/www");
const should = chai.should();
const URL = require("../models");

chai.use(chaiHttp);

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
        res.body.should.have.property("msg");
      });
  });
});
