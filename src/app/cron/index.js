import Agenda from "agenda";
import { forEach } from "lodash";
import { promisify } from "util";

import env from "../../config/environment";
import { daemonError } from "../util/debugger";

const exec = promisify(require("child_process").exec);
const tasks = [];

const connectionString = env.MONGO_CONNECTION_STRING + env.DATABASE;

export const createNewJob = (schedule, description, task) => {
  tasks.push({ schedule, description, task });
};

export const runAllJobs = async () => {
  try {
    await exec(`mongo ${env.DATABASE} --eval "db.dropDatabase()" --quiet`);
  } catch (e) {
    daemonError(e);
  }

  const agenda = new Agenda({
    db: {
      address: connectionString,
      options: { useUnifiedTopology: false }
    },
    processEvery: env.PROCESS_EVERY
  });

  forEach(tasks, ({ description, task }) => {
    agenda.define(description, task);
  });

  await new Promise(resolve => agenda.once("ready", resolve));

  forEach(tasks, async ({ schedule, description }) => {
    await agenda.every(schedule, description);
  });

  agenda.start();
};
