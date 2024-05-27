import { getManifest } from "./../utils";

async function init() {
    const manifestJSON = await getManifest('./../../manifest.json');
    console.log(manifestJSON);
}

window.onload = init;