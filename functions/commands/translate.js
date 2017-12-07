require('dotenv').config()

const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const utils = lib.utils({
  service: 'slack-demo-app'
});

const han = require('han')
const hanzi = require("hanzi");
hanzi.start();

const request = require('superagent');
const YANDEX_KEY = process.env.YANDEX_KEY;

/**
* GET /translate
*
* Translate chinese characters to pinyin.
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
  const YANDEX_URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate?lang=zh-en&key=' + YANDEX_KEY;

  request
    .post(YANDEX_URL)
    .type('form')
    .send({ 
      text: text 
    }) // sends a JSON post body
    .end(function(err, res){
      if (err) {
        utils.log.error("error message", new Error("yandex error"), (err) => {
          // Handle error
          callback(null, {
            response_type: 'in_channel',
            text: "something went wrong", // full english translation
          });
        });
      }
      // Calling the end function will send the request
      const resp = res.body;
      callback(null, {
        response_type: 'in_channel',
        text: resp.text[0], // full english translation
        "attachments": generateSentenceTranslations(text)
      });
    });
};

/**
* Generate array of attachments for response.
* Each attachment = one sentence with original and pinyin.
**/
function generateSentenceTranslations(text) {
  const attachments = [];
  const sentences = text.split(' ')

  sentences.forEach(sentence => {
    const pair = translateSentenceToPinyin(sentence);
    const segments_original = pair[0];
    const segments_pinyin_arr = pair[1];
    
    const attachment = {
      title: segments_original.join(' '), // original chinese 
      text: segments_pinyin_arr.join(' ') // pinyin
    };
    attachments.push(attachment);
  });

  return attachments;
}

/**
 * Split a Chinese sentence to segments and translate each to pinyin.
 * 
 * @param text    The Chinese character string to translate.
 * @return array  [ [segments as the original Chinese characters], [segments as their pinyin] ]
 **/
function translateSentenceToPinyin(text) {
  // split into segments then join with 
  const segments = hanzi.segment(text);
  // convert each segment to pinyin 
  const han_segments = segments.map(segment => {
    const definition = hanzi.definitionLookup(segment, 's');
    const han_pinyin = han.pinyin(segment);
    return pinyinArrayToString(han_pinyin, '')
  });
  // const han_segments_str = han_segments.join(' · ')
  return [segments, han_segments];
}

// take array of pinyin arrays
// map each arr to their first option or word if English
// [ [ 'shì' ], [ 'cháng', 'chǎng' ] ] => 'shìcháng'
function pinyinArrayToString(elem_arr, delimiter) {
  return elem_arr.map(elem => {
    if (Array.isArray(elem)) {
      // arr of pinyin options
      return elem.slice(0, 1);
    } else {
      // english word
      return [elem]
    }
  }).join(delimiter)
}
