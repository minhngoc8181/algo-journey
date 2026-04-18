const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            results.push(fullPath);
        }
    });
    return results;
}

const allFiles = walk('src/content/problems');
let changedCount = 0;

for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (file.endsWith('.exercise.ts')) {
        // Find starter code and add import if not there
        // The pattern is usually like: code: `class Solution
        // or code: `\nclass Solution
        
        // We ensure not to add it twice
        if (!content.includes('import java.util.*')) {
            const regex = /code:\s*([`'"])(\\n)*class Solution/g;
            if (regex.test(content)) {
                content = content.replace(regex, 'code: $1import java.util.*;\\n\\nclass Solution');
                changed = true;
            }
        }
    } else if (file.endsWith('.solution.java')) {
        // For java solutions, prepend import java.util.*; if class Solution is used
        if (!content.includes('import java.util.*')) {
            const regex = /\bclass (Solution|\w+)\b/;
            if (regex.test(content)) {
                // Prepend at the very beginning
                content = 'import java.util.*;\n\n' + content;
                changed = true;
            }
        }
    }

    if (changed) {
        fs.writeFileSync(file, content);
        changedCount++;
    }
}

console.log('Updated ' + changedCount + ' files.');
