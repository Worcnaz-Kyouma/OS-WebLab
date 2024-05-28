const fs = require('fs');
const path = require('path');

function generateConfig() {
    const tabsFolders = "src/popup/";

    const tabsDirectory = path.resolve(__dirname, tabsFolders);

    const outputPath = path.resolve(__dirname, 'src/config.json');

    const folders = fs.readdirSync(tabsDirectory).filter(file => 
        fs.statSync(path.join(tabsDirectory, file)).isDirectory()
    );

    const config = {
        folders: folders.map(folder => `${tabsFolders}${folder}`)
    };

    fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
}

generateConfig();