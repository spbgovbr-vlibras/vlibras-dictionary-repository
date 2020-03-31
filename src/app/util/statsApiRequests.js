import axios from "axios";
import env from "../../config/environment";

const statsRequest = axios.create({
  baseURL: env.TRANSLATE_STATS_BASE_URL,
  method: "GET",
  timeout: 10000
});

const getTranslationsWithoutReview = async () => {
  const query = `${env.REVIEW_STATS_URL}?review=false`;

  try {
    const response = await statsRequest({
      url: query,
      transformResponse: [data => JSON.parse(data).reviewRanking]
    });
    return response.data;
  } catch (error) {
    throw new Error(`statsApiRequestWithouReview: ${error.message}`);
  }
};

const getTranslationsWithBadReview = () => {};

export { getTranslationsWithoutReview, getTranslationsWithBadReview };
