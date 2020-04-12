import axios from "axios";
import env from "../../config/environment";
import { authenticateSuggestorOnWikilibras } from "./wikilibrasAuthentication";
import { forEach } from "lodash";

const wikiTranslationRequests = axios.create({
  baseURL: env.WIKILIBRAS_BASE_URL,
  method: "POST",
  timeout: 10000,
});

wikiTranslationRequests.interceptors.response.use(null, async (error) => {
  if (error.config && error.response && error.response.status === 401) {
    const authToken = await authenticateSuggestorOnWikilibras();
    wikiTranslationRequests.defaults.headers.common.Authorization = authToken;
    return wikiTranslationRequests.request(error.config);
  }
  return Promise.reject(error);
});

const postNewTaskOnWikilibras = async (taskData) => {
  try {
    await wikiTranslationRequests({
      url: "/new-task",
      data: taskData,
    });
  } catch (err) {
    console.log(err.message + taskData.description);
  }
};

export { postNewTaskOnWikilibras };
