import axios from 'axios';
import env from '../../config/environment';
import { serverWarning } from '../util/debugger';

const dictionaryStatsRequest = axios.create({
  baseURL: env.DICTIONARY_STATS_BASE_URL,
  timeout: 10000,
});

const wikilibrasRequest = axios.create({
  baseURL: env.WIKILIBRAS_BASE_URL,
  timeout: 10000,
});

const authenticateOnWikilibras = async function authenticateOnWikilibrasServer() {
  try {
    const response = await wikilibrasRequest({
      method: 'post',
      url: env.WIKILIBRAS_AUTHENTICATON_URL,
      headers: { 'Content-Type': 'application/json' },
      data: {
        email: env.WIKILIBRAS_USER_EMAIL,
        password: env.WIKILIBRAS_PASSWORD,
      },
      responseType: 'json',
      transformResponse: [(data) => `${JSON.parse(data).type} ${JSON.parse(data).token}`],
    });

    return response.data;
  } catch (error) {
    throw new Error(`WikilibrasAuthRequestError: ${error.message}`);
  }
};

const whoAmIOnWikilibras = async function whoAmIOnWikilibrasServer() {
  try {
    const bearerToken = await authenticateOnWikilibras();
    const response = await wikilibrasRequest({
      method: 'get',
      url: env.WIKILIBRAS_WHOAMI_URL,
      headers: { Authorization: bearerToken },
      responseType: 'json',
      transformResponse: [(data) => JSON.parse(data).user_id],
    });

    return response.data;
  } catch (error) {
    throw new Error(`WikilibrasWhoAmIRequestError: ${error.message}`);
  }
};

const postNewActionOnWikilibras = async function postNewActionOnWikilibrasServer(userID, taskID) {
  try {
    await wikilibrasRequest({
      method: 'post',
      url: env.WIKILIBRAS_NEWACTION_URL,
      headers: { 'Content-Type': 'application/json' },
      data: {
        action_type_id: 1,
        details: 'no detail',
        success: true,
        task_id: taskID,
        user_id: userID,
      },
    });

    await wikilibrasRequest({
      method: 'put',
      url: env.WIKILIBRAS_USER_TASK_URL,
      headers: { 'Content-Type': 'application/json' },
      data: {
        current_user_id: null,
      },
    });
  } catch (error) {
    throw new Error(`WikilibrasNewActionRequestError: ${error.message}`);
  }
};

const postNewTaskOnWikilibras = async function postNewTaskOnWikilibrasServer(userID, signID) {
  try {
    const response = await wikilibrasRequest({
      method: 'post',
      url: env.WIKILIBRAS_NEWTASK_URL,
      headers: { 'Content-Type': 'application/json' },
      data: {
        task_type_id: 1,
        task_state_id: 1,
        code: signID,
        creation_user_id: userID,
        current_user_id: userID,
      },
      responseType: 'json',
      transformResponse: [(data) => JSON.parse(data).id],
    });

    await postNewActionOnWikilibras(userID, response.data);
  } catch (error) {
    throw new Error(`WikilibrasNewTaskRequestError: ${error.message}`);
  }
};

const getMissingSigns = async function getMissingSignsRanking() {
  try {
    const response = await dictionaryStatsRequest({
      method: 'get',
      url: env.DICTIONARY_MISSING_SIGNS_URL,
      responseType: 'json',
      transformResponse: [(data) => Array.from(JSON.parse(data).signsRanking, (x) => x.name)],
    });

    return response.data;
  } catch (error) {
    throw new Error(`SignsListRequestError: ${error.message}`);
  }
};

const signsSuggestorDaemon = async function wikilibrasSignsSuggestorDaemon() {
  setInterval(async () => {
    try {
      const signs = await getMissingSigns();
      const userID = await whoAmIOnWikilibras();

      const promisesList = [];
      for (let i = 0; i < signs.length; i += 1) {
        promisesList.push(postNewTaskOnWikilibras(signs[i], userID));
      }

      await Promise.all(promisesList);
    } catch (error) {
      serverWarning(error.message);
    }
  }, env.SIGNS_SUGGESTION_INTERVAL);
};

export default signsSuggestorDaemon;
