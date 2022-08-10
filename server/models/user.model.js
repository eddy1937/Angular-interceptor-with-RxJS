const bcrypt = require('bcrypt');
const users = [
    {
      id: 1,
      username: '艾迪王',
      account: 'eddylin',
      password: bcrypt.hashSync('password', +process.env.BCRYPT_SALT)
    },
  ];
exports.users = users;