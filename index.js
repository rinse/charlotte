/* ********************************************************
 * This project is remixed from [slack-blockkit](https://glitch.com/slash-blockkit).
 * ********************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const signature = require('./verifySignature');

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
  if(!signature.isVerified(req)) {
    res.sendStatus(403);
    return;
  }

  // console.log(JSON.stringify(req.body));

  const user_id = req.body.user_id;
  const char_id = req.body.text;
  const message = {
    response_type: 'in_channel',
    text: JSON.stringify({user_id: user_id, char_id: char_id}),
  };
  res.json(message);
});

