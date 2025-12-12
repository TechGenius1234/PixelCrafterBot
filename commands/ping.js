const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the ping time from you to Discord to the server "),

  async execute(interaction) {
    // Send initial response
    const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });

    // Calculate latency
    const ping = sent.createdTimestamp - interaction.createdTimestamp;

    // Edit reply with actual ping
    await interaction.editReply(`Pong! Latency is ${ping}ms.`);
  },
};