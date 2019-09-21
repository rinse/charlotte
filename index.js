/* ********************************************************
 * This project is remixed from [slack-blockkit](https://glitch.com/slash-blockkit).
 * ********************************************************/

const express = require('express');
const bodyParser = require('body-parser');

const charlotte = require('./charlotte');
const charsheet = require('./charsheet');
const utils = require('./utils');
const signature = require('./verifySignature');

const mapping_kanji = require('./mapping_kanji.json');

const app = express();


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
  if (!signature.isVerified(req)) {
    res.sendStatus(403);
    return;
  }

  // console.log(JSON.stringify(req.body));
  const char_id = req.body.text;
  const user_id = req.body.user_id;
  const text = await charlotte.registerChar(char_id, user_id);
  res.json(toMessage(text));
});


app.post('/char-arts', async (req, res) => {
  if (!signature.isVerified(req)) {
    res.sendStatus(403);
    return;
  }

  const arts_key = req.body.text;
  const user_id = req.body.user_id;

  try {
    const text = await charlotte.doArts(arts_key, user_id);
    res.json(toMessage(text));
  } catch (e) {
    console.log(e.message);
  }
});

app.post('/char-export', async (req, res) => {
  if(!signature.isVerified(req)) {
    res.sendStatus(403);
    return;
  }

  const user_id = req.body.user_id;

  const char_sheet = await charsheet.loadCharSheet(user_id);
  if (char_sheet == null) {
    const text = 'キャラシが登録されていません。';
    res.json(toMessage(text));
    return;
  }

  const text = JSON.stringify(char_sheet);
  res.json(toMessage(text));
});


const toMessage = (text) => {
  return {
    response_type: 'in_channel',
    text: text,
  };
};
