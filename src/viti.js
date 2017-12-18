#!/usr/bin/env node
const program = require('commander');
const getEncryptedProxy = require('./utils/getEncryptedProxy');
const socks5 = require('simple-socks');

program
  .option('-l, --local', 'local mode')
  .option('-r, --remote', 'remote mode')
  .option('-h, --host [address]', 'remote host address for local mode', '127.0.0.1')
  .option('-p, --password [password]', 'password used to encrypt tcp data')
  .parse(process.argv);

if(program.local && program.host && !program.remote) {
  const localServer = getEncryptedProxy({
    remoteHost: program.host, 
    remotePort: 2335,
    type: 'local',
    password: new Buffer(program.password, 'binary'),
  });
  
  localServer.listen(2334, () => {
    console.log('local encrypt server is up on port', 2334);
  });
} else if(program.remote && !program.local) {
  const server = socks5.createServer().listen(2336, '127.0.0.1');
  console.log('socks5 server is up on port', 2336);

  const remoteServer = getEncryptedProxy({
    remoteHost: '127.0.0.1', 
    remotePort: 2336, 
    type: 'remote', 
    password: new Buffer(program.password, 'binary'),
  });
  
  remoteServer.listen(2335, () => {
    console.log('encrypt server is up on port', 2335);
  });
} else {
  console.log('Wrong params, seek sample usage in README.md please');
}

process.on('uncaughtException', err => {
  console.log('An uncaught error happens:', err);
});
