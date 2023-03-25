import {IpfsClient} from './IpfsClient.js';
import {Blockchain} from './Blockchain.js';

export class Platform{
  /**
   * The social platform object.
   */
  constructor(CONFIG) {
    this.CONFIG = CONFIG;
    this.blockchain = new Blockchain(this.CONFIG);
    this.ipfsClient = new IpfsClient(this.CONFIG.WEB3_STORAGE_TOKEN);
    this.posts = new Array();
    this.userInfo = new Map();
    this.userInfoCid = new Map();
    this.diaries = new Array();
    this.pages = new Array();
  }

  /**
   * Upload the post to IPFS and store the CID to NFT Contract.
   * @param {object} postObject The JSON object of the post.
   */
  async post(postObject) {
    let cid = await this.ipfsClient.post(postObject);
    return cid;
  }

  /**
   * Get the post object by its tokenID.
   * @param {Number} id The tokenID of that post
   * @returns An post object.
   */
  async getPost(id){
    let infoObject = await this.getUserInfo(this.posts[id].author);

    if(!('name' in infoObject))
      return {'context': this.posts[id]};
    
    return {
      'context': this.posts[id],
      'userInfo': infoObject
    };
  }

  async syncPosts() {
    let totalSupply = await this.blockchain.getPostTotalSuppy();
    if(this.posts.lengh == totalSupply)
      return;
    
    for(let i = this.posts.length; i < totalSupply; i++){
      try {
        let postCid = await this.blockchain.getPostURI(i);
        let postObject = await this.ipfsClient.get(postCid, 'Post.json');
        postObject.author = postObject.author.toLowerCase();
        this.posts.push(postObject);
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  async getAllPost() {
    await this.syncPosts();
    let ret = new Array();
    for(let i = 0; i < this.posts.length; i++){
      ret.push(await this.getPost(i));
    }
    return ret;
  }

  async getAllPostOwnedBy(owner) {
    await this.syncPosts();
    let ret = new Array();
    for(let i = 0; i < this.posts.length; i++){
      if(this.posts[i].author.toLowerCase() == owner.toLowerCase())
        ret.push(await this.getPost(i));
    }
    return ret;
  }

  async uploadUserInfo(userInfoObject) {
    let cid = await this.ipfsClient.uploadUserInfo(userInfoObject);
    return cid;
  }

  async getUserInfo(address) {
    if(this.userInfo.has(address))
      return this.userInfo.get(address);
    
    let cid = await this.blockchain.getUserInfo(address);
    let infoObject = (cid == "")? {}: await this.ipfsClient.get(cid, 'userInfo.json');

    this.userInfoCid.set(address, cid);
    this.userInfo.set(address, infoObject);
    return infoObject
  }

  async checkIfUserInfoShouldUpdate(address){
    let cid = await this.blockchain.getUserInfo(address);
    if(cid != "" && (!this.userInfoCid.has(address) || cid != this.userInfoCid.get(address))){
      let infoObject = await this.ipfsClient.get(cid, 'userInfo.json');
      this.userInfoCid.set(address, cid);
      this.userInfo.set(address, infoObject);
    }
  }

  /**
   * Get the page object by its tokenID.
   * @param {Number} id The tokenID of that page
   * @returns An page object.
   */
  async getPage(id){
    let infoObject = await this.getUserInfo(this.pages[id].author);

    if(!('name' in infoObject))
      return {'context': this.pages[id]};
    
    return {
      'context': this.pages[id],
      'userInfo': infoObject
    };
  }

  async syncPages() {
    let totalSupply = await this.blockchain.getPageNum();
    if(this.pages.lengh == totalSupply)
      return;
    
    for(let i = this.pages.length; i < totalSupply; i++){
      try {
        let pageCid = await this.blockchain.getPageURI(i);
        let pageObject = await this.ipfsClient.get(pageCid, 'Post.json');
        pageObject.author = pageObject.author.toLowerCase();
        this.pages.push(pageObject);
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  async syncDiaryInfo() {
    let totalSupply = await this.blockchain.getDiaryNum();
    if(this.diaries.lengh == totalSupply)
      return;
    
    for(let i = this.diaries.length; i < totalSupply; i++){
      try {
        let diaryInfo = await this.getDiary(i);
        let diaryObject = {
          'name': diaryInfo.name,
          'id': diaryInfo.id,
          'owner1': diaryInfo.owner1.toLowerCase(),
          'owner2': diaryInfo.owner2.toLowerCase()
        };
        this.diaries.push(diaryObject);
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  async getDiary(id){
    let diaryInfo = await this.blockchain.getDiary(id);
    return diaryInfo;
  }

  async getAllDiariesOwnedBy(owner) {
    await this.syncDiaryInfo();
    let ret = new Array();
    for(let i = 0; i < this.diaries.length; i++){
      if(this.diaries[i].owner1 == owner || this.diaries[i].owner2 == owner)
        ret.push(this.diaries[i])
    }
    return ret;
  }

  async getAllPagesOfDiary(diaryId) {
    await this.syncPages();
    let diaryInfo = await this.getDiary(diaryId);
    let ret = new Array();
    for(let i = 0; i < diaryInfo.pages.length; i++){
      ret.push(await this.getPage(diaryInfo.pages[i]));
    }
    return ret;
  }
}