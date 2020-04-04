import { daemonError, daemonInfo } from "../util/debugger";
import { getTranslationsWithoutReview } from "../util/statsApiRequests";
import { postTranslations } from "../util/wikilibrasTranslateSuggestorRequests";

const translationDaemon = async () => {
  daemonInfo("Searching for new sentences for wikilibras");
  try {
    const data = await getTranslationsWithoutReview();
    await postTranslations(data);
  } catch (error) {
    daemonError(`TranslateDaemonError: ${error.message}`);
  }
};

export default translationDaemon;
