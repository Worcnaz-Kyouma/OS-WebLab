export function getManifest(filePath:string) : Promise<Object> {
    return (
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Parse the JSON data
            })
            .catch(error => {
                console.error('Error fetching the manifest:', error);
            })
    );
}