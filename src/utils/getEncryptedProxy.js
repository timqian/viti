const net = require("net");
const { encrypt, decrypt } = require('./encrypt');

module.exports = function getEncryptedProxy({remoteHost, remotePort, type = '', password}) {
  return net.createServer({allowHalfOpen: true}, localsocket => {
    // connect to remote tcp server
    const remotesocket = new net.Socket();
    remotesocket.connect(remotePort, remoteHost);
  
    localsocket.on('data', data => {
      data = type === 'local' ? encrypt(data, password) : decrypt(data, password);  
      if (!remotesocket.write(data)) localsocket.pause();
    });
  
    remotesocket.on('data', data => {
      data = type === 'local' ? decrypt(data, password) : encrypt(data, password);
      if(!localsocket.write(data)) remotesocket.pause();
    });

    localsocket.on("drain", function() {
      if(remotesocket) remotesocket.resume();
    });

    remotesocket.on("drain", function() {
      if(localsocket) localsocket.resume();
    });

    // for Error: This socket has been ended by the other party
    // https://github.com/websockets/ws/issues/704
    localsocket.on('close', () => {
      if(remotesocket) remotesocket.end();
    });
  
    remotesocket.on('close', () => {
      if(localsocket) localsocket.end();
    });

    localsocket.on('end', () => {
      if(remotesocket) remotesocket.end();
    });
  
    remotesocket.on('end', () => {
      if(localsocket) localsocket.end();
    });

    localsocket.on('error', (error) => {
      console.log(error,'err local');
    })
    remotesocket.on('error', (error) => {
      console.log(error,'err');
    })

  });
}
