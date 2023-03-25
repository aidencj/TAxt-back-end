import { readFileSync } from 'fs';

export function readJSON(path) {
  let rawDara;
  try {
    rawDara = readFileSync(path, 'utf8');
  }
  catch(error) {
    throw(error);
  }
  return JSON.parse(rawDara);
}

export function printPostInfo(data) {
  console.log(`Author: ${data.author}`);
  console.log(`Title: ${data.title}`);
  console.log(`Context: ${data.context}`);
  console.log(`Emotion: ${data.emotion}`);
}