const jwt = require('jsonwebtoken');
const config = require('config');
const accounts = require('./accounts.json');
const fs = require('fs');

// Method that attempts to register a user 
module.exports = function (req, res, next) {
  const email = req.body.identifier;
  const password = req.body.password;
  const repeatPassword = req.body.repeatPassword;
  const roles = req.body.roles;

  if(!email || !password || !repeatPassword) throw new Error('Please provide all of the required values!');

  const passwordRegex = /^[A-Za-z]\w{7,15}$/;
  const emailRegex = /\S+@\S+\.\S+/;
  const emailExists = accounts.find(o => o.identifier === email);

  if(!email.match(emailRegex)) throw new Error('INVALID_EMAIL.');

  if(emailExists) throw new Error('EMAIL_IS_ALREADY_USED'); 

  // TODO: if(!password.match(passwordRegex)) throw new Error('INVALID_PASSWORD. Must be 8 - 16 characters, must start with letter and contain at least one number.');

  if(repeatPassword !== password) throw new Error('PASSWORDS_DO_NOT_MATCH.');

  fs.readFile('accounts.json', 'utf8', function readFileCallback(err, data){
    if (err){
        throw new Error (err);
    } else {
    obj = JSON.parse(data);
    obj.push({identifier: email, password, roles});
    json = JSON.stringify(obj);
    
    fs.writeFile('accounts.json', json, 'utf8', () => { 
      res.status(200).end();
      console.log(obj);
    });
  }
}
  );
};
