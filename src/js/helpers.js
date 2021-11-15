import { TIMEOUT_SECONDS } from './config';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    let result = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    let data = await result.json();
    if (!result.ok) throw new Error(`${data.message} ${result.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadRecipe) {
  try {
    let result = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadRecipe),
      }),
      timeout(TIMEOUT_SECONDS),
    ]);
    let data = await result.json();
    if (!result.ok) throw new Error(`${data.message} ${result.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};
