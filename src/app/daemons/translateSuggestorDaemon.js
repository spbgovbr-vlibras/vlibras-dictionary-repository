import { getTranslationsWithoutReview } from "../util/statsApiRequests";
import { daemonError, daemonInfo } from "./debugger";

const translateDaemon = async () => {
  daemonInfo("Searching for new sentences for wikilibras");
  try {
    const data = await getTranslationsWithoutReview();
  } catch (error) {
    daemonError(`TranslateDaemonError: ${error.message}`);
  }
};

export default translateDaemon;
