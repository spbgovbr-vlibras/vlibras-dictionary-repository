import axios from 'axios';
import env from '../../config/environment';
import { authenticateSuggestorOnWikilibras } from './wikilibrasAuthentication';

const axiosRequest = axios.create({
  baseURL: env.WIKILIBRAS_BASE_URL,
  timeout: 10000,
});

axiosRequest.interceptors.response.use(null, async (error) => {
  if (error.config && error.response && error.response.status === 401) {
    const authToken = await authenticateSuggestorOnWikilibras();
    axiosRequest.defaults.headers.common.Authorization = authToken;
    return axiosRequest.request(error.config);
  }
  return Promise.reject(error);
});

const getSuggestorIdOnWikilibras = async function getSuggestorIdOnWikilibrasServer() {
  try {
    const response = await axiosRequest({
      method: 'get',
      url: env.WIKILIBRAS_WHOAMI_URL,
      transformResponse: [(data) => JSON.parse(data).user_id],
    });

    return response.data;
  } catch (error) {
    throw new Error(`WikilibrasSuggestorIdRequestError: ${error.message}`);
  }
};

const postNewTaskOnWikilibras = async function postNewTaskOnWikilibrasServer(taskData) {
  try {
    const response = await axiosRequest({
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
    await axiosRequest.post(env.WIKILIBRAS_NEWACTION_URL, actionData);
  } catch (error) {
    throw new Error(`WikilibrasNewActionRequestError: ${error.message}`);
  }
};

const resetUserTaskOnWikilibras = async function resetUserTaskOnWikilibrasServer(taskID) {
  try {
    const updateUserTaskURL = `${env.WIKILIBRAS_USER_TASK_URL}/${taskID}`;
    await axiosRequest.put(updateUserTaskURL, { current_user_id: null });
  } catch (error) {
    throw new Error(`WikilibrasResetUserTaskRequestError: ${error.message}`);
  }
};

export {
  getSuggestorIdOnWikilibras,
  postNewTaskOnWikilibras,
  postNewActionOnWikilibras,
  resetUserTaskOnWikilibras,
};
