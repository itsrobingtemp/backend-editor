const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Content = require("./models/Content.js");
const verify = require("./routes/jwtVerify.js");

// Graphql
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/Schemas/index.js");

// Other
require("dotenv/config");

// Routes
const postContent = require("./routes/postContent");
const getContent = require("./routes/getContent");
const updateContent = require("./routes/updateContent");
const auth = require("./routes/auth.js");

const port = process.env.PORT || 1337;

// Middlewares
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Sockets
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: process.env.SOCKET_URL,
    methods: ["GET", "POST"],
  },
});

// Verify user connection
io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      process.env.JWT_SECRET,

      function (err, decoded) {
        if (err) return next(new Error("Authentication error"));

        socket.user = decoded;
        next();
      }
    );
  } else {
    next(new Error("Authentication error"));
  }
});

// Connection
io.on("connection", (socket) => {
  console.log("USER ID: ", socket.user._id);
  console.log(socket.id, "joined the server.");

  socket.on("send-doc-changes", (data) => {
    socket.to(data._id).emit("receive-doc-changes", data.delta);
  });

  socket.on("doc-joined", function (room) {
    socket.join(room);
    console.log(socket.id, "joined room", room);
  });

  socket.on("doc-save", async (data) => {
    const incomingData = new Content({
      text: data.delta,
      name: data.name,
      owner: socket.id,
      sharedWith: data.sharedWith,
    });

    try {
      const saveContent = await incomingData.save();
      socket.to(data._id).emit("saved-doc-changes", saveContent);
    } catch (err) {
      socket.to(data._id).emit("error", "Couldn't save content");
    }
  });
});

httpServer.listen(process.env.PORT || 1338);

// API routes
app.use("/post", postContent);
app.use("/get", getContent);
app.use("/update", updateContent);
app.use("/user", auth);

app.use(
  "/graphql",
  // verify,
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// 404
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Errors d
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    errors: [
      {
        status: err.status,
        title: err.message,
        detail: err.message,
      },
    ],
  });
});

if (process.env.NODE_ENV === "test") {
  // Connect to TEST DB
  mongoose.connect(process.env.DB_TEST_CONNECTION);
} else {
  // Connect to DB
  mongoose.connect(process.env.DB_CONNECTION);
}

const server = app.listen(port, () =>
  console.log(`Listening on port ${port}!`)
);

module.exports = server;
