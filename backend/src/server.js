import express from "express";
import cors from "cors";
import { postRouter, messageRouter, userRouter, channel, login, subscriptionRouter, commentRouter } from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use("/posts", postRouter);
app.use("/login", login);
app.use("/messages", messageRouter);
app.use("/", userRouter);
app.use("/channels", channel);
app.use("/subscriptions", subscriptionRouter);
app.use("/comments", commentRouter)
app.get("/", function (req, res) {
  res.send("Hello World!");
});

export {app};