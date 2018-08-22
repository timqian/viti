 simple-shadow

> [中文介绍](./README_CN.md)

A 100 line shadowsocks like firewall tunneling proxy written in nodejs with educational purpose.

## Usage

```bash
# install
npm install -g viti

# start remote server
viti --remote --password 'sample password'

# start local server and connect with remote
viti --local --host '127.0.0.1' --password 'sample password'
```

#### Note
1. local server will be listening on `127.0.0.1:1081`; Then, you need to [set up socks proxy for your computer](https://github.com/timqian/my-notes/issues/149)
1. remote server will be listening on port `1082`; make sure this port is opened.
1. password of remote and local server should be the same

## How simple-shadow works
#### The principle is simple:

Your local machine is not able to visit google.com because a firewall blacklist the google's IP or reading your request and preventing you from visit google. 

However, you have another machine which you can access and that machine can access google.com.

It is easy to think of that you can ask that machine to visit sites on behalf of you and return result back to you.
But the firewall may reading your request to that machine. So, you will need to encrypt your data when you are requesting that machine.

#### Detailed procedure is
1. browser want to visit google.com; the request is sent in SOCKS5 protocal to `local tcp proxy`
1. `local tcp proxy` encrypt the data and send to `remote tcp proxy`(pass the wall)
1. `remote tcp proxy` decrypt the data and send to `SOCKS5 server`
1. `SOCKS5 server` do the request to google.com and send the response back to `remote tcp proxy`
1. `remote tcp proxy` encrypt the data and send to `local tcp proxy`(pass the wall)
1. `local tcp proxy` decrypt the data and send back to brower, now you can access google.com!

![](./assets/structure.png)

## Concepts to grasp
- [SOCKS5](https://en.wikipedia.org/wiki/SOCKS): An Internet protocol that exchanges network packets between a client and server through a proxy server. We use SOCKS5 as a request client on remote server.
- [AES (Advanced Encryption Standard)](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard): AES is an [symmetric-key algorithm](https://en.wikipedia.org/wiki/Symmetric-key_algorithm) (the same key is used for both encrypting and decrypting the data). We use AES to encrypt data in order to pass through the wall.

## Good reads about GFW

- [**original share post of shadowsocks**](https://www.v2ex.com/t/32777?p=2)
- [GFW 斗争史](https://blog.yandere.moe/moe/gfw-vs-proxy/97.html)
- [全面学习GFW](https://cokebar.info/archives/253)
- [为什么不应该用 SSL 翻墙](https://gist.github.com/clowwindy/5947691)
- [为何 shadowsocks 要弃用一次性验证 (OTA)](https://blessing.studio/why-do-shadowsocks-deprecate-ota/)
