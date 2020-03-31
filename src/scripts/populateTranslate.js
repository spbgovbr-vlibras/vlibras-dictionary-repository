import fs from "fs";
import { forEach, random } from "lodash";
import axios from "axios";

const PATH = __dirname;

const translateRequests = axios.create({
  baseURL: "https://traducao2-dth.vlibras.gov.br",
  timeout: 30000
});

const openAndGetData = path => {
  try {
    const file = fs.readFileSync(path, "UTF-8");
    return file;
  } catch (err) {
    return null;
  }
};

const splitIntoSentences = (allSentences, data) => {
  const sentences = data.split(".");

  return forEach(sentences, sentence => {
    sentence = sentence.trim().replace(/\n/g, "");

    if (sentence !== "") {
      allSentences.push(sentence);
    }
  });
};

const callTranslate = async sentence => {
  try {
    return await translateRequests({
      url: "/translate",
      method: "POST",
      data: { text: sentence }
    });
  } catch (err) {
    // console.log(err.message);
  }
};

const translate = async list => {
  const result = [];

  for (let i = 0; i < list.length; i++) {
    const response = await callTranslate(list[i]);
    if (response) {
      try {
        await populate({ text: list[i], translation: response.data });
      } catch (err) {
        console.log(`Erro ao popular frase: ${list[i]}}`);
        console.log(err);
      }
    } else console.log(`Erro ao traduzir frase: ${list[i]}`);
  }

  return result;
};

const populate = async sentence => {
  let rating = random(0, 1) === 1 ? "good" : "bad";
  let review = random(0, 1) === 1 ? sentence.translation : "";
  await translateRequests({
    url: "/review",
    method: "POST",
    data: {
      text: sentence.text,
      translation: sentence.translation,
      rating,
      review
    }
  });
};

const allSentences = [];
const fullData = openAndGetData(`${PATH}/text.txt`);
splitIntoSentences(allSentences, fullData);

translate(allSentences);
