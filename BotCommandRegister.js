const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

// ----- CONFIG -----
const TOKEN = "Why are you looking?";
const CLIENT_ID = "Nah im not giving you that.";

// ----- LOAD COMMANDS -----
const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

// ----- REGISTER GLOBAL COMMANDS -----
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("⏳ Refreshing global slash commands...");
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log("✅ Global slash commands registered successfully!");
  } catch (err) {
    console.error(err);
  }
})();
