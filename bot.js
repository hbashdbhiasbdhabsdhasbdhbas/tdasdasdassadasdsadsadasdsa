const Discord = require("discord.js");
const client = new Discord.Client();

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

const prefix = "$";

client.on("ready", () => {
  console.log("Vulnix | Logged in! Server count: ${client.guilds.size}");
  client.user.setGame(`Support Magic |${prefix}new`);
});


client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.toLowerCase().startsWith(prefix + `help`)) {
    const embed = new Discord.RichEmbed()
    .setTitle(`:mailbox_with_mail: Vulnix Help`)
    .setColor(0xCF40FA)
    .setDescription(`اهلا انا بوت التكت و هذه اوامري:`)
    .addField(`Tickets`, `[${prefix}new]() > علشان تفتح تكت \n[${prefix}close]() > علشان تقفل تكت مفتوح`)
    .addField(`Other`, `[${prefix}help]() > Shows you this help menu your reading\n[${prefix}ping]() > Pings the bot to see how long it takes to react\n[${prefix}about]() > Tells you all about Vulnix`)
    message.channel.send({ embed: embed });
  }

  if (message.content.toLowerCase().startsWith(prefix + `ping`)) {
    message.channel.send(`Hoold on!`).then(m => {
    m.edit(`:ping_pong: Wew, made it over the ~waves~ ! **Pong!**\nMessage edit time is ` + (m.createdTimestamp - message.createdTimestamp) + `ms, Discord API heartbeat is ` + Math.round(client.ping) + `ms.`);
    });
}

if (message.content.toLowerCase().startsWith(prefix + `new`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Support Team")) return message.channel.send(`السيرفر ده معندوش رتبة\`Support Team\` , ف التكت مش هيتفتح.\nلو انت ادارة في السيرفر اعمل الرتبة , و ادي الرتبة للي عايزهم يشوفوا التكت.`);
    if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`انت اصلا عندك تكت.`);
    message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
        let role = message.guild.roles.find("name", "Support Team");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(`:white_check_mark: تكتك اتعمل, #${c.name}.`);
        const embed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .addField(`اهلا ${message.author.username}!`, `قول انت فتحت التكت ليه و  Our **Support Team** هيسعدوك.`)
        .setTimestamp();
        c.send({ embed: embed });
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `close`)) {
    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`انت متقدرش تقفل التكت برة روم التكت.`);

    message.channel.send(`انت متاكد?  انت مش هتقدر ترجع عن هذه الخطوة!\nعلشان تاكد انك عايز تقفل التكت, اكتب \`$close\`. بعد عشر ثواني لو مكتبتش $close التكت مش هيتقفل.`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === '$close', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('الوقت بتاع انك تمسح التكت راح, التكت متمسحش.').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}

});
client.login(process.env.BOT_TOKEN)
