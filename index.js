// packages
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { addServer, removeServer } = require("./db.js");
const fs = require("node:fs");
require("dotenv").config();
const { getLinks, reset } = require("./db.js");


// variables
const intents = Object.values(Intents.FLAGS);
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

    const result = await getLinks(interaction.guild.id, type);
    if (result.status) {
      const embed = new MessageEmbed()
        .setTitle(`Proxy Bot - ${interaction.guild.name}`)
        .setDescription("Save the url before this message disappears.")
        .addField("URL", result.data[0])
        .addField("Type", type)
        .addField("Remaining", "2")
        .setTimestamp()
	      .setFooter({ text: `Proxy Bot - ${interaction.guild.name}`, iconURL: client.user.displayAvatarURL() });

      const row = new MessageActionRow().addComponents(new MessageButton()
        .setURL(result.data[0])
        .setLabel("Open")
        .setStyle("LINK"));
      
      await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    } else {
      await interaction.reply({ content: result.message, ephemeral: true });
    }
  }
});

client.once("ready", () => {
  const guilds = client.guilds.cache.map(guild => guild.id);
  guilds.forEach((guildId) => {
    updateSlashCommands(guildId);
  });
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
      console.log(`Updating slash commands for ${guildId}...`);
	  	await rest.put(
	  		Routes.applicationGuildCommands(client.user.id, guildId),
	  		{ body: commands },
	  	);
      console.log(`Updated slash commands for ${guildId}`);
	  } catch (error) {
	  	console.error(error);
	  }
  })();
}


// login
client.login(process.env.TOKEN);