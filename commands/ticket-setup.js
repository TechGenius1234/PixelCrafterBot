const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("ticket-setup")
      .setDescription("Create the Support ticket panel")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
    async execute(interaction) {
  
      const embed = new EmbedBuilder()
        .setTitle("🎫 Support Tickets")
        .setDescription("Click the button below to open a Support ticket!")
        .setColor("Blue");
  
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("create_ticket_support")
          .setLabel("Open Support Ticket")
          .setStyle(ButtonStyle.Primary)
      );
  
      await interaction.reply({
        content: "Support ticket panel created!",
        ephemeral: true,
      });
  
      await interaction.channel.send({
        embeds: [embed],
        components: [row],
      });
    },
  };
  