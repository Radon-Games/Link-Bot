const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { setLimit } = require("../db.js");

module.exports = {
  data: new SlashCommandBuilder()
	  .setName("limit")
	  .setDescription("Changes the limit of links")
    .addNumberOption(option => option.setName("limit")
      .setDescription("The new limit")
      .setRequired(true)),
  exec: async (client, interaction) => {
    const limit = interaction.options.getNumber("limit");
    
    if (!limit) return await interaction.reply({ content: "You must specify a limit.", ephemeral: true });

    const embed = new MessageEmbed()
      .setTitle("Changed proxy limit")
      .addField("Limit", limit.toString())
      .setTimestamp()
      .setFooter({ text: `Proxy Bot - ${interaction.guild.name}`, iconURL: client.user.displayAvatarURL() });

    const result = await setLimit(interaction.guild.id, limit);

    if (result.status) {
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      await interaction.reply({ content: result.message, ephemeral: true });
    }
  }
};