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
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

// Store verification codes for each user
const verificationCodes = new Map(); 

client.on("interactionCreate", async (interaction) => {
  // VERIFY BUTTON
  if (interaction.isButton() && interaction.customId === "verify_button") {
    // Generate random 6-character code (letters + numbers, case-sensitive)
    const code = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8).toUpperCase();
    verificationCodes.set(interaction.user.id, code);

    // Show modal to user
    const modal = new ModalBuilder()
      .setCustomId(`verify_modal_${interaction.user.id}`)
      .setTitle("Server Verification");

    const input = new TextInputBuilder()
      .setCustomId("verification_code")
      .setLabel("Enter the verification code")
      .setPlaceholder(`Type the exact code shown: ${code}`)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));

    await interaction.showModal(modal);
  }

  // MODAL SUBMISSION
  if (interaction.isModalSubmit() && interaction.customId.startsWith("verify_modal_")) {
    const userId = interaction.user.id;
    const code = verificationCodes.get(userId);

    const submittedCode = interaction.fields.getTextInputValue("verification_code");

    if (submittedCode === code) {
      // ✅ Correct code
      verificationCodes.delete(userId);

      // Assign Verified role
      const verifiedRole = interaction.guild.roles.cache.find(r => r.name === "Verified");
      if (verifiedRole) await interaction.member.roles.add(verifiedRole);

      // Send follow-up with role selection menu
      const roleSelect = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("role_select")
          .setPlaceholder("Select your roles")
          .setMinValues(1)
          .setMaxValues(3) // adjust max as needed
          .addOptions([
            { label: "Gamer", value: "gamer_role_id" },
            { label: "Artist", value: "artist_role_id" },
            { label: "Developer", value: "developer_role_id" },
          ])
      );

      await interaction.reply({ content: "✅ Verification successful! Select your roles below:", components: [roleSelect], ephemeral: true });
    } else {
      // ❌ Incorrect code
      await interaction.reply({ content: "❌ Incorrect code. Please try again.", ephemeral: true });
    }
  }

  // ROLE SELECTION
  if (interaction.isStringSelectMenu() && interaction.customId === "role_select") {
    const roles = interaction.values.map(id => interaction.guild.roles.cache.get(id)).filter(r => r);
    for (const role of roles) {
      await interaction.member.roles.add(role);
    }

    await interaction.reply({ content: "✅ Roles assigned successfully!", ephemeral: true });
  }
});
// ----- LOGIN -----
client.login(TOKEN);
