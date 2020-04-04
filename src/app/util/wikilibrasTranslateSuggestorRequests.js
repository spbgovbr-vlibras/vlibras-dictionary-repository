import axios from "axios";
import env from "../../config/environment";
import redisConnection from "../util/redisConnection";
import { differenceWith, isEqual, forEach } from "lodash";

const wikiTranslationRequests = axios.create({
  baseURL: env.TRANSLATE_STATS_BASE_URL,
  method: "POST",
  timeout: 10000
});

const removeAlreadySuggested = async (missingSentences, redisClient) => {
  const alreadySuggestedSentences = await redisClient.keys("*");
  return differenceWith(missingSentences, alreadySuggestedSentences, isEqual);
};

const postTranslations = async missingSentences => {
  const redisClient = await redisConnection();
  const sentencesToSuggest = await removeAlreadySuggested(
    missingSentences,
    redisClient
  );

  forEach(sentencesToSuggest, sentence => {
    redisClient.set(sentence, sentence);
  });
};

export { postTranslations };
