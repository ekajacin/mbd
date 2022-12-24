const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const OrientDB = require('orientjs');

  const server = OrientDB({
    host: "localhost",
    username: "root",
    port: 2480,
    password: "rootpwd",
    database: "mahasiswa",
    useToken: true
  });

  const db = server.use({
    name: 'mahasiswa',
    username: 'root',
    password: 'rootpwd',
});
  

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server has been starting at port " + PORT);
});
app.use(cors());
app.use(express.static("public"));

//menampilkan product
app.get("/mahasiswa", async (req, res) => {
    const sql = 'SELECT FROM mahasiswa';
    const result = await db.query(sql);
  });

  app.post("/tambah", (req, res) => {
    upload(req, res, async (err) => {
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
      const sql = (
        "INSERT INTO mahasiswa (name, nim, semester) VALUES ? ",
        [value],
        async (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }
          const sql = ("SELECT * FROM mahasiswa", (err, result) => {
            if (err) {
              return res.status(500).json(err);
            }
            return res.status(200).json(result);
          });
          const result = await db.query(sql)
        }
      );
      const result = await db.query(sql)
    });
  });

  app.post("/mahasiswa/edit", (req, res) => {
    upload(req, res, async (err) => {
      const sql =(
        `UPDATE mahasiswa SET name ='${req.body.name}',nim ='${req.body.nim}', semester ='${req.body.semester}' WHERE id = '${req.body.id}'` ,
        
        async (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }
          const sql =("SELECT * FROM mahasiswa", (err, result) => {
            if (err) {
              return res.status(500).json(err);
            }
            return res.status(200).json(result);
          });
          const result = await db.query(sql)

        }
      );
      const result = await db.query(sql)

    });
  });


