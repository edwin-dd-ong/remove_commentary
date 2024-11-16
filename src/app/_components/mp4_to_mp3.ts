import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Move FFmpeg instance outside and add loaded state
const ffmpeg = new FFmpeg();
let isLoaded = false;

const load = async () => {
    console.log("load initiated")
    if (isLoaded) return;
    try {
        console.log("trying")
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        // toBlobURL is used to bypass CORS issue, urls with the same
        // domain can be used directly.
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        isLoaded = true;
        console.log("FFmpeg loaded successfully");
    } catch (error) {
        console.error("Error loading FFmpeg:", error);
        throw error;
    }
}

export default async function Mp4ToMp3(input_url: string) {
    try {
        console.log("mp4tomp3 called");
        await load();
        console.log("load completed");
        await ffmpeg.writeFile('input.mp4', await fetchFile(input_url));
        await ffmpeg.exec(['-i', 'input.mp4', 'output.mp3']);
        const data = await ffmpeg.readFile('output.mp3');
        const mp3Blob = new Blob([data], { type: 'audio/mp3' });
        const out_url = URL.createObjectURL(mp3Blob);
        console.log("out url " + out_url)
        return out_url
    } catch (error) {
        console.error("Error converting mp4 to mp3:", error);
        throw error;
    }
}




