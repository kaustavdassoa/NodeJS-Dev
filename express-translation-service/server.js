const translate = require('google-translate-api');
const langs = require('./node_modules/google-translate-api/languages.js');
const express = require('express');

var app = express();

app.get('/translate_to/:tolang/', (request, resposne) => {

  console.log("Language Key ="+langs[request.params.tolang]);
  if(typeof langs[request.params.tolang] != 'string')
  {
    resposne.send({
        error:"language "+request.params.tolang+" not supported",
        correct_url:request.protocol+":"+request.hostname+"/translate_to/[id]/text=[YOUR STRING GOES HERE]",
        supporting_languages :langs
      });
  }

  translate(request.query.text, {
      from: 'auto',
      to: request.params.tolang || 'en',
      //to: langs[request.params.tolang] || en,
      raw: false
    }).then(res => {

        var reply = {
          orginal_text: request.query.text,
          translate_text: res.text,
          from_language :langs[res.from.language.iso].toLowerCase() || 'unknown',
          to_language : langs[request.params.tolang].toLowerCase() || 'unknow'
        };

        resposne.send(reply);
    }).catch(err => {
      resposne.send({
          error:err,
          correct_url:request.protocol+":"+request.hostname+"/translate_to/[id]/text=[YOUR STRING GOES HERE]",
          supporting_languages :langs
        });
    });


});


app.get('/getSupportingLanguages', (request, resposne) => {
  resposne.send({
      supporting_languages :langs
    });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
