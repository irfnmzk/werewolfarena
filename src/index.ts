import Bot from './line/linebot';

const bot = new Bot();

bot.listen();

bot.on('message', data => {
  console.log(data);
});
