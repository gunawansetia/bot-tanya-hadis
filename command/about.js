const { tentangKami } = require("../message/intro");

const about = (ctx) => {
  ctx.reply(tentangKami, {
    reply_to_message_id: ctx.message.message_id,
  });
};

module.exports = { about };
