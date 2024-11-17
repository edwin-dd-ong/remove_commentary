import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import processAudio from './call_demucs';

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
        const mp3File = new File([data], 'output.mp3', { type: 'audio/mp3' });
        console.log("converted file into mp3");
        
        // Get vocals from demucs
        const vocals_only = await processAudio(mp3File);
        
        // Write vocals to FFmpeg and invert them
        await ffmpeg.writeFile('vocals.wav', new Uint8Array(await vocals_only.arrayBuffer()));
        await ffmpeg.exec([
            '-i', 'vocals.wav',      // Input file
            '-af', 'volume=-1',      // Apply volume inversion (multiply by -1)
            'inverted_vocals.wav'    // Output file
        ]);
        // Mix the original audio with inverted vocals

        await ffmpeg.exec([
            '-i', 'output.mp3',
            '-i', 'inverted_vocals.wav',
            '-filter_complex', '[0:a][1:a]amix=inputs=2:weights=1 1:normalize=0',
            'final_output.mp3'
        ]);
        
        // Combine the processed audio with the original video
        await ffmpeg.exec([
            '-i', 'input.mp4',           // Original video input
            '-i', 'final_output.mp3',    // Processed audio input
            '-c:v', 'copy',              // Copy video stream without re-encoding
            '-map', '0:v:0',             // Map video from first input
            '-map', '1:a:0',             // Map audio from second input
            'output_video.mp4'           // Final output file
        ]);

        // Read the final video file
        const finalVideoData = await ffmpeg.readFile('output_video.mp4');
        const mp4Blob = new Blob([finalVideoData], { type: 'video/mp4' });
        const out_url = URL.createObjectURL(mp4Blob);
        console.log("out url " + out_url);
        return out_url;
    } catch (error) {
        console.error("Error converting mp4 to mp3:", error);
        throw error;
    }
}




