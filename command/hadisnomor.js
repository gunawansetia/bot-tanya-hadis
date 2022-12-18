let { dataKitabBabHadis } = require("../bot");

const hadisnomor = (ctx) => {
  let input = ctx.message.text.split("/hadisnomor ");
  if (input.length <= 1) {
    ctx.reply("Anda harus memberi nomor hadis pada argumen ke-2", {
      reply_to_message_id: ctx.message.message_id,
    });
    return;
  }

  let kitabMessage = "HR. Sahih Bukhari " + input[1] + "\n\n";
  let errorMessage = "HR. Sahih Bukhari " + input[1] + " tidak ditemukan";
  let statusMessage = false;
  dataKitabBabHadis.forEach((item) => {
    let idHadis = item.hadis_id;
    let hadis_id = idHadis.toString();
    if (hadis_id === input[1]) {
      kitabMessage += `${item.hadis_arab}. \n\n${item.hadis_terjemahan}`;
      statusMessage = true;
      return;
    }
  });
  if (statusMessage === true) {
    ctx.reply(kitabMessage, {
      reply_to_message_id: ctx.message.message_id,
    });
  } else {
    ctx.reply(errorMessage, {
      reply_to_message_id: ctx.message.message_id,
    });
  }
};

module.exports = { hadisnomor };
