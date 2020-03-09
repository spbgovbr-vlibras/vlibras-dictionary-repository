import { forEach } from "lodash";
import cron from "node-cron";

const tasks = [];

export const createNewJob = (schedule, task) => {
  console.log(`new task added: ${schedule}`);

  tasks.push({ schedule, task });
};

export const runAllJobs = () => {
  console.log(`Number of tasks ${tasks.length}`);

  forEach(tasks, ({ schedule, task }) => {
    cron.schedule(schedule, task);
  });
};
