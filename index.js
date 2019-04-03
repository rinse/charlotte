/* ********************************************************
 * Slack Node+Express Slash Commands Example with BlockKit
 *
 * Tomomi Imura (@girlie_mac)
 * ********************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
//const qs = require('qs');
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

app.post('/command', async (req, res) => {
  
  if(!signature.isVerified(req)) {
    res.sendStatus(404); // You may throw 401 or 403, but why not just giving 404 to malicious attackers ;-)
    return;
    
  } else {
    // Do something!
    //console.log(req.body.text);
    
    const query = req.body.text ? req.body.text : 'lunch, San Francisco';
    const queries = query.split(',');
    const term = queries.shift(); // "Pizza" 
    const location = queries; // "San Francisco, CA"
    
    console.log(location);
    
    const places = await getPlaces(query, location);
    console.dir(places);
    
    
    // and send back an HTTP response with data
    const message = {
      response_type: 'in_channel',
      
      blocks: [
        // Result 1
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*<${places[0].url}|${places[0].name}>* \n${places[0].location.display_address.join(' ')} \n\nRating: ${places[0].rating} on Yelp \nPrice: ${await getMoneybags(places[0].price)}`
          },
          accessory: {
            type: 'image',
            image_url: `${places[0].image_url}`,
            alt_text: 'venue image'
          }
        },       
        {
          'type': 'context',
          'elements': [
            {
              'type': 'image',
              'image_url': 'https://cdn.glitch.com/203fa7da-fadf-4c32-8d75-fb80800ef1b5%2Fyelp_logo_sm.png?1550364622921',
              'alt_text': 'Yelp logo'
            },
            {
              'type': 'plain_text',
              'text': `${places[0].review_count} reviews`,
              'emoji': true
            }
          ]
        },
        {
          'type': 'divider'
        },

        // Result 2
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*<${places[1].url}|${places[1].name}>* \n${places[1].location.display_address.join(' ')} \n\nRating: ${places[1].rating} on Yelp \nPrice: ${await getMoneybags(places[1].price)}`
          },
          accessory: {
            type: 'image',
            image_url: `${places[1].image_url}`,
            alt_text: 'venue image'
          }
        },
        {
          'type': 'context',
          'elements': [
            {
              'type': 'image',
              'image_url': 'https://cdn.glitch.com/203fa7da-fadf-4c32-8d75-fb80800ef1b5%2Fyelp_logo_sm.png?1550364622921',
              'alt_text': 'Yelp logo'
            },
            {
              'type': 'plain_text',
              'text': `${places[1].review_count} reviews`,
              'emoji': true
            }
          ]
        },
        {
          'type': 'divider'
        },
        
        // Result 3
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*<${places[2].url}|${places[2].name}>* \n${places[2].location.display_address.join(' ')} \n\nRating: ${places[2].rating} on Yelp \nPrice: ${await getMoneybags(places[2].price)}`
          },
          accessory: {
            type: 'image',
            image_url: `${places[2].image_url}`,
            alt_text: 'venue image'
          }
        },
        {
          'type': 'context',
          'elements': [
            {
              'type': 'image',
              'image_url': 'https://cdn.glitch.com/203fa7da-fadf-4c32-8d75-fb80800ef1b5%2Fyelp_logo_sm.png?1550364622921',
              'alt_text': 'Yelp logo'
            },
            {
              'type': 'plain_text',
              'text': `${places[2].review_count} reviews`,
              'emoji': true
            }
          ]
        },
        {
          'type': 'divider'
        }
      ]

    };
    
    res.json(message);
    
    // const m = {
    //   response_type: 'in_channel',
    //   text: `${places[0].name}`,
    // };
    // res.json(m);
    
  }
});


const getPlaces = async(term, location) => {  
  const header = {
    Authorization: `Bearer ${process.env.YELP_API_KEY}`
  };
  const url = `https://api.yelp.com/v3/businesses/search?limit=3&open_now=true&location=${location}&term=${term}`;
  const results = await axios.get(url, {headers: header});  
  return results.data.businesses;

};

// ⭐️
const getStars = (rating) => {
  let star = '';
  for(let i=1; i<=rating; i++){
    star += ':star:';
  }
  star += ` (${rating})`;
  return star;
}

// 💰
const getMoneybags = (price) => {
  if(!price) { return 'N/A'};
  
  let moneybag =  price.replace(/[$]/g, ':moneybag:');
  return moneybag;
}