import axios from "axios";
import redisConnection from "../util/redisConnection";
import env from "../../config/environment";
import { daemonInfo, daemonError } from "../util/debugger";
import {
  getSuggestorIdOnWikilibras,
  postNewTaskOnWikilibras,
  postNewActionOnWikilibras,
  resetUserTaskOnWikilibras
} from "../util/wikilibrasSuggestorRequests";

const dictionaryStatsRequest = axios.create({
  baseURL: env.DICTIONARY_STATS_BASE_URL,
  timeout: 10000
});

const getMissingSigns = async function getMissingSignsRanking() {
  try {
    const response = await dictionaryStatsRequest({
      method: "get",
      url: env.DICTIONARY_MISSING_SIGNS_URL,
      transformResponse: [
        data => Array.from(JSON.parse(data).signsRanking, x => x.name)
      ]
    });

    return response.data;
  } catch (error) {
    throw new Error(`SignsListRequestError: ${error.message}`);
  }
};

const removeAlreadySuggested = async function removeAlreadySuggestedSigns(
  missingSigns
) {
  try {
    const redisClient = await redisConnection();
    const alreadySuggestedSigns = await redisClient.keys("*");
    return missingSigns.filter(x => !alreadySuggestedSigns.includes(x));
  } catch (error) {
    throw new Error(error.message);
  }
};

const suggestNewSign = async function suggestNewSignToWikilibras(
  sign,
  wikilibrasUserID
) {
  try {
    const taskID = await postNewTaskOnWikilibras({
      task_type_id: 1,
      task_state_id: 1,
      code: sign,
      creation_user_id: wikilibrasUserID,
      current_user_id: wikilibrasUserID
    });

    await postNewActionOnWikilibras({
      action_type_id: 1,
      details: "no detail",
      success: true,
      task_id: taskID,
      user_id: wikilibrasUserID
    });

    await resetUserTaskOnWikilibras(taskID);

    const redisClient = await redisConnection();
    redisClient.set(sign, sign);
  } catch (error) {
    throw new Error(`Failed to suggest '${sign}': ${error.message}`);
  }
};

const signsSuggestorDaemon = async function wikilibrasSignsSuggestorDaemon() {
  // setInterval(async () => {
  try {
    daemonInfo("Suggesting new signs for Wikilibras");
    const suggestorId = await getSuggestorIdOnWikilibras();
    const missingSigns = await getMissingSigns();
    const signsToSuggest = await removeAlreadySuggested(missingSigns);

    const promisesList = [];
    for (let i = 0; i < signsToSuggest.length; i += 1) {
      promisesList.push(suggestNewSign(signsToSuggest[i], suggestorId));
    }

    await Promise.all(promisesList);
  } catch (error) {
    daemonError(error.message);
  }
  // }, env.SIGNS_SUGGESTION_INTERVAL);
};

export default signsSuggestorDaemon;
