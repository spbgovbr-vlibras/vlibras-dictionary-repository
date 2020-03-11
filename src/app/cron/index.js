import { forEach } from 'lodash';
import Agenda from 'agenda';

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const tasks = [];

const mongoConnectionString =
  'mongodb://127.0.0.1/agenda?useUnifiedTopology=true';

async function dropBeforeStart() {
  const res = await exec('mongo agenda --eval "db.dropDatabase()" --quiet');
  return { res };
}

export const createNewJob = (schedule, description, task) => {
  tasks.push({ schedule, description, task });
};

export const runAllJobs = async () => {
  await dropBeforeStart();

  const agenda = new Agenda({
    db: { address: mongoConnectionString },
    processEvery: '1 second',
  });

  forEach(tasks, async ({ description, task }) => {
    agenda.define(description, task);
  });

  await new Promise((resolve) => agenda.once('ready', resolve));

  forEach(tasks, async ({ schedule, description }) => {
    await agenda.every(schedule, description);
  });

  agenda.start();
};
