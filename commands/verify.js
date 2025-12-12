const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Sends the verification embed with a button"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Server Verification")
      .setDescription(
        "Welcome to our server!\n\n" +
        "To access all channels, you first need to verify yourself.\n\n" +
        "Click the Verify button below and enter the unique code shown in the verification prompt to confirm you’re not a bot.\n\n" +
        "Once verified, you will be able to select one or more roles that match your interests or responsibilities in the server.\n\n" +
        "Please choose carefully to ensure you get the correct access and notifications."
      )
      .setColor("#025492") // Main blue
      .setTimestamp();

    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verify_button")
        .setLabel("Verify")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("✅")
    );

    await interaction.reply({ embeds: [embed], components: [buttonRow] });
  },
};
