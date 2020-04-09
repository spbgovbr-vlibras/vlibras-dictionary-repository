import { daemonError, daemonInfo } from "../util/debugger";
import { getTranslationsWithoutReview } from "../util/statsApiRequests";
import { postTranslations } from "../util/wikilibrasTranslateSuggestorRequests";
import { differenceWith, isEqual, findIndex } from "lodash";
import redisConnection from "../util/redisConnection";
import { forEach, map } from "lodash";

const removeAlreadySuggested = async (missingSentences, redisClient) => {
  const alreadySuggestedSentences = await redisClient.keys("*");

  const notIncluded = [];

  map(missingSentences, (sentence) => {
    if (
      findIndex(
        alreadySuggestedSentences,
        (item) => item === sentence.translation
      ) === -1
    ) {
      notIncluded.push(sentence);
    }
  });

  return notIncluded;
};

const translationDaemon = async () => {
  daemonInfo("Searching for new sentences for wikilibras");
  try {
    const redisClient = await redisConnection();
    const data = await getTranslationsWithoutReview();

    const sentencesToSuggest = await removeAlreadySuggested(data, redisClient);

    const errors = await postTranslations(sentencesToSuggest);

    console.log(`Erro em: ${errors.length}`);

    forEach(sentencesToSuggest, (sentence) => {
      redisClient.set(sentence.translation, sentence.translation);
    });
  } catch (error) {
    daemonError(`TranslateDaemonError: ${error.message}`);
  }
};

export default translationDaemon;
