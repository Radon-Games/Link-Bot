const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { reset } = require("../db.js");

module.exports = {
  data: new SlashCommandBuilder()
	  .setName("reset")
	  .setDescription("Resets proxy limits")
    .addUserOption(option => option.setName("target").setDescription("The user to reset")),
  exec: async (client, interaction) => {
    const target = interaction.options.getUser("target");
    
    if (target) {


      const embed = new MessageEmbed()
        .setTitle(`Reset proxy limits for ${target.username}#${target.discriminator}.`)
        .setDescription(`This will reset proxy limits for <@${target.id}>. You have 5 secconds to click \`Confirm\` to continue.`)
        .setColor(0xFF0000)
        .setTimestamp()
	      .setFooter({ text: `Proxy Bot - ${interaction.guild.name}`, iconURL: client.user.displayAvatarURL() });
      
      const button = new MessageButton()
        .setCustomId("__RESET_CONFIRM_USER__")
        .setLabel("Confirm")
        .setStyle("DANGER")

      const row = new MessageActionRow().addComponents(button);

      await interaction.reply({ embeds: [embed], components: [row] })

      const collector = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", time: 5000 });

      collector.on("collect", (i) => {
        if (i.component.customId === "__RESET_CONFIRM_USER__") {
          reset(interaction.guild.id, target.id);
          i.reply({ content: `Proxy limits for <@${target.id}> have been reset.` });
          button.setDisabled(true);
          interaction.editReply({ components: [row] });
        }
      });

      collector.on("end", (collected) => {
	      button.setDisabled(true);
        interaction.editReply({ components: [row] });
      });


    } else {


      const embed = new MessageEmbed()
        .setTitle("Reset proxy limits for the entire server.")
        .setDescription("This will reset proxy limits for all users on the server. You have 5 secconds to click `Confirm` to continue.")
        .setColor(0xFF0000)
        .setTimestamp()
	      .setFooter({ text: `Proxy Bot - ${interaction.guild.name}`, iconURL: client.user.displayAvatarURL() });
      
      const button = new MessageButton()
        .setCustomId("__RESET_CONFIRM_GUILD__")
        .setLabel("Confirm")
        .setStyle("DANGER")

      const row = new MessageActionRow().addComponents(button);

      await interaction.reply({ embeds: [embed], components: [row] })

      const collector = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", time: 5000 });

      collector.on("collect", (i) => {
        if (i.component.customId === "__RESET_CONFIRM_GUILD__") {
          if (i.member.user.id !== interaction.member.user.id) return i.reply({ content: `This button isnt for you.`, ephemeral: true });
          reset(interaction.guild.id);
          i.reply({ content: `Proxy limits for the entire server have been reset.` });
          button.setDisabled(true);
          interaction.editReply({ components: [row] });
        }
      });
    }
  }
};