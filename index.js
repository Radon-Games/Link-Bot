// packages
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("node:fs");
require("dotenv").config();
const { addServer, removeServer, getLinks, getLimit, getUser, setUser } = require("./db.js");


// variables
//const intents = Object.values(Intents.FLAGS);
const intents = [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES];
const client = new Client({ intents });
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));


// events
client.on("guildCreate", (guild) => {
  updateSlashCommands(guild.id);
  addServer(guild.id);
});

client.on("guildDelete", (guild) => {
  removeServer(guild.id);
});

client.on("interactionCreate", async (interaction) => {
	if (interaction.isCommand()) {
    if (interaction.member.user.bot) return;
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return await interaction.reply({ content: "This command requires administrator permissions.", ephemeral: true });

    const command = interaction.commandName.toLowerCase();

    try {
      await require(`./commands/${command}.js`).exec(client, interaction);
    } catch {
      return;
    }
  } else if (interaction.isButton()) {
    if (interaction.member.user.bot) return;

    const type = interaction.customId;

    if (type.startsWith("__")) return;

    // get information from database
    let limit = await getLimit(interaction.guild.id);
    if (!limit.status) return await interaction.reply({ content: limit.message, ephemeral: true });
    limit = limit.data;
    let user = await getUser(interaction.guild.id, interaction.member.user.id);
    if (!user.status) return await interaction.reply({ content: user.message, ephemeral: true });
    user = user.data;
    if (user.count >= limit) return await interaction.reply({ content: `You have reached your limit of ${limit} links.`, ephemeral: true });
    let links = await getLinks(interaction.guild.id, type);
    if (!links.status) return await interaction.reply({ content: links.message, ephemeral: true });
    links = links.data;

    // randomly shuffle links
    links = links.sort(() => Math.random() - 0.5);

    // get random link
    let link;
    links.forEach((_link) => {
      user.links[type] = user.links[type] || [];
      if (user.links[type].includes(_link)) return;
      if (link) return;
      user.links[type].push(_link);
      link = _link;
      user.count++;
    });

    if (!link) return await interaction.reply({ content: "No links available.", ephemeral: true });

    const member = client.users.cache.get(interaction.member.user.id);

    // send message
    const embed = new MessageEmbed()
      .setTitle(`Proxy Bot - ${interaction.guild.name}`)
      .addField("URL", link)
      .addField("Type", type)
      .addField("Remaining", `${limit - user.count}`)
      .setTimestamp()
      .setFooter({ text: `Proxy Bot - ${interaction.guild.name}`, iconURL: client.user.displayAvatarURL() });

    try {
      await member.send({ embeds: [embed] });
      await interaction.reply({ content: "Check your DMs.", ephemeral: true });
    } catch {
      await interaction.reply({ content: "Failed to send message. Are your DMs off?", ephemeral: true });
    }
  
    // update database
    await setUser(interaction.guild.id, interaction.member.user.id, user);
  }
});


// update slash commands
client.on("ready", () => {
  const guilds = client.guilds.cache.map(guild => guild.id);
  console.log("Updating slash commands");
  guilds.forEach((guildId) => {
    updateSlashCommands(guildId);
  });
  console.log("Updated slash commands");
	console.log(`Logged in as ${client.user.tag}!`);
});


// init
function updateSlashCommands (guildId) {
  const commands = [];
  for (const file of commandFiles) {
	  const command = require(`./commands/${file}`);
	  commands.push(command.data.toJSON());
  }
  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
  (async () => {
	  try {
	  	await rest.put(
	  		Routes.applicationGuildCommands(client.user.id, guildId),
	  		{ body: commands },
	  	);
	  } catch (error) {
	  	console.error(error);
	  }
  })();
}


// login
client.login(process.env.TOKEN);
