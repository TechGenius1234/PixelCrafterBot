const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server")
    .addUserOption(opt => opt.setName("user").setDescription("The user to ban").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for ban").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!member) return interaction.reply({ content: "Invalid user.", ephemeral: true });

    try {
      await member.ban({ reason });
      await interaction.reply(`${member.user.tag} was banned. Reason: ${reason}`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: "Failed to ban member.", ephemeral: true });
    }
  },
};
