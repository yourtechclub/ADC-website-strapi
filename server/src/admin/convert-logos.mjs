import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const iconBuffer = readFileSync(join(__dirname, 'stc-icon.png'));
  const logoBuffer = readFileSync(join(__dirname, 'stc-logo.png'));
  
  const iconBase64 = `data:image/png;base64,${iconBuffer.toString('base64')}`;
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  
  console.log('// Icon for sidebar/menu (small square logo)');
  console.log(`const ICON_LOGO = '${iconBase64}';`);
  console.log('\n// Logo for login page (horizontal logo)');
  console.log(`const LOGIN_LOGO = '${logoBase64}';`);
} catch (error) {
  console.error('Error:', error.message);
}
