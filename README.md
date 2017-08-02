# Translation bot

![demo gif](/demo_wechat.gif?raw=true "Wechat demo")

Slack bot to translate Chinese with pinyin.

Toolkit:
* [Hanzi](https://github.com/nieldlr/Hanzi) for Chinese segmentation
* [Han](https://github.com/sofish/han) for Chinese -> pinyin
* Yandex for Chinese -> English  
  * Why not Google Translate - Google Cloud isn't working atm with heroku deploy
* stdlib for serverless functions + slack bot template

### Usage

Add the bot to the Slack team: 
- See minutes 6-8 from https://medium.com/slack-developer-blog/build-a-serverless-slack-bot-in-9-minutes-with-node-js-and-stdlib-b993cfa15358

Type `/translate 你吃饭了吗` in slack channel.

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
