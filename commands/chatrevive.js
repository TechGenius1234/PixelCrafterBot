const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chatrevive")
    .setDescription("Revive chat with a random question"),

  async execute(interaction) {
    const requiredRole = "1434599193174872175";
    const logChannelId = "1425609185743343646";

    if (!interaction.member.roles.cache.has(requiredRole)) {
      const logChannel = interaction.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        logChannel.send(`⚠️ Unauthorized /chatrevive attempt by ${interaction.user.tag} (${interaction.user.id})`);
      }
      return interaction.reply({ content: "You do not have permission to use this command. This action was logged.", ephemeral: true });
    }

    const faqData = JSON.parse(fs.readFileSync("./revive.json", "utf8"));
    if (!faqData.faq || faqData.faq.length === 0) return interaction.reply("❌ No revive questions found.");

    const randomIndex = Math.floor(Math.random() * faqData.faq.length);
    const item = faqData.faq[randomIndex];
    const embed = new EmbedBuilder()
      .setTitle(item.name)
      .setDescription(item.answer)
      .setColor("Blue");

      await interaction.reply({ 
        content: "<@&1392239218222436417>", 
        embeds: [embed], 
        allowedMentions: { roles: ["1392239218222436417"] } 
      });      
  },
};
