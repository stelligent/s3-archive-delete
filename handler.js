'use strict';

console.log('Loading func');
module.exports.commands = (event, context, callback) => {

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      text: 'We gots Spirit of Guidance bots!!!',
      input: event,
    }),
  };

  callback(null, response);
};
