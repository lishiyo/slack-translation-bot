# Translation bot

![demo gif](/demo_wechat.gif?raw=true "Wechat demo")

Slack bot that translates Chinese with pinyin.

Toolkit:
* [StdLib](https://stdlib.com/) for serverless functions as backend
* [Hanzi](https://github.com/nieldlr/Hanzi) for Chinese segmentation
* [Han](https://github.com/sofish/han) for Chinese -> pinyin
* [Yandex](https://www.yandex.com/) for Chinese -> English (why not Google Translate? Because of difficulties getting Google Cloud to work with heroku deployment atm)

### Usage

```
git clone https://github.com/lishiyo/slack-translation-bot.git
npm install

// sign up for StdLib account, create a new app (ex named `slack-translation-bot`), and install command line tools
npm install lib.cli -g

// sign up for Slack
// Click "Add a Bot User" to create your bot
```

Create a `.env` file and add keys for: 
- `YANDEX_KEY` - get a free API key from https://tech.yandex.com/translate/
- `STDLIB_TOKEN` - get your app's StdLib Token from [StdLib Dashboard](https://dashboard.stdlib.com/dashboard/)
- slack tokens - scroll down on the Basic Information panel to find:
  - `SLACK_CLIENT_ID`
  - `SLACK_CLIENT_SECRET`
  - `SLACK_VERFICIATION_TOKEN`

Add the bot to the Slack team:
- enable Slash Commands (see [minute 6 of this tutorial](https://medium.com/slack-developer-blog/build-a-serverless-slack-bot-in-9-minutes-with-node-js-and-stdlib-b993cfa15358))
- modify `SLACK_REDIRECT` to `https://<username>.lib.id/<app-name></app-name>@dev/auth/` where <username> is your StdLib username and <app-name> is the StdLib name
 - ex: https://lishiyo.lib.id/slack-demo-app@dev/auth/
- Go to  `https://<username>.lib.id/<app-name></app-name>@dev/` and click the "Add to Slack" button to authorize the bot for your team!

Test it out: type `/translate 你吃饭了吗` in a slack channel. 

### Development

To check if this is working, run:
`lib .commands.translate test general "你吃饭了吗? 你最近怎么样?" -d`

Response should be:
```
{
  "response_type": "in_channel",
  "text": "You eat? How you doing?",
  "attachments": [
    {
      "title": "你 吃饭 了 吗 ?",
      "text": "nǐ chīfàn le ma ?"
    },
    {
      "title": "你 最近 怎么样 ?",
      "text": "nǐ zùijìn zěnyāoyáng ?"
    }
  ]
}
```
