import express from 'express';
import {platform} from '../app.js';
import {writeFileSync, unlink} from 'fs';
export const userInfoRouter = express.Router();

userInfoRouter.post("/api/setUserInfo", async (req, res) => {
  console.log(req.body);
  let imageCid;
  if('image' in req.body){
    let image = Buffer.from(req.body.image, 'base64');
    writeFileSync(req.body.filename, image, 'utf8');
    imageCid = await platform.ipfsClient.put(req.body.filename);
    unlink(req.body.filename, (err) => {
      if(err) throw err;
    });
  }
  else{
    imageCid = req.body.imageCid;
  }
  
  let userInfoObject = {
    'name': req.body.name,
    'location': req.body.location,
    'filename': req.body.filename,
    'imageCid': imageCid
  };
  let cid = await platform.ipfsClient.uploadUserInfo(userInfoObject);
  res.send(cid);
  console.log(`Put ${req.body.name}'s info to IPFS.`);
  console.log(`CID: ${cid}`);
})

userInfoRouter.get("/api/getUserInfo", async (req, res) => {
  let infoObject = await platform.getUserInfo(req.query.address);
  res.send(infoObject);
})

userInfoRouter.get("/api/check-if-user-info-should-update", async (req, res) => {
  await platform.checkIfUserInfoShouldUpdate(req.query.address);
  res.end();
})