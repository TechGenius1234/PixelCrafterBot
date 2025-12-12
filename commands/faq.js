const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("faq")
    .setDescription("View an FAQ item by ID")
    .addIntegerOption(opt => opt.setName("id").setDescription("FAQ ID").setRequired(true)),

  async execute(interaction) {
    const id = interaction.options.getInteger("id");
    const faqData = JSON.parse(fs.readFileSync("./faq.json", "utf8"));

    if (!faqData.faq[id]) return interaction.reply({ content: "❌ That FAQ ID doesn’t exist.", ephemeral: true });

    const item = faqData.faq[id];
    const embed = new EmbedBuilder()
      .setTitle(item.name)
      .setDescription(item.answer)
      .setColor("Blue");

    await interaction.reply({ embeds: [embed] });
  },
};
