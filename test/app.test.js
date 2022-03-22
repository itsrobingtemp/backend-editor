process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
// const mocha = require('mocha');
let server = require("../app.js");

chai.should();
chai.use(chaiHttp);

const mockDocID = "615a22f453d74f748150f868";

describe("ME API", () => {
  // GET /test
  describe("GET /", () => {
    it("It should get all posts", (done) => {
      chai
        .request(server)
        .get("/get/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          res.body.length.should.be.above(0);
          done();
        });
    });
  });

  // GET ID
  describe("GET /:id", () => {
    it("It should get a post", (done) => {
      chai
        .request(server)
        .get("/get/" + mockDocID)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.text.should.be.an("string");
          res.body.should.have.property("_id");
          res.body.should.have.property("text");
          done();
        });
    });
  });

  // Fail to get document
  describe("GET /:id", () => {
    it("It should fail to get a post", (done) => {
      chai
        .request(server)
        .get("/get/123")
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  // GET 404 status
  describe("GET /asd", () => {
    it("It should get 404", (done) => {
      chai
        .request(server)
        .get("/asd")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  // POST
  describe("POST /post", () => {
    it("It should post a new content", (done) => {
      const post = {
        text: "Testing",
        name: "Testing",
      };

      chai
        .request(server)
        .post("/post")
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("string");
          done();
        });
    });

    it("It should not post content without text", (done) => {
      chai
        .request(server)
        .post("/post")
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.an("object");
          done();
        });
    });
  });

  // PATCH
  describe("PATCH /update", () => {
    it("It should update a post", (done) => {
      const post = {
        text: "New test",
      };

      // const id = "615a22f453d74f748150f868";

      chai
        .request(server)
        .patch("/update/" + mockDocID)
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("string");
          done();
        });
    });

    it("It should not update without text", (done) => {
      const id = "123";

      chai
        .request(server)
        .patch("/update/" + id)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.an("object");
          done();
        });
    });
  });
});
