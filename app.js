import {Platform} from './modules/Platform.js';
import {printPostInfo, readJSON} from './modules/utility.js';
import express from 'express';
import {postRouter} from './routes/post.js';
import {userInfoRouter} from './routes/userInfo.js';
import {diaryRouter} from './routes/diary.js';

const CONFIG = readJSON('./config.json');
export const platform = new Platform(CONFIG);

const PORT = CONFIG.PORT;
const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(postRouter);
app.use(userInfoRouter);
app.use(diaryRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at PORT: ${PORT}`);
})

app.get("/hello-world", (req, res) => {
  res.send("Hi!");
})
