const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { getTypes, getLinks } = require("../db.js");

module.exports = {
  data: new SlashCommandBuilder()
	  .setName("list")
	  .setDescription("List all links of specified type or all types of links")
    .addStringOption(option => option.setName("type")
      .setDescription("The link type to list")),
  exec: async (client, interaction) => {
    const type = interaction.options.getString("type");
    if (!type) {
      const result = await getTypes(interaction.guild.id);
      if (result.status) {
        let message = "Link types:";
        result.data.forEach((type) => {
          message += `\n${type}`;
        });
        await interaction.reply({ content: message, ephemeral: true });
      } else {
        await interaction.reply({ content: result.message, ephemeral: true });
      }
    } else {
      const result = await getLinks(interaction.guild.id, type);
      if (result.status) {
        let message = `Links of type ${type}:`;
        result.data.forEach((link) => {
          message += `\n<${link}>`;
        });
        await interaction.reply({ content: message, ephemeral: true });
      } else {
        await interaction.reply({ content: result.message, ephemeral: true });
      }
    }
  }
};