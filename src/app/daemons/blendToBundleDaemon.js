import util from 'util';
import { exec } from 'child_process';
import env from '../../config/environment';
import { daemonInfo, daemonError } from '../util/debugger';

const execp = util.promisify(exec);

const blendToBundleDaemon = async function blendToBundleConversorDaemon() {
  setInterval(async () => {
    try {
      daemonInfo('Building new signs from Wikilibras');
      await execp(
        `${env.UNITY_CMD} ${env.FBX_BUILD_PARAM}`,
        { timeout: Number(env.SIGNS_BUILD_TIMEOUT), killSignal: 'SIGKILL' },
      );

      await execp(
        `${env.UNITY_CMD} ${env.BUNDLE_BUILD_PARAM}`,
        { timeout: Number(env.SIGNS_BUILD_TIMEOUT), killSignal: 'SIGKILL' },
      );
    } catch (error) {
      if (error.killed) {
        daemonError('', `${error.message} received signal ${error.signal}`);
      } else {
        daemonError('', `${error.message} exited with exit code ${error.code}`);
      }
    }
  }, env.SIGNS_BUILD_INTERVAL);
};

export default blendToBundleDaemon;
