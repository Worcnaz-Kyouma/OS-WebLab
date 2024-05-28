import { Config } from "../types/config";
import { Data } from "../types/data";
import { fetchJson, parseHTMLRequestToDOM } from "../utils";

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
        const selectSectionElement = document.getElementById("section-selector");
        
        foldersData.forEach((data, index) => {
            const optionElement = document.createElement('option');

            optionElement.value = index.toString();

            optionElement.textContent = data.tabName;

            optionElement.addEventListener('click', () => populateSection(data));

            selectSectionElement.appendChild(optionElement);
        })

        populateSection(foldersData[0]);
    });
}

function populateGeneralFields(manifest:  chrome.runtime.Manifest) {
    const versionElement = document.getElementById("version");
    versionElement.textContent = `${manifest.version}V`;

    const authorElement = document.getElementById("author");
    authorElement.textContent = `Author: ${manifest.author}`;
}

async function populateSection(data:Data): Promise<void> {
    const sectionElementURL = chrome.runtime.getURL(data.htmlPath);
    const sectionResponse = await fetch(sectionElementURL);
    if(!sectionResponse.ok){
        console.error(`HTTP error. Status: ${sectionResponse.status}.`);
        return;
    } 
    
    const sectionElement = await parseHTMLRequestToDOM(sectionResponse, 'section');

    const contentWrapperElement = document.getElementById('content-wrapper');
    const contentFooterTitleElement = document.getElementById('content-desc');

    contentWrapperElement.appendChild(sectionElement);
    contentFooterTitleElement.textContent = data.description;
}

window.onload = init;