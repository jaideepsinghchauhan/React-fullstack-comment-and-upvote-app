import express from "express";
import { db, connectToDb } from "./db.js";
import fs from "fs";
import admin from "firebase-admin";
import { fileURLToPath } from "url";
import path from "path";
import "dotenv/config";
// we are manually using __dirname and __filename because we are using es6 module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(fs.readFileSync("./credentials.json"));
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());

// this line is to show build which we prepared from front end using RCA react scripts
app.use(express.static(path.join(__dirname, "../build")));

// to handle any api request that doesn't start with api
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.use(async (req, res, next) => {
  const { authtoken } = req.headers;
  console.log(
    "intercepted req middleware 0",
    req?.user,
    "and authToken",
    authtoken
  );
  if (authtoken) {
    console.log("intercepted req middleware if 1");
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e) {
      return res.sendStatus(400).send(e.message);
    }
  } else {
    console.log("intercepted req middleware else 1");
  }

  req.user = req.user || {};
  console.log("server user", req.user);
  next();
});

app.get("/hello", (req, res) => {
  res.send("Hello!");
});

app.get("/api/articles/:name", async (req, res) => {
  const name = req.params.name;
  const uid = req.user;

  console.log("request recieved", name);
  try {
    const collection = db.collection("articles");
    const articles = await collection.findOne({ name });
    console.log("Documents in collection articles:", articles);
    if (articles) {
      const upvoteIds = articles.upvoteIds || [];
      articles.canUpvote = uid && !upvoteIds.includes(uid);
      console.log("canUpvote in :name", articles.canUpvote);
      res.json(articles);
    } else {
      res.sendStatus(404).send("Article Not Found");
    }
  } catch (e) {
    console.error(e);
    res.send("Failed");
  }
});

app.use((req, res, next) => {
  if (req.user) {
    console.log("intercepted req middleware if 2");
    next();
  } else {
    console.log("intercepted req middleware else 2");
    res.sendStatus(401);
  }
});

app.put("/api/articles/:name/upvote", async (req, res) => {
  const name = req.params.name;
  const uid = req?.user?.uid;
  const collection = db.collection("articles");
  const articles = await collection.findOne({ name });
  console.log("Documents in collection articles:", articles);
  if (articles) {
    const upvoteIds = articles.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);
    console.log("canUpvote in :name/upvote", canUpvote);
    try {
      const collection = db.collection("articles");
      if (canUpvote) {
        await collection.updateOne(
          { name },
          { $inc: { upvotes: 1 }, $push: { upvoteIds: uid } }
        );
      }

      const updatedArticle = await collection.findOne({ name });
      res.send(updatedArticle);
    } catch (e) {
      console.error(e);
      res.send("Failed");
    }
  } else {
    res.send("That article doesn't exist");
  }
});

app.post("/api/articles/:name/comments", async (req, res) => {
  const { text } = req.body;
  const { email } = req.user;
  const name = req.params.name;
  try {
    const collection = db.collection("articles");

    await collection.updateOne(
      { name },
      { $push: { comments: { postedBy: email, text } } }
    );
    const article = await collection.findOne({ name });

    console.log("Documents updated in articles:", article);
    if (article) {
      res.send(article);
    } else {
      res.send("That article doesn't exist");
    }
  } catch (e) {
    console.error(e);
    res.send("Failed");
  }
});

const PORT = process.env.PORT || 8000;
connectToDb(() => {
  console.log("succesfully connected to database");
  app.listen(PORT, () => {
    console.log("Server listening on port", PORT);
  });
});
