const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { removeLink } = require("../db.js");

module.exports = {
  data: new SlashCommandBuilder()
	  .setName("remove")
	  .setDescription("Removes a link")
    .addStringOption(option => option.setName("type")
      .setDescription("The type of link to remove")
      .setRequired(true))
    .addStringOption(option => option.setName("url")
      .setDescription("The URL to remove")
      .setRequired(true)),
  exec: async (client, interaction) => {
    const type = interaction.options.getString("type");
    const url = interaction.options.getString("url");
    if (!type || !url) {
      return await interaction.reply({ content: "You must specify a type and a URL.", ephemeral: true });
    }
    const result = await removeLink(interaction.guild.id, type, url);
    if (result.status) {
      const embed = new MessageEmbed()
        .setTitle("Removed link")
        .addField("URL", url)
        .addField("Type", type)
        .setTimestamp()
	      .setFooter({ text: `Proxy Bot - ${interaction.guild.name}`, iconURL: client.user.displayAvatarURL() });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      await interaction.reply({ content: result.message, ephemeral: true });
    }
  }
};