const fs   = require('fs');
const path = require('path');

const BASELINE_DIR = path.join(__dirname, '..', 'screenshots', 'baseline');

if (fs.existsSync(BASELINE_DIR)) {
  fs.rmSync(BASELINE_DIR, { recursive: true, force: true });
  console.log('[reset] Baseline dihapus. Jalankan ulang test untuk membuat baseline baru.');
} else {
  console.log('[reset] Folder baseline tidak ditemukan — tidak ada yang perlu dihapus.');
}
