const { Bot } = require('./bot');

const username = 'user';
const password = 'pass';

const mainTimeout = 10000;
const errTimeout = 60000;

let instaBot = new Bot(username, password);
instaBot.login();

setTimeout(() => {
  if (instaBot.isLoggedIn) {
    try {
      instaBot.like('travel');
    } catch (err) {
      instaBot.closeBrowser();
      setTimeout(() => {
        instaBot = new Bot(username, password);
        instaBot.login();
      }, errTimeout);
    }
  } else {
    instaBot.closeBrowser();
    setTimeout(() => {
      instaBot = new Bot(username, password);
      instaBot.login();
    }, errTimeout);
  }
}, mainTimeout);
