const { Telegraf } = require("telegraf");
const { Pagination } = require("telegraf-pagination");

const bot = new Telegraf("");

const mysql = require("mysql");
const { intro, helpMessage } = require("./message/intro");
const { about } = require("./command/about");

const conn = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: ",
});

conn.connect(function (err) {
  if (err) {
    throw err;
  }

  console.log("connected !");
  conn.query(
    "SELECT kitab_bab_hadis.kitab_id, kitabs.kitab_nama, babs.bab_kode, babs.bab_nama, hadiss.hadis_id, hadiss.hadis_arab, hadiss.hadis_terjemahan FROM kitab_bab_hadis JOIN kitabs ON kitab_bab_hadis.kitab_id=kitabs.kitab_id JOIN babs ON kitab_bab_hadis.bab_kode=babs.bab_kode JOIN hadiss ON kitab_bab_hadis.hadis_id=hadiss.hadis_id",
    function (err, result, fields) {
      if (err) {
        throw err;
      }
      dataKitabBabHadis = [];

      result.forEach((item) => {
        dataKitabBabHadis.push({
          kitab_id: item.kitab_id,
          kitab_nama: item.kitab_nama,
          bab_id: item.bab_id,
          bab_kode: item.bab_kode,
          bab_nama: item.bab_nama,
          hadis_id: item.hadis_id,
          hadis_arab: item.hadis_arab,
          hadis_terjemahan: item.hadis_terjemahan,
        });
      });
    }
  );

  conn.query("SELECT * FROM kitabs", function (err, result, fields) {
    if (err) {
      throw err;
    }
    dataKitab = [];

    result.forEach((item) => {
      dataKitab.push({
        kitab_id_k: item.kitab_id,
        kitab_nama_k: item.kitab_nama,
      });
    });
  });

  conn.query(
    "SELECT bab_id, bab_kode, bab_nama FROM babs WHERE bab_kode LIKE '%BSALAT%' ",
    function (err, result, fields) {
      if (err) {
        throw err;
      }
      dataBabSalat = [];

      result.forEach((item) => {
        dataBabSalat.push({
          bab_id_k: item.bab_id,
          bab_kode_k: item.bab_kode,
          bab_nama_k: item.bab_nama,
        });
      });
    }
  );

  conn.query(
    "SELECT bab_id, bab_kode, bab_nama FROM babs WHERE bab_kode LIKE '%BWAKTU2SALAT%' ",
    function (err, result, fields) {
      if (err) {
        throw err;
      }
      dataBabWaktu2Salat = [];

      result.forEach((item) => {
        dataBabWaktu2Salat.push({
          bab_id_k: item.bab_id,
          bab_kode_k: item.bab_kode,
          bab_nama_k: item.bab_nama,
        });
      });
    }
  );
});

bot.start(async (ctx) => {
  await ctx.reply("Halo " + ctx.from.first_name + "\n" + intro, {
    reply_to_message_id: ctx.message.message_id,

    parse_mode: "HTML",
  });
  await ctx.reply(helpMessage);
});

// const message = "Halo Assalamualaikum " + "*"+ctx.from.first_name+"*";
// await bot.telegram.sendMessage(ctx.chat.id, message, {
//   parse_mode : 'MarkdownV2'
// });

bot.command("help", (ctx) => {
  ctx.reply(helpMessage, {
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.command("about", (ctx) => about(ctx));

bot.command("daftarkitabhadis", (ctx) => {
  let kitabMessage =
    "Untuk melihat daftar bab dalam kitab silakan: ketik atau klik /daftarbabsalat dan /daftarbabwaktu2salat\n\nDaftar kitab HR. Sahih Bukhari: \n";

  dataKitab.forEach((item) => {
    kitabMessage += `${item.kitab_id_k}. ${item.kitab_nama_k}\n`;
  });

  bot.telegram.sendMessage(ctx.chat.id, kitabMessage, {
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.command("daftarbabsalat", async (ctx) => {
  const max_size = 4096;
  var start = 0;
  var end = max_size;

  var kitabMessage =
    "Untuk melihat daftar hadis dalam bab silakan: ketik /salatbab (nomor bab). Contoh /salatbab 2\n\nDaftar bab dalam kitab salat: \n";

  dataBabSalat.forEach((item) => {
    kitabMessage += `${item.bab_kode_k.substring(6)}. ${item.bab_nama_k}\n`;
  });

  let kitabMessageSplit = kitabMessage.split("\n");

  let pagination = new Pagination({
    data: kitabMessageSplit,
    pageSize: 10,
    rowSize: 1,
    format: (item) => `${item}`,
  });
  let text = await pagination.text();
  let keyboard = await pagination.keyboard();

  ctx.reply(text, keyboard);

  pagination.handleActions(bot);
});

bot.command("daftarbabwaktu2salat", async (ctx) => {
  const max_size = 4096;
  var start = 0;
  var end = max_size;

  var kitabMessage =
    "Untuk melihat daftar hadis dalam bab silakan: ketik /waktu2salatbab (nomor bab). Contoh /waktu2salatbab 2\n\nDaftar bab dalam kitab waktu-waktu salat: \n";

  dataBabWaktu2Salat.forEach((item) => {
    kitabMessage += `${item.bab_kode_k.substring(12)}. ${item.bab_nama_k}\n`;
  });

  let kitabMessageSplit = kitabMessage.split("\n");

  let pagination = new Pagination({
    data: kitabMessageSplit,
    pageSize: 10,
    rowSize: 1,
    format: (item) => `${item}`,
  });
  let text = await pagination.text();
  let keyboard = await pagination.keyboard();

  ctx.reply(text, keyboard);

  pagination.handleActions(bot);
});

bot.command("salatbab", (ctx) => {
  let input = ctx.message.text.split("/salatbab ");
  if (input.length <= 1) {
    ctx.reply("Anda harus memberi nomor bab pada argumen ke-2", {
      reply_to_message_id: ctx.message.message_id,
    });
    return;
  }
  let hadisSalatInput = "BSALAT" + input[1];
  let kitabMessage =
    "Daftar hadis dalam bab kitab salat no. " + input[1] + ": \n\n";
  let errorMessage =
    "Daftar hadis dalam bab no. " + input[1] + " tidak ditemukan";
  let namaBabDraft = "";
  let idHadisDraft = "";
  let statusMessage = false;
  dataKitabBabHadis.forEach((item) => {
    if (item.bab_kode === hadisSalatInput) {
      namaBabDraft = `${item.bab_nama}`;
      idHadisDraft += ` {/sb_${item.hadis_id}}`;
      statusMessage = true;
      return;
    }
  });
  if (statusMessage === true) {
    kitabMessage = kitabMessage += namaBabDraft;
    ctx.reply((kitabMessage += idHadisDraft), {
      reply_to_message_id: ctx.message.message_id,
    });
  } else {
    ctx.reply(errorMessage, {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

bot.command("waktu2salatbab", (ctx) => {
  let input = ctx.message.text.split("/waktu2salatbab ");
  if (input.length <= 1) {
    ctx.reply("Anda harus memberi nomor bab pada argumen ke-2", {
      reply_to_message_id: ctx.message.message_id,
    });
    return;
  }
  let hadisSalatInput = "BWAKTU2SALAT" + input[1];
  let kitabMessage =
    "Daftar hadis dalam bab kitab waktu-waktu salat no. " + input[1] + ": \n\n";
  let errorMessage =
    "Daftar hadis dalam bab kitab waktu-waktu salat no. " +
    input[1] +
    " tidak ditemukan";
  let namaBabDraft = "";
  let idHadisDraft = "";
  let statusMessage = false;
  dataKitabBabHadis.forEach((item) => {
    if (item.bab_kode === hadisSalatInput) {
      namaBabDraft = `${item.bab_nama}`;
      idHadisDraft += ` {/sb_${item.hadis_id}}`;
      statusMessage = true;
      return;
    }
  });
  if (statusMessage === true) {
    kitabMessage = kitabMessage += namaBabDraft;
    ctx.reply((kitabMessage += idHadisDraft), {
      reply_to_message_id: ctx.message.message_id,
    });
  } else {
    ctx.reply(errorMessage, {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

bot.command("hadisnomor", (ctx) => {
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
});

bot.command("carihadis", async (ctx) => {
  let input = ctx.message.text.split("/carihadis ");
  let namaKitabDraft = "";
  let namaKitabSplit = "";
  let namaBabSplit = "";
  let namaBabDraft = "";
  let idHadisDraft = "";
  let jumlahBab = "";
  let jumlahKitab = "";
  let jumlahHadis = "";

  var x = 0;
  var y = 0;
  var z = 0;
  let namaKitabAsli = "";
  let namaBabAsli = "";
  let idHadisAsli = "";
  let babDanHadis = "";
  let babDanHadisSplit = "";
  let babHadisAsli = "";
  let namaKitabDaftar = "";
  const max_size = 4086;
  var start = 0;
  var end = max_size;
  let kitabMessage = "";

  if (input.length <= 1) {
    ctx.reply(
      "Anda harus memberi kata kunci yang ingin dicari pada argumen ke-2",
      { reply_to_message_id: ctx.message.message_id }
    );
    return;
  }
  let hadisInput = input[1].toLowerCase();

  dataKitabBabHadis.forEach((item) => {
    try {
      if (item.hadis_terjemahan.toLowerCase().includes(hadisInput)) {
        namaKitabDraft += `${item.kitab_nama}\n`;
        namaBabDraft += `${item.bab_nama}\n`;
        idHadisDraft += `${item.hadis_id}\n`;

        babDanHadis += `!Kitab: ${item.kitab_nama}\n!${item.bab_nama}\n. {/sb_${item.hadis_id}}\n`;
        return;
      }
    } catch (err) {
      console.error(err);
    }
  });

  namaKitabDaftar = namaKitabDraft.split("\n");

  namaBabSplit += namaBabDraft
    .split("\n")
    .filter((item, i, allItems) => {
      return i === allItems.indexOf(item);
    })
    .join("\n");
  namaKitabSplit += namaKitabDraft
    .split("\n")
    .filter((item, i, allItems) => {
      return i === allItems.indexOf(item);
    })
    .join("\n");

  babDanHadisSplit += babDanHadis
    .split("\n")
    .filter((item, i, allItems) => {
      return i === allItems.indexOf(item);
    })
    .join("\n")
    .split("\n")
    .join("");

  const re = "\n";
  jumlahBab = namaBabSplit.split(re).length - 1;
  jumlahKitab = namaKitabSplit.split(re).length - 1;
  jumlahHadis = idHadisDraft.split(re).length - 1;

  const namaBab = namaBabSplit.split("\n");
  const namaKitab = namaKitabSplit.split("\n");
  const idHadis = idHadisDraft.split("\n");
  const babHadis = babDanHadisSplit
    .split("\n")
    .join("")
    .split(".")
    .join("")
    .split("!")
    .join("\n")
    // .split("#")
    // .join("\n\n")
    .split("\n");

  for (let i = 0; i < idHadis.length - 1; i++) {
    idHadisAsli += "/sb_" + idHadis[i] + " ";
  }

  for (let i = 0; i < namaBab.length - 1; i++) {
    namaBabAsli += `${++x}. ${namaBab[i]}\n`;
    // ${"{"+idHadisAsli+"}"}\n`;
  }

  for (let i = 0; i < namaKitab.length - 1; i++) {
    namaKitabAsli += `${++y}. ${namaKitab[i]}\n`;
  }

  for (let i = 1; i < babHadis.length; i++) {
    if (babHadis[i].includes("Kitab: Salat")) {
      babHadisAsli += `${babHadis[i]}\n\n`;
      z = 0;
    } else if (babHadis[i].includes("Kitab: Waktu-Waktu Salat")) {
      babHadisAsli += `\n${babHadis[i]}\n\n`;
      z = 0;
    } else if (
      !babHadis[i].includes(
        "Kitab: Waktu-Waktu Salat" && !babHadis[i].includes("Kitab: Salat")
      )
    )
      babHadisAsli += `${++z}. ${babHadis[i]}\n`;
  }

  kitabMessage +=
    "Pencarian hadis tentang " +
    input[1] +
    "\n\nDitemukan dalam " +
    jumlahKitab +
    " kitab: \n" +
    namaKitabAsli +
    "\nDitemukan " +
    jumlahBab +
    " bab " +
    "dan " +
    jumlahHadis +
    " hadis\n\n" +
    babHadisAsli;

  var amount_sliced = kitabMessage.length / max_size;

  for (let i = 0; i < amount_sliced; i++) {
    let math = Math.ceil(amount_sliced);

    if (i >= 10) {
      break;
    } else if (i === 0) {
      message = await kitabMessage.slice(start, end);
      await bot.telegram.sendMessage(ctx.chat.id, message, {
        reply_to_message_id: ctx.message.message_id,
      });
      start = start + max_size;
      end = end + max_size;
    } else if (i !== 0) {
      message = (await `[${i + 1}/${math}]  `) + kitabMessage.slice(start, end);
      await bot.telegram.sendMessage(ctx.chat.id, message, {
        reply_to_message_id: ctx.message.message_id,
      });
      start = start + max_size;
      end = end + max_size;
    }
  }
});

//nomor hadis Sahih Bukhari

let numberSb = [];

for (let i = 336; i <= 567; i++) {
  numberSb.push(`sb_${i}`);
}

bot.command(numberSb, async (ctx) => {
  // let input = ctx.message.text.split("_");
  // let inputIdHadis = input[1];
  let kitabMessage =
    "HR. Sahih Bukhari " + ctx.message.text.substring(4) + "\n\n";
  let errorMessage =
    "HR. Sahih Bukhari " + ctx.message.text.substring(4) + " tidak ditemukan";
  let statusMessage = false;

  const max_size = 4086;
  var start = 0;
  var end = max_size;

  dataKitabBabHadis.forEach((item) => {
    let idHadis = item.hadis_id;
    let hadis_id = idHadis.toString();

    hadis_id;
    try {
      if (hadis_id.includes(ctx.message.text.substring(4))) {
        kitabMessage += `${item.hadis_arab}. \n\n${item.hadis_terjemahan}`;
        statusMessage = true;

        return;
      }
    } catch (err) {
      console.log(err);
    }
  });

  var amount_sliced = kitabMessage.length / max_size;
  if (statusMessage === true) {
    for (let i = 0; i < amount_sliced; i++) {
      let math = Math.ceil(amount_sliced);
      if (i >= 10) {
        break;
      } else if (i === 0) {
        message = await kitabMessage.slice(start, end);
        // await ctx.reply(message);
        await bot.telegram.sendMessage(ctx.chat.id, message, {
          reply_to_message_id: ctx.message.message_id,
        });

        start = start + max_size;
        end = end + max_size;
      } else if (i !== 0) {
        message =
          (await `[${i + 1}/${math}]  `) + kitabMessage.slice(start, end);
        await ctx.reply(message);
        start = start + max_size;
        end = end + max_size;
      }
    }
  } else if (statusMessage === false) {
    ctx.reply(errorMessage);
  }
});

bot.on("text", (ctx) => {
  return ctx.reply(`Perintah tidak dikenali. Klik atau ketik /help.`, {
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.on("sticker", (ctx) => ctx.reply("👍"));

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
