# Slach commands for CoC

Provides handy shash commands of slack for CoC sessions.

## commands

### /char-register char_id

Registers a character sheet of [キャラクター保管庫](https://charasheet.vampire-blood.net/coc_pc_making.html).

You can find a character sheet id on the url.

### /char-arts 技能

Rolls 1d100 and show if it succeeded or failed.

### /char-export

Exports all information of the registered character in JSON format.

---

## :gear: Setting up Your Slack App

### :zap: Creating a New Slack Slash Command

First, go to [Slack App Config page](https://api.slack.com/apps) to create an app.
Then add features you need.

For Slash command, interactive messages, and event, your Request URL should be your-server + /route, so it should look like:
`https://your-project.glich.me/command`


### :key: Getting Your Credentials

Your *Signing Secret* key is at: 
Settings > **Basic information**

If you distribute your app to public, you'll need the Client ID and Client Secret too.

The credential info is stored in the `.env` file. 🗝

```
SLACK_SIGNING_SECRET=enter_code_with_no_space
```

(Rename the `.env.sample ` in this repo to `.env`, and fill it out with your credentials!)

---

This project is remixed from [slack-blockkit](https://glitch.com/slash-blockkit)

