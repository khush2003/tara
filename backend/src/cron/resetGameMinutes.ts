import { User } from '../models/user.model.ts';
import { CronJob } from 'cron';

async function enqueueGameResetInBatches(batchSize: number) {
  console.log('Starting batch job to reset game minutes');
  let usersProcessed = 0;
  let errorCount = 0;

  while (true) {
    console.log(`Processing users from ${usersProcessed}`);
    const users = await User.find().skip(usersProcessed).limit(batchSize);
    if (users.length === 0) {
      console.log('All users processed');
      break;
    }

    const userIds = users.map(user => user._id);
    if (errorCount <= 1) {
      try {
        await User.updateMany({ _id: { $in: userIds } }, { $set: { 'game_profile.game_minutes_left': 60 } });
        console.log(`Updated ${users.length} users`);
        usersProcessed += users.length;
      } catch (error) {
        console.log(`Error updating users, Retrying in 2 seconds: ${error}`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        errorCount++;
      }
    } else {
      errorCount = 0;
      usersProcessed += users.length;
    }
  }
}

const job = new CronJob('0 0 * * *', () => {
  console.log('Scheduled job to reset game minutes started');
  enqueueGameResetInBatches(50);
});

export { job };