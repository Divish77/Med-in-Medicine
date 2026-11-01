import http from 'http';

const PORT = process.env.PORT || 3009;

async function waitForServer(retries = 20) {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${PORT}/`, (res) => {
          resolve(true);
        });
        req.on('error', reject);
        req.setTimeout(1000, () => { req.destroy(); reject(new Error('timeout')); });
      });
      return true;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error('Server did not start in time');
}

async function testUrl(path, expectedStrings) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Expected 200 from ${path}, got ${res.statusCode}`));
        }
        for (const str of expectedStrings) {
          if (!data.includes(str)) {
            return reject(new Error(`Missing expected string "${str}" in ${path}`));
          }
        }
        resolve({ path, status: res.statusCode, length: data.length });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Waiting for Next.js server to be ready on port ' + PORT + '...');
  await waitForServer();
  console.log('Testing footer routes...');

  const privacy = await testUrl('/privacy-policy', [
    'Privacy Policy',
    'Information We Collect',
    'Prescription Privacy',
    'Supabase Row Level Security',
    '1800-633-646',
    'care@medinminutes.com'
  ]);
  console.log(`✓ Privacy Policy passed: HTTP ${privacy.status} (${privacy.length} bytes)`);

  const terms = await testUrl('/terms-of-service', [
    'Terms of Service',
    'User Responsibilities',
    '10-Minute Delivery Target',
    'AI-based prescription',
    '1800-633-646'
  ]);
  console.log(`✓ Terms of Service passed: HTTP ${terms.status} (${terms.length} bytes)`);

  const standards = await testUrl('/pharmacy-standards', [
    'Pharmacy Standards',
    'Cold-Chain Protocol',
    'Triple-Point Verification',
    'Licensed Suppliers Only',
    '1800-633-646'
  ]);
  console.log(`✓ Pharmacy Standards passed: HTTP ${standards.status} (${standards.length} bytes)`);

  const home = await testUrl('/', [
    '/privacy-policy',
    '/terms-of-service',
    '/pharmacy-standards',
    'Med-in-Minutes'
  ]);
  console.log(`✓ Homepage footer links passed: HTTP ${home.status}`);

  console.log('\nALL 4 ROUTES AND FOOTER VERIFICATIONS PASSED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
