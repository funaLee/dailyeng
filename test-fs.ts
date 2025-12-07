
import * as fs from 'fs';
import * as path from 'path';

try {
    const p = path.join(process.cwd(), 'test-fs.txt');
    fs.writeFileSync(p, 'filesystem write works');
    console.log('wrote to ' + p);
} catch (e) {
    console.error(e);
}
