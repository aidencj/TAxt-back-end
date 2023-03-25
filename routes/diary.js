import express from 'express';
import {platform} from '../app.js';

export const diaryRouter = express.Router();

diaryRouter.post("/api/diary/new-page", async (req, res) => {
  console.log(req.body);
  let cid = await platform.post(req.body);
  res.send(cid);
  console.log(`Put ${req.body.author}'s post to IPFS.`)
  console.log(`CID: ${cid}`)
})


diaryRouter.get("/api/diary/get-diary", async(req, res) => {
  console.log(req.query);
  res.send(await platform.getDiary(req.query.id));
})

diaryRouter.get("/api/diary/get-all-diaries-owned-by", async(req, res) => {
    console.log(req.query);
    res.send(await platform.getAllDiariesOwnedBy(req.query.owner));
})

diaryRouter.get("/api/diary/get-all-pages-of-diary", async(req, res) => {
    console.log(req.query);
    res.send(await platform.getAllPagesOfDiary(req.query.diaryId));
})