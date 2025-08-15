import moment from 'moment';
import jsonfile from 'jsonfile';
import simpleGit from 'simple-git';
import random from 'random';

const path = './data.json';

// Hàm kiểm tra ngày hợp lệ, tránh commit vào ngày trung lập
const isValidDate = (date) => {
  const startDate = moment('2025-08-18');
  const endDate = moment('2025-12-24');
  // Tránh commit vào ngày Chủ nhật (0) hoặc Thứ 7 (6) để tránh trung lập
  const dayOfWeek = date.day();
  if (dayOfWeek === 0 || dayOfWeek === 6) return false;
  return date.isBetween(startDate, endDate, null, '[]');
};

// Hàm tạo commit với message và ngày chỉ định
const markCommit = async (date, message) => {
  const dataToWrite = { date: date.toISOString() };
  await jsonfile.writeFile(path, dataToWrite);
  const git = simpleGit();
  await git.add([path]);
  await git.commit(message, { '--date': date.toISOString() });
};

// Hàm tạo nhiều commit nhanh, tránh trùng ngày
const handleFastCommits = async (
  message = 'Road to Vy',
  commitsPerBatch = 50
) => {
  const git = simpleGit();
  const usedDates = new Set();

  // Tạo danh sách tất cả các ngày hợp lệ trong khoảng
  const startDate = moment('2025-08-18');
  const endDate = moment('2025-12-24');
  let allValidDates = [];
  let cur = startDate.clone();
  while (cur.isSameOrBefore(endDate)) {
    if (isValidDate(cur)) {
      allValidDates.push(cur.clone());
    }
    cur.add(1, 'day');
  }

  // Shuffle danh sách ngày hợp lệ để random
  for (let i = allValidDates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allValidDates[i], allValidDates[j]] = [allValidDates[j], allValidDates[i]];
  }

  let idx = 0;
  while (idx < allValidDates.length) {
    const batch = [];
    for (
      let i = 0;
      i < commitsPerBatch && idx < allValidDates.length;
      i++, idx++
    ) {
      const date = allValidDates[idx];
      batch.push(markCommit(date, message));
      usedDates.add(date.format('YYYY-MM-DD'));
    }
    await Promise.all(batch);
    await git.push();
    console.log(`Đã tạo và đẩy ${batch.length} commit!`);
  }
  console.log('Đã hết ngày hợp lệ để commit!');
};

handleFastCommits('💙Road to Yen Vy💙', 100);
