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

const postTranslations = async (sentencesToSuggest) => {
  const errors = [];

  forEach(sentencesToSuggest, async (item) => {
    const data = {
      task_type_id: 3,
      task_state_id: 13,
      code: item.text,
      description: item.translation,
      example: item.review,
      creation_user_id: 5,
      current_user_id: null,
    };

    if (item.review !== "") data.task_state_id = 14;

    try {
      console.log("Making request...");

      await wikiTranslationRequests({
        url: "/new-task",
        data,
      });
    } catch (err) {
      console.log(err.message);
      errors.push(item);
    }
  });

  return errors;
};

export { postTranslations };
