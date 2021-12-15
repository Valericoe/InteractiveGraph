// Read in files
const fs = require('fs');

let combined = '';
try {
    const trajectory = fs.readFileSync('./trajectory.js', 'utf8');
    const styles = fs.readFileSync('./styles.css', 'utf8');
    const interactableGraphScript = fs.readFileSync('./interactableGraphScript.js', 'utf8');
    let makeElements = fs.readFileSync('./makeElements.js', 'utf8');
    makeElements = makeElements.replace('<!-- AIO CSS -->', styles);
    combined += makeElements + '\n';
    combined += trajectory + '\n';
    combined += interactableGraphScript + '\n';
    fs.writeFileSync('./interactableGraphAIO.js', combined);
} catch (err) {
    console.error(err);
}
