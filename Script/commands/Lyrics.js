function _0x3a9b(_0x1d2f2b,_0x5f0b8a){const _0x4ef3=_0x1c7a();return _0x3a9b=function(_0x3a9b6d,_0x199a63){_0x3a9b6d=_0x3a9b6d-0x11a;let _0x5f6c1b=_0x4ef3[_0x3a9b6d];return _0x5f6c1b;},_0x3a9b(_0x1d2f2b,_0x5f0b8a);}const _0x2d1f=_0x3a9b;(function(_0x4a7f6b,_0x2e5b2f){const _0x2f8c7b=_0x3a9b,_0x35b8f1=_0x4a7f6b();while(!![]){try{const _0x3b8fda=-parseInt(_0x2f8c7b(0x12a))/0x1*(parseInt(_0x2f8c7b(0x13d))/0x2)+-parseInt(_0x2f8c7b(0x125))/0x3*(parseInt(_0x2f8c7b(0x138))/0x4)+parseInt(_0x2f8c7b(0x123))/0x5*(-parseInt(_0x2f8c7b(0x12e))/0x6)+-parseInt(_0x2f8c7b(0x121))/0x7+parseInt(_0x2f8c7b(0x11f))/0x8*(parseInt(_0x2f8c7b(0x136))/0x9)+parseInt(_0x2f8c7b(0x129))/0xa;if(_0x3b8fda===_0x2e5b2f)break;else _0x35b8f1['push'](_0x35b8f1['shift']());}catch(_0x1c6a2f){_0x35b8f1['push'](_0x35b8f1['shift']());}}}(_0x1c7a,0x56b63));function _0x1c7a(){const _0x4c2a=['1883740pQomXq','lyrics','writeFileSync','media','get','arraybuffer','exports','725751GqfVgD','credits','run','fs','Please\x20enter\x20the\x20song\x20name!','sendMessage','createReadStream','title','artist','An\x20error\x20occurred\x20while\x20fetching\x20lyrics.','cache','axios','version','name','description','commandCategory','usages','cooldowns','/cache/lyrics.png','buffer','1819250KZbQpi','1710464HYeTgk','283614lqVqjX','934016xDrwYu','2274320nJmXgV'];_0x1c7a=function(){return _0x4c2a;};return _0x1c7a();}

const axios = require(_0x2d1f(0x130));
const fs = require(_0x2d1f(0x11b));
const path = __dirname + _0x2d1f(0x135);

module[_0x2d1f(0x131)] = {};
module[_0x2d1f(0x131)][_0x2d1f(0x128)] = {
  name: _0x2d1f(0x132),
  version: '3.0.0',
  hasPermssion: 0,
  credits: 'Priyansh Rajput + Mehedi Hasan',
  description: _0x2d1f(0x137),
  commandCategory: _0x2d1f(0x122),
  usages: _0x2d1f(0x133),
  cooldowns: 5
};

module[_0x2d1f(0x131)][_0x2d1f(0x127)] = async function({ api: _0x2b3f6b, event: _0x5d2b8a, args: _0x4b6d6c }) {
  const _0x4f7e = _0x2d1f;
  const { threadID: _0x2d9b5c } = _0x5d2b8a;

  try {
    if (!_0x4b6d6c || _0x4b6d6c.length === 0) return _0x2b3f6b[_0x4f7e(0x11e)](_0x4f7e(0x12b), _0x2d9b5c);

    const _0x159c2d = _0x4b6d6c.join(' ');
    const _0x3a2d5e = `${'https://ai.new911.repl.co/api/tools/lyrics?song='}${encodeURIComponent(_0x159c2d)}`;
    const _0x2f6b3a = await axios.get(_0x3a2d5e);
    const _0x5a4f9f = _0x2f6b3a.data;

    // ensure cache dir exists
    const _0x4c7f7b = __dirname + _0x4f7e(0x134);
    const _0x29a3a5 = require('path');
    const _0xcacheDir = _0x29a3a5.dirname(_0x4c7f7b);
    if (!fs.existsSync(_0xcacheDir)) {
      try { fs.mkdirSync(_0xcacheDir, { recursive: true }); } catch(e) {}
    }

    const _0ximgRes = await axios.get(_0x5a4f9f[_0x4f7e(0x126)], { responseType: _0x4f7e(0x124) });
    fs[_0x4f7e(0x11d)](__dirname + _0x4f7e(0x134), Buffer.from(_0ximgRes.data));

    const _0xmessage = '❏ Credit: Priyansh\n\n' +
      `❏ Title: ${_0x5a4f9f[_0x4f7e(0x12f)]}\n` +
      `❏ Artist: ${_0x5a4f9f[_0x4f7e(0x12c)]}\n\n` +
      `❏ Lyrics:\n${_0x5a4f9f['lyrics']}\n\n` +
      `❏ Contact: https://priyansh.infopriyansh.repl.co/`;

    return _0x2b3f6b[_0x4f7e(0x11e)]({ body: _0xmessage, attachment: fs.createReadStream(__dirname + _0x4f7e(0x134)) }, _0x2d9b5c);
  } catch (_0x5b2a6a) {
    console.error(_0x5b2a6a);
    return _0x2b3f6b[_0x2d1f(0x11e)](_0x2d1f(0x129), _0x5d2b8a.threadID);
  }
};
