# Link Bot

A customizable discord bot for distributing links.

# Features
 - Adding and removing links
 - No Duplicate Links
 - Link categories
 - View links by category
 - Customizable embeds
 - Customizable limits
 - Reset limits by user or for the entire server

# Commands
| Command    |  Description                |                 Example                  |
| ---------- | --------------------------- | ---------------------------------------- |
| /add       | Add a link                  | /add `Example` `https://example.com/`    |
| /remove    | Remove a link               | /remove `Example` `https://example.com/` |
| /selection | Creates a selection pannel  | /selection `Links!`                      |
| /list      | Lists all links of the type | /list `Example`                          |
| /reset     | Resets the limits           | /reset `@Cohen#9959`                     |
| /limit     | Chaanges the limit          | /limit `5`                               |

# Getting Started

## Invite

The simplest way to get started is to invite the bot to your server. Thats it!

https://discord.com/api/oauth2/authorize?client_id=970138334858985512&permissions=2048&scope=bot%20applications.commands


## Self-hosting

If you want to host the bot yourself, you can follow the steps below.

### Cloning
```bash
$ git clone https://github.com/Radon-Games/Link-Bot
$ cd Link-Bot
$ npm install
```

### Configuration

To finish the setup of Link Bot, you will need to supply a bot token. Create a file called `.env` in the root directory of the bot and add follow the template below.

```
TOKEN=your-bot-token
```

### Starting

```bash
$ npm start
```
