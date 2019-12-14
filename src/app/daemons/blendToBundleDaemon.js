import util from 'util';
import { exec } from 'child_process';
import env from '../../config/environment';
import { daemonInfo, daemonError } from '../util/debugger';
import {
  getPublisherIdOnWikilibras,
  getAvailableTasksOnWikilibras,
  setUserTaskOnWikilibras,
  getPendingTasksOnWikilibras,
  getTaskHistoryOnWikilibras,
  getObjectOnWikilibras,
  downloadBlendOnWikilibras,
} from '../util/wikilibrasPublisherRequests';

const execp = util.promisify(exec);

const blendToBundleDaemon = async function blendToBundleConversorDaemon() {

  try {
    daemonInfo('Testing Wikilibras');
    const publisherId = await getPublisherIdOnWikilibras();
    const availableTasks = await getAvailableTasksOnWikilibras(publisherId);

    // const availableTasksPList = [];
    // for (let i = 0; i < availableTasks.length; i += 1) {
    //   availableTasksPList.push(setUserTaskOnWikilibras(publisherId, availableTasks[i].task_id));
    // }

    // await Promise.all(availableTasksPList);

    // await setUserTaskOnWikilibras(publisherId, availableTasks[0].task_id); // remove

    const pendingTasks = await getPendingTasksOnWikilibras(publisherId);

    // const pendingTasksPList = [];
    // for (let i = 0; i < pendingTasks.length; i += 1) {
    //   pendingTasksPList.push(getTaskHistoryOnWikilibras(publisherId, pendingTasks[i].task_id));
    // }

    // await Promise.all(pendingTasksPList);

    const taskHistory = await getTaskHistoryOnWikilibras(pendingTasks[1].task_id); // remove
    const object = await getObjectOnWikilibras(taskHistory.task_actions_id);
    await downloadBlendOnWikilibras(object.path);
  } catch (error) {
    daemonError(error.message);
  }

  // setInterval(async () => {
  // try {
  //   daemonInfo('Building new signs from Wikilibras');
  //   await execp(
  //     `${env.UNITY_CMD} ${env.FBX_BUILD_PARAM}`,
  //     { timeout: Number(env.SIGNS_BUILD_TIMEOUT), killSignal: 'SIGKILL' },
  //   );

  //   await execp(
  //     `${env.UNITY_CMD} ${env.BUNDLE_BUILD_PARAM}`,
  //     { timeout: Number(env.SIGNS_BUILD_TIMEOUT), killSignal: 'SIGKILL' },
  //   );
  // } catch (error) {
  //   if (error.killed) {
  //     daemonError('', `${error.message} received signal ${error.signal}`);
  //   } else {
  //     daemonError('', `${error.message} exited with exit code ${error.code}`);
  //   }
  // }
  // }, env.SIGNS_BUILD_INTERVAL);
};

export default blendToBundleDaemon;
