/* ********************************************************
 * This project is remixed from [slack-blockkit](https://glitch.com/slash-blockkit).
 * ********************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const nedb = require('nedb-promise');
const request = require('request-promise');
const signature = require('./verifySignature');

const app = express();
const db_char_sheet = new nedb({ filename: '.data/char_sheet.db', autoload: true });
const cache_char_sheet = {};

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});



/*
 * Slash Command Endpoint to receive a payload 
 */

app.post('/char-register', async (req, res) => {
  if(!signature.isVerified(req)) {
    res.sendStatus(403);
    return;
  }

  // console.log(JSON.stringify(req.body));

  const user_id = req.body.user_id;
  const char_id = req.body.text;

  if (char_id == '') {
    const text = 'キャラシIDを指定してください。キャラシIDはキャラクター保管庫で確認できます。\n/char-register キャラシID';
    res.json(toMessage(text));
    return;
  }

  try {
    const char_sheet = await requestCharSheet(char_id);
    await storeCharSheet(user_id, char_id);
    const text = char_sheet.pc_name + ' のキャラシを登録しました！';
    res.json(toMessage(text));
  } catch (e) {
    console.log(e.message);
    const text = 'キャラシの登録に失敗しました。\nキャラシIDを確認してください。(ID=' + char_id + ')';
    res.json(toMessage(text));
  }
}

const toMessage = (text) => {
  return {
    response_type: 'in_channel',
    text: text,
  };
};

const requestCharSheet = async (char_id) => {
  const options = {
    url: 'https://charasheet.vampire-blood.net/' + char_id + '.js',
    method: 'GET',
    json: true,
  };
  return request(options);
};

const storeCharSheet = async (user_id, char_id) => {
  cache_char_sheet[user_id] = char_id;
  return db_char_sheet.insert({ user_id: user_id, char_id: char_id });
};

