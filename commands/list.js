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
        const embed = new MessageEmbed()
          .setTitle("Link types")
          .setDescription(result.data.join("\n"))
          .setTimestamp()
          .setFooter({ text: `Proxy Bot - ${interaction.guild.name}`, iconURL: client.user.displayAvatarURL() });
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        await interaction.reply({ content: result.message, ephemeral: true });
      }
    } else {
      const result = await getLinks(interaction.guild.id, type);
      if (result.status) {
        const embed = new MessageEmbed()
          .setTitle(`${type} Links`)
          .setDescription(result.data.join("\n"))
          .setTimestamp()
          .setFooter({ text: `Proxy Bot - ${interaction.guild.name}`, iconURL: client.user.displayAvatarURL() });
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        await interaction.reply({ content: result.message, ephemeral: true });
      }
    }
  }
};