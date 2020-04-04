import axios from "axios";
import env from "../../config/environment";
import { map } from "lodash";

const statsRequest = axios.create({
  baseURL: env.TRANSLATE_STATS_BASE_URL,
  method: "GET",
  timeout: 10000
});

const getTranslationsWithoutReview = async () => {
  const query = `${env.REVIEW_STATS_URL}${env.STATS_API_QUERY}`;

  try {
    const response = await statsRequest({
      url: query,
      transformResponse: [
        data =>
          map(JSON.parse(data).reviewRanking, element => element.translation)
      ]
    });
    return response.data;
  } catch (error) {
    throw new Error(`statsApiRequestWithoutReview: ${error.message}`);
  }
};

export { getTranslationsWithoutReview };
