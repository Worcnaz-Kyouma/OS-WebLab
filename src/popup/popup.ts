import { Config } from "../types/config";
import { Data } from "../types/data";
import { fetchJson } from "../utils";

async function init() {
    const manifestJSON = chrome.runtime.getManifest();
    const configURL = chrome.runtime.getURL('src/config.json');
    const configJSON = await fetchJson(configURL) as Config; 

    populateNav(configJSON.folders);
    populateGeneralFields(manifestJSON);
}

function populateNav(foldersName: string[]): void {
    const foldersDataURL = foldersName.map(name => chrome.runtime.getURL(`${name}/data.json`));
    const foldersDataPromises = foldersDataURL.map(url => fetchJson(url)) as Promise<Data>[];
    
    Promise.all(foldersDataPromises).then(foldersData => {
        const navListElement = document.getElementById("section-tabs");
        
        foldersData.forEach(data => {
            const tabElement = document.createElement('li');

            tabElement.textContent = data.tabName;

            tabElement.addEventListener('click', () => populateSection(data));

            navListElement.appendChild(tabElement);
        })
    });
}

function populateGeneralFields(manifest:  chrome.runtime.Manifest) {
    const versionElement = document.getElementById("version");
    versionElement.textContent = `${manifest.version}v`;
}

function populateSection(data:Data): void {

}

window.onload = init;