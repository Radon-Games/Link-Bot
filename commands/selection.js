// parseInt(hexString, 16);
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { getTypes } = require("../db.js");

module.exports = {
  data: new SlashCommandBuilder()
	  .setName("selection")
	  .setDescription("Creates the selection embed")
    .addStringOption(option => option.setName("title")
      .setDescription("Embed title"))
    .addStringOption(option => option.setName("description")
      .setDescription("Embed description"))
    .addStringOption(option => option.setName("color")
      .setDescription("Embed color"))
    .addStringOption(option => option.setName("style")
      .setDescription("Button style")
      .addChoices({
        name: "PRIMARY", 
        value: "PRIMARY"
      },
      {
        name: "SECONDARY", 
        value: "SECONDARY"
      },
      {
        name: "SUCCESS", 
        value: "SUCCESS"
      },
      {
        name: "DANGER", 
        value: "DANGER"
      })),
  exec: async (client, interaction) => {
    const title = interaction.options.getString("title") || "Get URLs";
    const description = interaction.options.getString("description") || "Click the buttons below to get free URLs.";
    const color = parseInt(interaction.options.getString("color"), 16) || 0xffffff;
    const style = interaction.options.getString("style") || "PRIMARY";

    if (!title) {
      return await interaction.reply({ content: "You must specify a title.", ephemeral: true });
    }

    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setTimestamp()
	    .setFooter({ text: `Proxy Bot - ${interaction.guild.name}`, iconURL: client.user.displayAvatarURL() });

    const row = new MessageActionRow()

    const result = await getTypes(interaction.guild.id);
    if (result.status) {
      if (result.data.length <= 0) {
        await interaction.reply({ content: "No links found.", ephemeral: true });
      } else {
        result.data.forEach((type) => {
          row.addComponents(new MessageButton()
            .setCustomId(type)
            .setLabel(type)
            .setStyle(style));
        });
  
        await interaction.reply({ embeds: [embed], components: [row] });
      }
    } else {
      await interaction.reply({ content: result.message, ephemeral: true });
    }
  }
};