const express = require("express");
const multer = require("multer");
const cors = require("cors");
const OrientDBClient = require("orientjs").OrientDBClient;
const fs = require("fs");

OrientDBClient.connect({
    host: "localhost",
    port: 2480,
    user: "root",
  password: "rootpwd ",
  database: "mahasiswa"
  }).then(client => {
    return client.close();
  }).then(()=> {
     console.log("Client closed");
  });

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server has been starting at port " + PORT);
});
app.use(cors());
app.use(express.static("public"));



