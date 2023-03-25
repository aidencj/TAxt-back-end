# TAxt back-end

This is the back-end of our social media platform, TAxt.

<img src="./TAxt_appIcon.png" width = "200" height = "200">

> Please note that if you only want to experience our app, you can directly visit the [front-end](https://github.com/ychia112/TAxt_SocialMedia) and install the app on your phone. The following instructions are only applicable to developers who want to run the back-end server on their own.

## How to use it

**Step 1:**

Download or clone this repo by using the link below:

```
git clone https://github.com/aidencj/TAxt-back-end
```

**Step 2:**

Go to project root and execute the following command in console to get the required dependencies: 

```
npm install
```

**Step 3:**

Deploy the contracts in `./contracts/` with Remix IDE.

**Step 4:**

Modify the following lines in `./config.json`:

```
"PROVIDER_URL": "Your Blockchain provider",
"CONTRACT_ADDRESS_PostNFT": "Contract Address of PostNFT",
"CONTRACT_ADDRESS_UserInfo": "Contract Address of UserInfo",
"CONTRACT_ADDRESS_DiaryNFT": "Contract Address of DiaryInfo",
"ADDRESS": "Address of Your Wallet",
.
.
.
"WEB3_STORAGE_TOKEN": "Token of Your Web3 Storage",
```
> To learn more details about WEB3_STORAGE_TOKEN, please visit [here](https://web3.storage/docs/#get-an-api-token)

**Step 5:**

Run the following command to start the back-end server:

```
node app.js
```
