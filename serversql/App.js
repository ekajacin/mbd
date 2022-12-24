const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mysql = require("mysql");
const fs = require("fs");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "mahasiswa",
});

const app = express();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("server has been starting at port " + PORT);
});
app.use(cors());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: "./public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");


app.post("/tambah", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(408).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    let value = [
      [
        req.body.name,
        req.body.nim,
        req.body.semester,
      ],
    ];
    pool.query(
      "INSERT INTO mahasiswa (name, nim, semester) VALUES ? ",
      [value],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }
        pool.query("SELECT * FROM mahasiswa", (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }
          return res.status(200).json(result);
        });
      }
    );
  });
});
app.post("/mahasiswa/edit", (req, res) => {
  upload(req, res, (err) => {
    pool.query(
      `UPDATE mahasiswa SET name ='${req.body.name}',nim ='${req.body.nim}', semester ='${req.body.semester}' WHERE id = '${req.body.id}'` ,
      
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }
        pool.query("SELECT * FROM mahasiswa", (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }
          return res.status(200).json(result);
        });
      }
    );
  });
});

app.post("/mahasiswa/delete", (req, res) => {
  upload(req, res, (err) => {
    pool.query(
      `DELETE FROM mahasiswa WHERE id = '${req.body.id}'`,
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }
        pool.query("SELECT * FROM mahasiswa", (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }
          return res.status(200).json(result);
        });
      }
    );
  });
});

app.get("/mahasiswa", (req, res) => {
  pool.query("SELECT * FROM mahasiswa", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
});
app.get("/", (req, res) => {
  res.json({ message: "WELCOME" });
});
