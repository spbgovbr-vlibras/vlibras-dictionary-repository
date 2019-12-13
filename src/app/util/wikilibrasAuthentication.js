import axios from 'axios';
import env from '../../config/environment';

const axiosRequest = axios.create({
  baseURL: env.WIKILIBRAS_BASE_URL,
  timeout: 10000,
});

const authenticateOnWikilibras = async function authenticateOnWikilibrasServer(email, password) {
  try {
    const response = await axiosRequest({
      method: 'post',
      url: env.WIKILIBRAS_AUTHENTICATON_URL,
      data: { email, password },
      transformResponse: [(data) => `${JSON.parse(data).type} ${JSON.parse(data).token}`],
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const authenticateSuggestorOnWikilibras = async function authenticateSuggestorOnWikilibrasServer() {
  return authenticateOnWikilibras(
    env.WIKILIBRAS_SUGGESTOR_EMAIL,
    env.WIKILIBRAS_SUGGESTOR_PASSWORD,
  );
};

const authenticatePublisherOnWikilibras = async function authenticatePublisherOnWikilibrasServer() {
  return authenticateOnWikilibras(
    env.WIKILIBRAS_PUBLISHER_EMAIL,
    env.WIKILIBRAS_PUBLISHER_PASSWORD,
  );
};

export {
  authenticateSuggestorOnWikilibras,
  authenticatePublisherOnWikilibras,
};
