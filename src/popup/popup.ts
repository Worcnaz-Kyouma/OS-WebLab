import { Config } from "../types/config";
import { Data } from "../types/data";
import { fetchJson, parseHTMLRequestToDOM } from "../libs/utils";

async function init() {
    const manifestJSON = chrome.runtime.getManifest();
    const configURL = chrome.runtime.getURL('src/config.json');
    const configJSON = await fetchJson(configURL) as Config; 

    populateNav(configJSON.folders);
    populateGeneralFields(manifestJSON);

    const selectSectionElement = document.getElementById("section-selector") as HTMLInputElement;
    selectSectionElement.addEventListener('change', (event) => {
        const target = event.target as HTMLSelectElement;
        populateSection(target.value);
    });
}

function populateNav(foldersName: string[]): void {
    const foldersDataURL = foldersName.map(name => chrome.runtime.getURL(`${name}/data.json`));
    const foldersDataPromises = foldersDataURL.map(url => fetchJson(url)) as Promise<Data>[];
    
    const selectSectionElement = document.getElementById("section-selector") as HTMLInputElement;
    Promise.all(foldersDataPromises).then(foldersData => {
        
        foldersData.forEach(data => {
            const optionElement = document.createElement('option');

            optionElement.value = data.folderPath;

            optionElement.textContent = data.tabName;

            selectSectionElement.appendChild(optionElement);
        })

        populateSection(foldersData[0].folderPath);
        selectSectionElement.value = foldersData[0].folderPath;
    });
}

function populateGeneralFields(manifest:  chrome.runtime.Manifest) {
    const versionElement = document.getElementById("version");
    versionElement.textContent = `${manifest.version}V`;

    const authorElement = document.getElementById("author");
    authorElement.textContent = `Author: ${manifest.author}`;
}

async function populateSection(folderPath: string): Promise<void> {
    const tabDataUrl = chrome.runtime.getURL(`${folderPath}/data.json`);
    const tabDataJSON = await fetchJson(tabDataUrl) as Data;
    
    const sectionElementURL = chrome.runtime.getURL(`${folderPath}/index.html`);
    const sectionResponse = await fetch(sectionElementURL);
    if(!sectionResponse.ok){
        console.error(`HTTP error. Status: ${sectionResponse.status}.`);
        return;
    } 

    const sectionElement = await parseHTMLRequestToDOM(sectionResponse, 'section');

    const contentWrapperElement = document.getElementById('content-wrapper');
    const contentFooterTitleElement = document.getElementById('content-desc');

    contentWrapperElement.innerHTML = '';
    contentWrapperElement.appendChild(sectionElement);

    var contentScript = document.createElement('script');
    contentScript.src = `./${folderPath.split('/')[2]}/numSysConverter.js`;
    contentScript.type = 'module';
    contentWrapperElement.appendChild(contentScript);

    contentFooterTitleElement.textContent = tabDataJSON.description;
}

window.onload = init;