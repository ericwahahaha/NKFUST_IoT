/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
var rp = require('request-promise');

const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore = Datastore();



exports.helloWorld = function helloWorld(req, res) {
  // Example input: {"message": "Hello!"}
  
  var key_static_obj = new Object();
  key_static_obj.name  = 'led_control';
  key_static_obj.kind = 'led';
  var temp_string = '我覺得不行';
  
  switch (req.method) {
    case 'GET':
      
      return datastore.get(key_static_obj)
        .then(([entity]) => {
        // The get operation will not fail for a non-existent entity, it just
        // returns null.
        if (!entity) {
          throw new Error(`No entity found for key ${key_static_obj.name}.`);
        }
        res.status(200).send(`${entity.description}`);
      })
        .catch((err) => {
        console.error(err);
        res.status(500).send(err);
        return Promise.reject(err);
      });
      res.status(200).send('Success: ' + msg );
      break;
    case 'POST':
      var msg = req.body.events[0].message.text;
  
      var static_value = new Object();
      static_value.description = req.body.events[0].message.text;
      
      console.log(req.body.events[0].replyToken);
      console.log(msg);
      
      if(msg == 1 || msg == 0){
        send_message(req.body.events[0].replyToken, msg);
      } else {
        send_message(req.body.events[0].replyToken, temp_string);
      }
      
      
     
      
      const entity = {
        key: key_static_obj,
        data: static_value
      };
      
      return datastore.save(entity)
        .then(() => res.status(200).send(`Entity ${key_static_obj.name} saved.`))
        .catch((err) => {
        console.error(err);
        res.status(500).send(err);
        return Promise.reject(err);
      });
      
      res.status(200).send('Success: ' + msg );
      console.log(msg);
      break;
    default:
      res.status(500).send({ error: 'Something blew up!' });
      break;
  }
  
/*  
  if (req.body.message === undefined) {
    This is an error case, as "message" is required.
    res.status(400).send('No message defined!');
  } else {
     Everything is okay.
    console.log(req.body.message);
    res.status(200).send('Success: ' + req.body.message + 'g8');
  }*/
};


function send_message(line_reply_token, line_message){
   var options = {
            method: 'POST',
            uri: "https://api.line.me/v2/bot/message/reply",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              "Authorization": " Bearer " + "gu25bXxdkR7aWcKGETKxL9ataz6wCQOxL81SSmh9L/6qNfhQzHUti/5RguB7ThgpmfbQgzikLbLFhvU9XmH0oU11mwsUXkoP80ZUljk4yyXWdVUnC7WYqHI2LpHV5rUhUDjQY4+CiYLBV3NP/SkkxwdB04t89/1O/w1cDnyilFU="
            },
            json: true,
            body: {
              replyToken: line_reply_token,
              messages:[
                {
                  "type":"text",
                  "text": line_message
                }
              ]
            }
        };

        return rp(options)
        .then(function (response) {
            console.log("Success : " + response);
        }).catch(function (err) {
            console.log("Error : " + err);
        });
}
