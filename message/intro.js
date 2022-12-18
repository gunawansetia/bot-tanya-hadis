const intro = `
Ini adalah bot hadis riwayat <b>Sahih Bukhari</b>.

Kamu bisa mencari hadis dengan mengetik perintah /carihadis spasi kata kunci. Atau kamu bisa mencarinya lewat perintah-perintah di bawah ini.

Kamu bisa membaca dan membagikan hadis yang kamu inginkan ke semua orang.`;

const helpMessage = `
Daftar perintah:
/start - untuk memulai bot

/daftarkitabhadis - untuk melihat daftar kitab hadis riwayat Sahih Bukhari

/daftarbabsalat - untuk melihat daftar bab dalam kitab salat

/daftarbabwaktu2salat - untuk melihat daftar bab dalam kitab waktu-waktu salat

Ketik /salatbab spasi nomor bab - untuk melihat daftar hadis dalam sebuah bab kitab salat. Contoh /salatbab 1

Ketik /waktu2salatbab spasi nomor bab - untuk melihat daftar hadis dalam sebuah bab kitab waktu-waktu salat

Ketik /carihadis spasi kata kunci - untuk mencari hadis berdasarkan terjemahan. Contoh /carihadis salat

Ketik /hadisnomor spasi nomor hadis - untuk mencari hadis berdasarkan nomornya. Contoh /hadisnomor 399

/help - melihat referensi perintah

/about - tentang bot ini
`;

const tentangKami = `
🤖 Bot ini merupakan layanan pencarian hadis riwayat Sahih Bukhari, yang terdiri dari 2 kitab, yaitu kitab salat dan waktu-waktu salat. 

📚 Lafaz arab hadis diambil dari quranx.com dan terjemahan bahasa Indonesianya diambil dari e-book situs alkhoirot.org.`;

module.exports = { intro, helpMessage, tentangKami };
