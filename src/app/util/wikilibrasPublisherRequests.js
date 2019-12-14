import fs from 'fs';
import path from 'path';
import axios from 'axios';
import env from '../../config/environment';
import { authenticatePublisherOnWikilibras } from './wikilibrasAuthentication';

const axiosRequest = axios.create({
  baseURL: env.WIKILIBRAS_BASE_URL,
  timeout: 10000,
});

axiosRequest.interceptors.response.use(null, async (error) => {
  if (error.config && error.response && error.response.status === 401) {
    const requestConfig = error.config;
    requestConfig.headers.Authorization = await authenticatePublisherOnWikilibras();
    return axiosRequest.request(requestConfig);
  }
  return Promise.reject(error);
});

const getPublisherIdOnWikilibras = async function getPublisherIdOnWikilibrasServer() {
  try {
    const response = await axiosRequest({
      method: 'get',
      url: env.WIKILIBRAS_WHOAMI_URL,
      transformResponse: [(data) => JSON.parse(data).user_id],
    });

    return response.data;
  } catch (error) {
    throw new Error(`WikilibrasPublisherIdRequestError: ${error.message}`);
  }
};

const getAvailableTasksOnWikilibras = async function getAvailableTasksOnWikilibrasServer(userID) {
  try {
    const response = await axiosRequest({
      method: 'get',
      url: `${env.WIKILIBRAS_AVAILABLE_TASKS_URL}/${userID}`,
      transformResponse: [(data) => JSON.parse(data).data],
    });
    return response.data;
  } catch (error) {
    throw new Error(`WikilibrasAvailableTasksError: ${error.message}`);
  }
};

const setUserTaskOnWikilibras = async function setUserTaskOnWikilibrasServer(userID, taskID) {
  try {
    const updateUserTaskURL = `${env.WIKILIBRAS_USER_TASK_URL}/${taskID}`;
    await axiosRequest.put(updateUserTaskURL, { current_user_id: userID });
  } catch (error) {
    throw new Error(`WikilibrasSetUserTaskRequestError: ${error.message}`);
  }
};

const getPendingTasksOnWikilibras = async function getPendingTasksOnWikilibrasServer(userID) {
  try {
    const response = await axiosRequest({
      method: 'get',
      url: `${env.WIKILIBRAS_PENDING_TASKS_URL}/${userID}`,
      transformResponse: [(data) => JSON.parse(data).data],
    });
    return response.data;
  } catch (error) {
    throw new Error(`WikilibrasPendingTasksError: ${error.message}`);
  }
};

const getTaskHistoryOnWikilibras = async function getTaskHistoryOnWikilibrasServer(taskID) {
  try {
    const response = await axiosRequest.get(`${env.WIKILIBRAS_TASK_HISTORY_URL}/${taskID}`);
    for (const action of response.data) {
      if (action.action_type_id === 7) {
        return action;
      }
    }
    return {};
  } catch (error) {
    throw new Error(`WikilibrasTaskHistoryError: ${error.message}`);
  }
};

const getObjectOnWikilibras = async function getObjectOnWikilibrasServer(actionTypesID) {
  try {
    const response = await axiosRequest.get(`${env.WIKILIBRAS_OBJECT_URL}/${actionTypesID}`);
    return response.data[0];
  } catch (error) {
    throw new Error(`WikilibrasObjectError: ${error.message}`);
  }
};

const downloadBlendOnWikilibras = async function downloadBlendOnWikilibrasServer(blendURLPath) {
  try {
    const response = await axiosRequest({
      method: 'get',
      url: `${env.WIKILIBRAS_DOWNLOAD_URL}/${blendURLPath}`,
      responseType: 'stream',
    });

    const localBlendFilePath = path.join(env.BLEND_FILES_TMP_DIR, path.basename(blendURLPath));

    await fs.promises.mkdir(path.dirname(localBlendFilePath), { recursive: true });

    const streamWriter = fs.createWriteStream(localBlendFilePath);
    response.data.pipe(streamWriter);

    return new Promise((resolve, reject) => {
      streamWriter.on('finish', () => {
        resolve(localBlendFilePath);
      });
      streamWriter.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    throw new Error(`WikilibrasDownloadBlendError: ${error.message}`);
  }
};

export {
  getPublisherIdOnWikilibras,
  getAvailableTasksOnWikilibras,
  setUserTaskOnWikilibras,
  getPendingTasksOnWikilibras,
  getTaskHistoryOnWikilibras,
  getObjectOnWikilibras,
  downloadBlendOnWikilibras,
};
