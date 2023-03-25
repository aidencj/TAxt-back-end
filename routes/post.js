import express from 'express';
import {platform} from '../app.js';

export const postRouter = express.Router();

postRouter.post("/api/post", async (req, res) => {
  console.log(req.body);
  let cid = await platform.post(req.body);
  res.send(cid);
  console.log(`Put ${req.body.author}'s post to IPFS.`)
  console.log(`CID: ${cid}`)
})

postRouter.get("/api/get-post", async (req, res) => {
  console.log(req.body);
  res.send(await platform.getPost(req.query.tokenID));
})

postRouter.get("/api/get-all-posts", async (req, res) => {
  res.send(await platform.getAllPost());
})

postRouter.get("/api/get-all-posts-owned-by", async(req, res) => {
  console.log(req.query);
  res.send(await platform.getAllPostOwnedBy(req.query.owner));
})

