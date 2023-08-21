import express from "express";
import mongoose from "mongoose";
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import config from "./config/config.js";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from 'cors'

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  SESSION_SECRET,
  REDIS_URL,
  REDIS_PORT,
} = config;

const app = express();
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  console.log("attempting to connect...");
  mongoose
    .connect(mongoURL, { useNewUrlParser: true })
    .then(() => {
      console.log("successfully connected to db");
    })
    .catch((e) => {
      console.log(e);

      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

let redisClient = createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
});
redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
});

app.set("trust proxy", 1); // trust first proxy
app.use(cors({
    
}))
// Initialize sesssion storage.

app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: SESSION_SECRET,
    secure: false,
    cookie: {
      secure: false,
      resave: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);

app.use(express.json());

app.get("/api/v1", (req, res) => {
  res.send("<h2>Hello</h2>");
  console.log("Yeah it ran");
});

app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/auth", authRoutes);
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
