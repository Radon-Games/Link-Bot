const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { setLimit } = require("../db.js");

module.exports = {
  data: new SlashCommandBuilder()
	  .setName("limit")
	  .setDescription("Changes the limit of lins")
    .addNumberOption(option => option.setName("limit")
      .setDescription("The new limit")
      .setRequired(true)),
  exec: async (client, interaction) => {
    const limit = interaction.options.getNumber("limit");
  }
};