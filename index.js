// ===== IMPORTS =====
const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  Collection, 
  ChannelType, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  PermissionFlagsBits 
} = require("discord.js");
const fs = require("fs");
const path = require("path");

// ----- CONFIG -----
const TOKEN = "I am not giving this. Buuuut ill keep everything else :)"; // <-- put your bot token here
const WHITELISTED_GUILD_IDS = [
  "1345479029213626443",
  "1390358390248702002",
  "1426388976737980458",
  "1434695251485917197",
  "1423087444491767902",
  "1383257719913316402",
  "1439406343889879155"
];

// ----- CLIENT -----
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,  // 👈 THIS
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // optional if you send normal messages
  ],
});


// ----- LOAD COMMANDS -----
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// ----- BOT READY -----
client.once("ready", () => {
  console.log(`${client.user.tag} is now booting up.`);
  client.user.setActivity("Bot is now booting up.", { type: 3 }); // 3 = Watching
  setTimeout(() => {
    client.user.setActivity("Watching over Gamerville", { type: 3 }); // 3 = Watching
    console.log(`Booted.`)
  }, 3000);
});

// ----- HANDLE SLASH COMMANDS -----
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // ----- WHITELIST CHECK -----
  if (!WHITELISTED_GUILD_IDS.includes(interaction.guildId)) {
    return interaction.reply({
      content: "❌ This bot is not allowed in this server.",
      ephemeral: true
    });
  }

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "❌ Error executing command.",
      ephemeral: true
    });
  }
});
// ===== BELOW THIS IS CUSTOM MESSAGES E.G: WELCOMER =====

// ===== WELCOME MESSAGE =====
client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.get("1439419661677498509");
  if (!channel) return;

  // Normal text message
  await channel.send(`Welcome <@${member.id}> to GamerVille!`);

// Embed message for Gamerville
  const embed = {
    title: "Gamerville",
    description: `**Welcome!**\nWelcome to Gamerville. The following are quick links that may be useful.`,
    color: 0x9b59b6, // Purple
    fields: [
      {
        name: "Im still working on the server",
        value: `Quick links coming soon!!`,
      },
    ],
    footer: {
      text: "Thank you for joining!",
    },
  };

  await channel.send({ embeds: [embed] });
});

// ----- TICKETS -----
client.on("interactionCreate", async (interaction) => {
  if (interaction.customId === "create_ticket_support") {
    await interaction.deferReply({ ephemeral: true }); // <-- respond immediately to avoid timeout
  
    const guild = interaction.guild;
    const user = interaction.user;
  
    // Create private channel
    const channel = await guild.channels.create({
      name: `ticket-${user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
        { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      ],
    });
  
    // Send welcome embed in the ticket
    const welcome = new EmbedBuilder()
      .setTitle("🎫 Support Ticket")
      .setDescription("Our team will assist you shortly.\nPress **Close Ticket** when done.")
      .setColor("Green");
  
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("close_ticket")
        .setLabel("Close Ticket")
        .setStyle(ButtonStyle.Danger)
    );
  
    await channel.send({
      content: `<@${user.id}>`,
      embeds: [welcome],
      components: [row],
    });
  
    // Now follow up to the deferred reply
    await interaction.followUp({
      content: `✅ Your Support ticket is open: ${channel}`,
      ephemeral: true,
    });
  }
  
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  // ===== CLOSE TICKET =====
  if (interaction.customId === "close_ticket") {
    // Defer reply so Discord doesn’t timeout
    await interaction.deferReply({ ephemeral: true });

    // Send ephemeral confirmation
    await interaction.followUp({
      content: "Ticket closing in 3 seconds...",
      ephemeral: true,
    });

    // Delete channel after 3 seconds
    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 3000);
  }
});
// ----- LOGIN -----
client.login(TOKEN);
