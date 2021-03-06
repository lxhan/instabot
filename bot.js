const { Builder, By, Key, until } = require('selenium-webdriver');

class Bot {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.isLoggedIn = false;
    this.timeout = 50000;
    this.checkUrl = 'https://www.instagram.com/';
    this.url = 'https://www.instagram.com/accounts/login/?source=auth_switcher';
    this.hashtagUrl = 'https://www.instagram.com/explore/tags';
    this.driver = new Builder().forBrowser('chrome').build();
    this.linkRegEx = /^https:\/\/www\.instagram\.com\/p\/[a-zA-z0-9_-]+\/$/;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  async login() {
    try {
      await this.driver.get(this.url).catch(err => console.log(err));

      await this.driver
        .wait(
          until.elementLocated(
            By.xpath('//input[@name="username"]'),
            this.timeout
          )
        )
        .then(el => el.sendKeys(this.username));

      await this.driver
        .wait(
          until.elementLocated(
            By.xpath('//input[@name="password"]'),
            this.timeout
          )
        )
        .then(el => el.sendKeys(this.password, Key.RETURN));

      await this.driver
        .wait(until.elementLocated(By.className('HoLwm'), this.timeout))
        .then(el => el.click())
        .then(() => (this.isLoggedIn = true));
    } catch (err) {
      this.isLoggedIn = false;
    }
  }

  async like(hashtag) {
    const rand = this.getRandomInt(10, 30);
    const randTime = this.getRandomInt(30, 50);
    await this.driver.get(`${this.hashtagUrl}/${hashtag}`).then(async () => {
      for (let i = 0; i < rand; i++) {
        await this.driver.executeScript(
          `window.scrollTo(0, document.body.scrollHeight)`
        );
        await this.driver.sleep(3000);
      }
    });

    const els = await this.driver.wait(
      until.elementsLocated(By.css('a')),
      this.timeout
    );

    await Promise.all(els.map(async el => await el.getAttribute('href')))
      .then(vals => vals.filter(val => this.linkRegEx.test(val)))
      .then(async links => {
        for (let link of links) {
          await this.driver.get(link).catch(err => console.log(err));
          await this.driver
            .wait(
              until.elementLocated(
                By.xpath('//span[@aria-label="Like"]'),
                this.timeout
              )
            )
            .then(async el => {
              await this.driver.sleep(randTime * 1000);
              await el.click();
            });
        }
      });
  }

  closeBrowser() {
    this.driver.quit();
  }
}

module.exports = { Bot };
