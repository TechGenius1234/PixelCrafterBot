const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server")
    .addUserOption(opt => opt.setName("user").setDescription("The user to kick").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for kick").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!member) return interaction.reply({ content: "Invalid user.", ephemeral: true });

    try {
      await member.kick(reason);
      await interaction.reply(`${member.user.tag} was kicked. Reason: ${reason}`);
    } catch {
      await interaction.reply("Failed to kick member.");
    }
  },
};
