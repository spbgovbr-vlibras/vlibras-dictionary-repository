import axios from 'axios';
import env from '../../config/environment';

const wikilibrasRequest = axios.create({
  baseURL: env.WIKILIBRAS_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const authenticateOnWikilibras = async function authenticateOnWikilibrasServer() {
  try {
    const response = await wikilibrasRequest({
      method: 'post',
      url: env.WIKILIBRAS_AUTHENTICATON_URL,
      data: {
        email: env.WIKILIBRAS_USER_EMAIL,
        password: env.WIKILIBRAS_PASSWORD,
      },
      transformResponse: [(data) => `${JSON.parse(data).type} ${JSON.parse(data).token}`],
    });

    return response.data;
  } catch (error) {
    throw new Error(`WikilibrasAuthRequestError: ${error.message}`);
  }
};

const whoAmIOnWikilibras = async function whoAmIOnWikilibrasServer(bearerToken) {
  try {
    const response = await wikilibrasRequest({
      method: 'post',
      url: env.WIKILIBRAS_WHOAMI_URL,
      headers: { Authorization: bearerToken },
      transformResponse: [(data) => JSON.parse(data).user_id],
    });

    return response.data;
  } catch (error) {
    throw new Error(`WikilibrasWhoAmIRequestError: ${error.message}`);
  }
};

const postNewTaskOnWikilibras = async function postNewTaskOnWikilibrasServer(taskData) {
  try {
    const response = await wikilibrasRequest({
      method: 'post',
      url: env.WIKILIBRAS_NEWTASK_URL,
      data: taskData,
      transformResponse: [(data) => JSON.parse(data).id],
    });

    return response.data;
  } catch (error) {
    throw new Error(`WikilibrasNewTaskRequestError: ${error.message}`);
  }
};

const postNewActionOnWikilibras = async function postNewActionOnWikilibrasServer(actionData) {
  try {
    await wikilibrasRequest.post(env.WIKILIBRAS_NEWACTION_URL, actionData);
  } catch (error) {
    throw new Error(`WikilibrasNewActionRequestError: ${error.message}`);
  }
};

const resetTaskUserOnWikilibras = async function resetTaskUserOnWikilibrasServer(taskID) {
  try {
    const resetTaskUserURL = `${env.WIKILIBRAS_TASK_USER_URL}/${taskID}`;
    await wikilibrasRequest.put(resetTaskUserURL, { current_user_id: null });
  } catch (error) {
    throw new Error(`WikilibrasResetTaskUserRequestError: ${error.message}`);
  }
};

export {
  authenticateOnWikilibras,
  whoAmIOnWikilibras,
  postNewTaskOnWikilibras,
  postNewActionOnWikilibras,
  resetTaskUserOnWikilibras,
};
