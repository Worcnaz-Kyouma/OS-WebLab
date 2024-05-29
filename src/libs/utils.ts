export async function fetchJson(url: string): Promise<Object> {
    const response = await fetch(url);
    if(!response.ok) {
        console.error(`HTTP error. Status: ${response.status}.`);
    } else {
        return response.json();
    }
}

export async function streamToString(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<string> {
    const decoder = new TextDecoder();
        let result = '';
        let done = false;

        while (!done) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;
            if (value) {
                result += decoder.decode(value, { stream: !done });
            }
        }

        return result;
}

export async function parseHTMLRequestToDOM(response: Response, htmlTag: keyof HTMLElementTagNameMap) {
    const reader = response.body?.getReader();
    if (!reader) {
        console.error('Failed to get reader from section tab request.');
        return;
    }

    const text = await streamToString(reader);

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.querySelector(htmlTag);
}