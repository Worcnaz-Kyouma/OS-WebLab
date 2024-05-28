import { Config } from "./types/config";

export async function fetchJson(url: string): Promise<Object> {
    const response = await fetch(url);
    if(!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`);
    } else {
        return response.json();
    }
}