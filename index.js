import moment from 'moment';
import jsonfile from 'jsonfile';
import simpleGit from 'simple-git';
import random from 'random';

const path = './data.json';

// Sửa lỗi chính tả: isValidDate
const isValidDate = (date) => {
  const startDate = moment('2025-08-18');
  const endDate = moment('2025-12-24');
  return date.isBetween(startDate, endDate, null, '[]');
};

// Cho phép chủ động nội dung commit message
const markCommit = async (date, message) => {
  const dataToWrite = { date: date.toISOString() };
  await jsonfile.writeFile(path, dataToWrite);
  const git = simpleGit();
  await git.add([path]);
  await git.commit(message, { '--date': date.toISOString() });
};

const handleMakeCommit = async (numberOfCommit, message = 'Road to Vy') => {
  const git = simpleGit();
  for (let i = 0; i < numberOfCommit; i++) {
    const randomWeeks = random.int(0, 54 * 4);
    const randomDays = random.int(0, 6);
    const randomDate = moment('2025-08-15')
      .add(randomWeeks, 'weeks')
      .add(randomDays, 'days');
    if (isValidDate(randomDate)) {
      console.log(
        `Creating commit: ${randomDate.toISOString()} with message: "${message}"`
      );
      await markCommit(randomDate, message);
    } else {
      console.log(`Invalid date: ${randomDate.toISOString()} skipping...`);
    }
  }
  console.log('Pushing all commits');
  await git.push();
};

handleMakeCommit(240, '💙Road to Yen Vy💙');
