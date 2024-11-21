// Add this interface declaration at the top of the file
interface WakeLockSentinel {
  release: () => Promise<void>;
}

let wakeLock: WakeLockSentinel | null = null;

async function keepAwake(): Promise<void> {
    try {
      // Check if wakeLock is supported
      if ('wakeLock' in navigator) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake lock is active');
      } else {
        console.error('Wake Lock API is not supported in this browser.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`${err.name}: ${err.message}`);
      } else {
        console.error('An unknown error occurred');
      }
    }
  }

// Release wake lock when done
async function releaseWakeLock() {
  if (wakeLock) {
    try {
      await wakeLock.release();
      wakeLock = null;
      console.log('Wake lock released');
    } catch (err) {
      console.error('Failed to release wake lock:', err);
    }
  }
}


export default async function processAudio(mp3File: File, progressLogs: string[], setProgressLogs: React.Dispatch<React.SetStateAction<string[]>>): Promise<Blob> {
    console.log("processAudio called");
    const formData = new FormData();
    formData.append('file', mp3File); // Use the File object directly

    try {
        setProgressLogs([ " sending audio to the cloud, this may take a loooooong time..."]);
        try {
            // Attempt to keep the device awake
            await keepAwake();
        } catch (error) {
            console.error('Error keeping awake:', error);
            // Continue execution even if keepAwake fails
        }
        const response = await fetch('https://test-964820033541.us-central1.run.app', {
            method: 'POST',
            body: formData,
        });
        console.log("response fetched")
        setProgressLogs([ " vocals_only received"]);
        try {
            // Attempt to keep the device awake
            await releaseWakeLock();
        } catch (error) {
            console.error('Error releasing wakelock:', error);
            // Continue execution even if keepAwake fails
        }
        if (!response.ok) {
            throw new Error(`Failed to process the file, status: ${response.status}`);
        }
        return await response.blob();
    } catch (error) {
        console.error('Error processing audio:', error);
        throw error;
    }

}

