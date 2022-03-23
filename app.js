const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv/config");
app.use(express.json());

// Routes
const postContent = require("./routes/postContent");
const getContent = require("./routes/getContent");
const updateContent = require("./routes/updateContent");

const port = process.env.PORT || 1337;

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Socket.io
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: process.env.SOCKET_URL,
    methods: ["GET", "POST"],
  },
});

io.sockets.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("editing", (socket) => {
    console.log("Currently editing!");
  });
});

httpServer.listen(1337, "127.0.0.1");

app.use(cors());

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/post", postContent);
app.use("/get", getContent);
app.use("/update", updateContent);

// 404 2
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// For errors
app.use((err, req, res, next) => {
  if (res.headersSent) {
    // Test
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

// Start up server
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}!`)
);

module.exports = server;
