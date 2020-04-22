import { daemonError, daemonInfo } from "../util/debugger";
import { getTranslationsWithoutReview } from "../util/statsApiRequests";
import { postNewTaskOnWikilibras } from "../util/wikilibrasTranslateSuggestorRequests";
import { find } from "lodash";
import redisConnection from "../util/redisConnection";
import { map } from "lodash";
import { getSuggestorIdOnWikilibras } from "../util/wikilibrasSuggestorRequests";

const removeAlreadySuggested = async (missingSentences) => {
  const redisClient = await redisConnection();
  const alreadySuggestedSentences = await redisClient.keys("*");
  const notIncluded = [];

  map(missingSentences, (sentence) => {
    if (
      !find(alreadySuggestedSentences, (item) => item === sentence.translation)
    ) {
      notIncluded.push(sentence);
    }
  });

  return notIncluded;
};

const suggestNewSentence = async (wikilibrasUserID, sentence) => {
  const data = {
    task_type_id: 3,
    task_state_id: 13,
    code: sentence.text,
    description: sentence.translation,
    example: sentence.review,
    creation_user_id: wikilibrasUserID,
    current_user_id: null,
  };

  if (sentence.review !== "") data.task_state_id = 14;

  try {
    await postNewTaskOnWikilibras(data);
    const redisClient = await redisConnection();
    redisClient.set(sentence.translation, sentence.translation);
  } catch (error) {
    throw new Error(
      `Failed to suggest '${sentence.translation}': ${error.message}`
    );
  }
};

const translationDaemon = async () => {
  daemonInfo("Searching for new sentences for wikilibras");
  try {
    const data = await getTranslationsWithoutReview();
    const suggestorId = await getSuggestorIdOnWikilibras();
    const sentencesToSuggest = await removeAlreadySuggested(data);

    const promisesList = [];
    for (let i = 0; i < sentencesToSuggest.length; i++) {
      promisesList.push(suggestNewSentence(suggestorId, sentencesToSuggest[i]));
    }
    await Promise.all(promisesList);
  } catch (error) {
    daemonError(`TranslateDaemonError: ${error.message}`);
  }
};

export default translationDaemon;
