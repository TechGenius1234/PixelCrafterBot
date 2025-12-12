// commands/close_ticket.js
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("close_ticket")
    .setDescription("Close this support ticket")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels), // optional
  async execute(interaction) {
    const channel = interaction.channel;

    // Optional: check if the channel name starts with "ticket-"
    if (!channel.name.startsWith("ticket-")) {
      return interaction.reply({
        content: "❌ This command can only be used in ticket channels.",
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: "Ticket closing in 3 seconds...",
      ephemeral: true,
    });

    setTimeout(() => {
      channel.delete().catch(() => {});
    }, 3000);
  },
};
