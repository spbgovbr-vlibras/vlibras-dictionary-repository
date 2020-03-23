import { promises as fsPromises } from "fs";
import path from "path";
import util from "util";
import { exec } from "child_process";
import Agenda from "agenda";
import env from "../../config/environment";
import { daemonInfo, daemonError } from "../util/debugger";

import { differenceWith, isEqual } from "lodash";

import {
  getPublisherIdOnWikilibras,
  getAvailableTasksOnWikilibras,
  setUserTaskOnWikilibras,
  getPendingTasksOnWikilibras,
  getTaskHistoryOnWikilibras,
  getObjectOnWikilibras,
  downloadBlendOnWikilibras,
  postNewActionOnWikilibras,
  updateTaskStateOnWikilibras
} from "../util/wikilibrasPublisherRequests";

const execp = util.promisify(exec);

var agenda = null;
var blendObjects = [];
var publisherId = -1;
var taskRunning = false;
const signsToBuild = [];

const getBlendObjects = async function getBlendObjectsFromWikilibras(
  wikilibrasUserID
) {
  const availableTasks = await getAvailableTasksOnWikilibras(wikilibrasUserID);

  const setUserTasksPList = [];
  for (const availableTask of availableTasks) {
    setUserTasksPList.push(
      setUserTaskOnWikilibras(wikilibrasUserID, availableTask.task_id)
    );
  }
  await Promise.all(setUserTasksPList);

  const pendingTasks = await getPendingTasksOnWikilibras(wikilibrasUserID);

  const getTaskHistoryPList = [];
  for (const pendingTask of pendingTasks) {
    getTaskHistoryPList.push(getTaskHistoryOnWikilibras(pendingTask.task_id));
  }

  const tasksHistories = await Promise.all(getTaskHistoryPList);

  const getObjectPList = [];
  for (const taskHistory of tasksHistories) {
    getObjectPList.push(getObjectOnWikilibras(taskHistory.task_actions_id));
  }

  const tasksObjects = await Promise.all(getObjectPList);

  const blendObjects = pendingTasks.map((task, i) => ({
    task_id: task.task_id,
    filePath: tasksObjects[i].path
  }));

  const downloadBlendPList = [];
  for (const blendObject of blendObjects) {
    downloadBlendPList.push(
      downloadBlendOnWikilibras(blendObject.task_id, blendObject.filePath)
    );
  }

  const blendFiles = await Promise.all(downloadBlendPList);
  return blendFiles;
};

const buildSignFromBlend = async function buildSignFromBlendFile() {
  try {
    await execp(`${env.UNITY_CMD} ${env.BUNDLE_BUILD_PARAM}`, {
      timeout: Number(env.SIGNS_BUILD_TIMEOUT),
      killSignal: "SIGKILL"
    });
    await execp(`${env.UNITY_CMD} ${env.CLEAN_TRASH_PARAM}`, {
      timeout: Number(env.SIGNS_BUILD_TIMEOUT),
      killSignal: "SIGKILL"
    });
  } catch (error) {
    if (error.killed) {
      daemonError("", `${error.message} received signal ${error.signal}`);
    } else {
      daemonError("", `${error.message} exited with exit code ${error.code}`);
    }
  }
};

const publishResult = async function publishResulToWikilibras(
  userID,
  taskID,
  result
) {
  try {
    await postNewActionOnWikilibras({
      action_type_id: 19,
      details: "no detail",
      success: result,
      task_id: taskID,
      user_id: userID
    });
    await updateTaskStateOnWikilibras(taskID);
    await setUserTaskOnWikilibras(null, taskID);
  } catch (error) {
    throw new Error(error.message);
  }
};

const removeAlreadyQueued = function removeAlreadyQueuedSigns(
  queuedSigns,
  signsList
) {
  try {
    return differenceWith(signsList, queuedSigns, isEqual);
  } catch (error) {
    throw new Error(error.message);
  }
};

const setSignsToBuild = async () => {
  daemonInfo("Checking for BlendObjects");

  publisherId = await getPublisherIdOnWikilibras();
  blendObjects = await getBlendObjects(publisherId);

  const signsQueue = removeAlreadyQueued(signsToBuild, blendObjects);

  signsToBuild.push(...signsQueue);
};

const generateBundles = async () => {
  if (taskRunning || signsToBuild.length <= 0) {
    if (taskRunning && signsToBuild.length > 0)
      daemonInfo(`Remaining signsToBuild ${signsToBuild.length}`);
    return;
  }
  daemonInfo("Building new signs from Wikilibras");
  taskRunning = true;
  try {
    daemonInfo(`Building Bundle from ${path.basename(signsToBuild[0].file)}`);

    const pathToMove = path.join(
      env.INPUT_BLEND_FOLDER,
      path.basename(signsToBuild[0].file)
    );

    await fsPromises.rename(signsToBuild[0].file, pathToMove);
    await buildSignFromBlend();
    await publishResult(publisherId, signsToBuild[0].id, true);
  } catch (error) {
    daemonError(error.message);
    await publishResult(publisherId, signsToBuild[0].id, false);
  } finally {
    signsToBuild.shift();
    taskRunning = false;
  }
};

const setupAndStart = async () => {
  try {
    await execp(
      `mongo ${env.BLEND_TO_BUNDLE_DATABASE} --eval "db.dropDatabase()" --quiet`
    );
  } catch (e) {
    daemonError(e);
  }

  agenda = new Agenda({
    db: {
      address: env.MONGO_CONNECTION_STRING + env.BLEND_TO_BUNDLE_DATABASE,
      options: { useUnifiedTopology: false }
    },
    processEvery: env.PROCESS_EVERY
  });

  agenda.define("setSignsToBuild", setSignsToBuild);
  agenda.define("generateBundles", generateBundles);

  await new Promise(resolve => agenda.once("ready", resolve));

  await agenda.every(env.CRON_SIGNS_BUILD_INTERVAL, "setSignsToBuild");
  await agenda.every(env.CRON_BUILD_BUNDLES, "generateBundles");

  await agenda.start();
};

export default setupAndStart;
