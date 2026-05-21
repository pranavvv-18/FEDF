const fs = require('fs');
const file = 'src/App.jsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Find the start and end of SECTION 6
let startIdx = lines.findIndex(l => l.includes('SECTION 6: Share + Export'));
let endIdx = -1;

if (startIdx !== -1) {
    // Find the end by looking for </main> after the start
    for (let i = startIdx; i < lines.length; i++) {
        if (lines[i].includes('</main>')) {
            // We want to delete up to the line right before </main>
            // Let's just step back to skip the empty line and the </div> of the wrap sec
            endIdx = i - 1;
            while(lines[endIdx].trim() === '') endIdx--;
            break;
        }
    }
    
    if (endIdx !== -1) {
        lines.splice(startIdx, endIdx - startIdx + 1);
        fs.writeFileSync(file, lines.join('\n'));
        console.log('Successfully deleted Section 6');
    } else {
        console.log('Could not find end index');
    }
} else {
    console.log('Could not find start index');
}
