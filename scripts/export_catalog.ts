import fs from 'fs';
import path from 'path';

const searchDir = 'src/content/problems';
const outputCsv = 'problems_catalog.csv';

function getStats(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(getStats(fullPath));
        } else if (file.endsWith('.exercise.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            
            // Regex parsing
            const idMatch = content.match(/id:\s*'([^']+)'/);
            const titleMatch = content.match(/title:\s*'([^']+)'/);
            const orderMatch = content.match(/order:\s*(\d+)/);
            const tagsMatch = content.match(/tags:\s*\[(.*?)\]/);
            
            if (idMatch) {
                const id = idMatch[1];
                const title = titleMatch ? titleMatch[1] : '';
                const order = orderMatch ? orderMatch[1] : '10000';
                
                let tags = '';
                if (tagsMatch) {
                    tags = tagsMatch[1]
                        .replace(/'/g, '')
                        .split(',')
                        .map(t => t.trim())
                        .filter(t => t)
                        .join(';');
                }

                results.push({ id, title, order: parseInt(order, 10), tags, path: fullPath });
            }
        }
    }
    return results;
}

const data = getStats(searchDir);

// Sort by order initially
data.sort((a, b) => a.order - b.order);

let csvContent = 'ID,Title,Order,Tags\n';
for (const item of data) {
    // Escape quotes in title
    const cleanTitle = item.title.replace(/"/g, '""');
    csvContent += `${item.id},"${cleanTitle}",${item.order},${item.tags}\n`;
}

fs.writeFileSync(outputCsv, csvContent, 'utf8');
console.log(`Generated ${outputCsv} with ${data.length} records.`);
