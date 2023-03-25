import { Web3Storage, getFilesFromPath } from 'web3.storage';
import { readFileSync, writeFileSync, unlink } from 'fs';
import https from 'https';

export class IpfsClient {
  constructor(WEB3_STORAGE_TOKEN) {
    this.client = new Web3Storage({ token: WEB3_STORAGE_TOKEN });
  }

  /**
   * Uploads files to web3.storage
   * @param {string} path The path to the file.
   * @return {Promise<CIDString>} Returns the corresponding Content Identifier (CID).
   */
  async put(path) {
    let file = await getFilesFromPath(path)
    let cid = await this.client.put(file)
    return cid;
  }

  /**
   * Fetch the post object by its CID.
   * @param {CIDString} cid The Content Identifier (CID) of the post.
   * @return {object} Returns the post object,
   * which contains {"author", "title", "context", "emotion"}
   */
  get(cid, filename) {
    return new Promise((resolve, reject) => {
      let rawData = '';
      console.log(`CID: ${cid}`);
      https.get(`https://${cid}.ipfs.w3s.link/${filename}`, (resp) => {

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          rawData += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(JSON.parse(rawData));
        });

      }).on("error", (err) => {
        reject("Error: " + err.message);
      });
    })
  }

  /**
   * Upload a post to web3.storage
   * @param {object} postObject The JSON object of the post.
   * @return {Promise<CIDString>} Returns the corresponding Content Identifier (CID).
   */
  async post(postObject){
    let filename = `Post.json`;
    writeFileSync(filename, JSON.stringify(postObject));
    let cid = await this.put(filename);
    unlink(filename, (err) => {
      if (err) throw err;
    });
    return cid;
  }

  async uploadUserInfo(userInfoObject) {
    let filename = 'userInfo.json';
    writeFileSync(filename, JSON.stringify(userInfoObject));
    let cid = await this.put(filename);
    unlink(filename, (err) => {
      if(err) throw err;
    });
    return cid;
  }
}
