import fs from 'fs';
import path from 'path';

const searchDir = 'src/content/problems';
const inputCsv = 'problems_catalog.csv';

function importStats(dir, catalogMap) {
    let count = 0;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            count += importStats(fullPath, catalogMap);
        } else if (file.endsWith('.exercise.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const idMatch = content.match(/id:\s*'([^']+)'/);
            if (idMatch) {
                const id = idMatch[1];
                const catalogItem = catalogMap.get(id);
                if (catalogItem) {
                    let changed = false;
                    
                    // Update order
                    const newContent = content.replace(/(\border:\s*)\d+/, `$1${catalogItem.order}`);
                    if (newContent !== content) {
                        content = newContent;
                        changed = true;
                    }
                    
                    // Update tags
                    const tagString = catalogItem.tags.split(';').map(t => `'${t.trim()}'`).join(', ');
                    const newContentTags = content.replace(/(\btags:\s*\[)(.*?)(\])/, `$1${tagString}$3`);
                    if (newContentTags !== content) {
                        content = newContentTags;
                        changed = true;
                    }

                    if (changed) {
                        fs.writeFileSync(fullPath, content, 'utf8');
                        console.log(`Updated ${id}`);
                        count++;
                    }
                }
            }
        }
    }
    return count;
}

const csvData = fs.readFileSync(inputCsv, 'utf8').split('\n');
const catalogMap = new Map();

for (let i = 1; i < csvData.length; i++) {
    const line = csvData[i].trim();
    if (!line) continue;
    
    // Parse CSV line (handle quotes in title)
    // ID,Title,Order,Tags
    // sum-array,"Sum of Array",401,accumulator;cse201
    
    const parts = line.split(',');
    if (parts.length < 4) continue;
    
    const id = parts[0];
    const tags = parts[parts.length - 1];
    const order = parts[parts.length - 2];
    
    catalogMap.set(id, { order: parseInt(order, 10), tags });
}

const numUpdated = importStats(searchDir, catalogMap);
console.log(`Total problems updated from CSV: ${numUpdated}`);
