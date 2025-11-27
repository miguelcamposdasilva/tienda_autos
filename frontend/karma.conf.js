const path = require('path');

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load the CommonJS config and re-export as the default ESM export
const cfg = require('./karma.conf.cjs');
export default cfg;
