import express, { response } from "express";
import { MongoClient } from "mongodb";
//import { MongoClient } from "mongodb";
//const fs=require("fs");
// fs.unlink("./delete-me.css",(err)=>
// {
//   if(err)
//   {
//     console.log(err)
//   }
//   else{
//     console.log("completed updating🎂");
//   }
// })

//const express = require('express');//3rd party
const app = express();
const PORT = process.env.PORT||4000;
//"mongodb://localhost:27017"-V16 & before

//v16+

// const MONGO_URL = "mongodb://localhost";
//const MONGO_URL = "mongodb://127.0.0.1"; //  nodejs - 16+
const MONGO_URL =
  "mongodb+srv://rhagavi:rhagR123@cluster0.ubm2h.mongodb.net/?retryWrites=true&w=majority";
//mongodb+srv://rhagavi:rhagR@2703@cluster0.ubm2h.mongodb.net
//mongodb+srv://rhagavi:rhagR@2703@cluster0.ubm2h.mongodb.net

// Node - MongoDB
async function createConnection() {
  //mongoClient is used in importing
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected ✌😊");
  return client;
}

//calling the function createConnection
const client = await createConnection();

app.use(express.json()); //global middle ware,INtercept and
//convert body to json.
//intercept all the req

app.get("/movies", async function (req, res) {
  //db.movies.find({})
  console.log(req.query);
  if (req.query.rating) {
    // const rating=parseInt(req.query.rating);
    // console.log(rating);
    req.query.rating = +req.query.rating;
  }
  const movies = await client
    .db("movie")
    .collection("movie")
    .find(req.query)
    .toArray(); //converting cursor to array
  res.send(movies);
});

app.get("/movies/:id", async function (req, res) {
  const { id } = req.params;
  console.log(id);
  //await
  const movie = await client
    .db("movie")
    //find:cursor output so, to convert array (but it is missing )
    //find one it is not needed
    .collection("movie")
    .findOne({ id: id });
  console.log(movie); //key id is in 115 line and value id is in path line-111
  movie ? res.send(movie) : res.status(404).send({ msg: "movie not found" });
});
//body->JSON--use express.js as middle ware
//in the middle of path and function
//removed middleware express.json and sent to globally.

app.post("/movies", async function (req, res) {
  const data = req.body;
  //insert db command
  //result-client
  const result = await client.db("movie").collection("movie").insertOne(data);

  res.send(result);
});

app.delete("/movies/:id", async function (req, res) {
  const id = req.params.id;

  const result = await client
    .db("movie")

    .collection("movie")
    .deleteOne({ id: id });
  //key id is in 115 line and value id is in path line-111
  result.deletedCount > 0
    ? res.send({ msg: "movie successfully deleted" })
    : res.status(404).send({ msg: "movie not found" });
});

app.listen(PORT, () => console.log(`App is started in ${PORT}`));

//console.log(req.params);
//key id can be anything
//id watever passed as dynamic value in path its given as value

//     const movie=movies.find((mv)=>mv.id===id);
// console.log(movie);
//find returns a cursor
//cursor is a pagination.
//pagination only gives top 20 in mongo
//if wanted to convert cursor to an array by using to array.

//body->JSON--use express.js as middle ware
//in the middle of path and function
//removed middleware express.json and sent to globally.
