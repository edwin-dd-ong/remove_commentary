export default async function processAudio(mp3File: File): Promise<Blob> {
    console.log("processAudio called");
    const formData = new FormData();
    formData.append('file', mp3File); // Use the File object directly

    try {
        const response = await fetch('http://127.0.0.1:8000/process', {
            method: 'POST',
            body: formData,
        });
        console.log("response fetched")
        if (!response.ok) {
            throw new Error(`Failed to process the file, status: ${response.status}`);
        }
        return await response.blob();
    } catch (error) {
        console.error('Error processing audio:', error);
        throw error;
    }
}

