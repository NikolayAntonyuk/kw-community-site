const { spawn } = require('child_process');

const fs = require('fs');

const cloudflaredBin = fs.existsSync('/home/mykola/.local/bin/cloudflared')
  ? '/home/mykola/.local/bin/cloudflared'
  : (fs.existsSync('/tmp/cloudflared.pkg') ? '/tmp/cloudflared.pkg' : 'cloudflared');

const tunnel = spawn(cloudflaredBin, [
  'tunnel',
  '--url', 'http://localhost:3010'
]);

tunnel.stdout.on('data', (data) => {
  console.log(`${data}`);
});

tunnel.stderr.on('data', (data) => {
  console.error(`${data}`);
});

tunnel.on('close', (code) => {
  console.log(`Tunnel exited with code ${code}`);
  process.exit(code);
});
