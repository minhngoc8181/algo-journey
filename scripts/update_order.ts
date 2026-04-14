import fs from 'fs';
import path from 'path';

const cseOrder = [
    { targetId: 'first-index-of', oldName: 'index-of' },
    { targetId: 'last-index-of', oldName: 'last-index-of' },
    { targetId: 'contains-value', oldName: 'contains-value' },
    { targetId: 'max-element', oldName: 'find-max' },
    { targetId: 'find-min', oldName: 'find-min' },
    { targetId: 'index-of-max', oldName: 'index-of-max' },
    { targetId: 'index-of-min', oldName: 'index-of-min' },
    { targetId: 'sum-array', oldName: 'sum-all' },
    { targetId: 'average', oldName: 'average' },
    { targetId: 'count-occurrences', oldName: 'count-occurrences' },
    { targetId: 'count-max-occurrences', oldName: 'count-max-occurrences' },
    { targetId: 'count-unique', oldName: 'count-unique' },
    { targetId: 'most-frequent', oldName: 'most-frequent' },
    { targetId: 'reverse-array', oldName: 'reverse-array' },
    { targetId: 'bubble-sort', oldName: 'sort-ascending' },
    { targetId: 'sort-descending', oldName: 'sort-descending' },
    { targetId: 'second-extreme', oldName: 'second-extreme' },
    { targetId: 'all-indices', oldName: 'all-indices' },
    { targetId: 'is-sorted', oldName: 'is-sorted' },
    { targetId: 'remove-duplicates', oldName: 'remove-duplicates' },
    { targetId: 'pairs-with-sum', oldName: 'pairs-with-sum' },
    { targetId: 'rotate', oldName: 'rotate' },
    { targetId: 'longest-run', oldName: 'longest-run' },
    { targetId: 'merge-sorted-arrays', oldName: 'merge-sorted' },
    { targetId: 'missing-number', oldName: 'missing-number' },
    { targetId: 'two-sum-sorted', oldName: 'two-sum-sorted' },
    { targetId: 'find-cycle-length', oldName: 'find-cycle-length' },
    { targetId: 'intersect-sorted', oldName: 'intersect-sorted' },
    { targetId: 'max-sum-subarray-k', oldName: 'max-sum-subarray-k' },
    { targetId: 'shortest-subarray-sum', oldName: 'shortest-subarray-sum' },
    { targetId: 'build-prefix-sum', oldName: 'build-prefix-sum' },
    { targetId: 'range-sum-queries', oldName: 'range-sum-queries' },
    { targetId: 'binary-search', oldName: 'binary-search' },
    { targetId: 'first-occurrence', oldName: 'first-occurrence' } // Might not exist
];

function updateOrder(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            updateOrder(fullPath);
        } else if (file.endsWith('.exercise.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const idMatch = content.match(/id:\s*'([^']+)'/);
            if (idMatch) {
                const id = idMatch[1];
                const index = cseOrder.findIndex(item => item.targetId === id);
                if (index !== -1) {
                    const newOrder = 401 + index;
                    // Replace order
                    const replaced = content.replace(/(\border:\s*)\d+/, `$1${newOrder}`);
                    if (replaced !== content) {
                        fs.writeFileSync(fullPath, replaced, 'utf8');
                        console.log(`Updated ${id} to order ${newOrder}`);
                    }
                }
            }
        }
    }
}

updateOrder('src/content/problems');
