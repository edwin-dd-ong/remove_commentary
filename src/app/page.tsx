/* eslint-disable */
"use client";
import { useState } from "react";


export default function Home() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [progressLogs, setProgressLogs] = useState<string[]>([]);
  
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] as File;
        if (file && file.type === "video/mp4") {
            setSelectedFile(file);
            console.log('Selected file:', file.name);
        } else {
            alert("Please select an MP4 file");
        }
    };

    const handleDownload = async () => {
        if (selectedFile) {
            // Add dynamic import for Mp4ToMp3
            const { default: Mp4ToMp3 } = await import('./_components/mp4_to_mp3');  
            const input_url = URL.createObjectURL(selectedFile);
            console.log(input_url)
            setProgressLogs([ "loaded file"])
            const output_url = await Mp4ToMp3(input_url, progressLogs, setProgressLogs);
            setProgressLogs([ "File returned!"])
            // create array, pass in by reference, update in Mp4ToMp3
            // Create a temporary anchor element
            const a = document.createElement('a');
            a.href = output_url;
            a.download = selectedFile.name;
            document.body.appendChild(a);
            a.click();
            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(input_url);
            URL.revokeObjectURL(output_url);
        }
    };
    

  return (
    <>
      <main className="flex text-xl flex-col items-center animate-fade">
        <div className="flex flex-col items-center justify-center w-full">
            <p className="border-b-4 border-double border-black w-full bg-zinc-50/50 mx-4 mb-8 pt-8 pb-8 px-4 text-2xl font-bold text-center">Upload an tournament mp4 file to remove commentary</p>

              <div
                className="flex flex-col items-center justify-center w-3/4 mx-auto"
                onDragOver={(e) => {
                    e.preventDefault(); // Prevent default behavior (open file)
                }}
                onDrop={(e) => {
                    e.preventDefault(); // Prevent default behavior (open file)
                    const file = e.dataTransfer.files[0]; // Get the dropped file
                    if (file && file.type === "video/mp4") {
                        setSelectedFile(file);
                        console.log('Selected file:', file.name);
                    } else {
                        alert("Please drop an MP4 file");
                    }
                }}
              >
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  hover:bg-gray-800 bg-gray-700 border-gray-600 hover:border-gray-500">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Ony accepts .mp4</p>
                      </div>
                      <input id="dropzone-file" type="file" accept="video/mp4"onChange={handleFileUpload}className="hidden" />
                  </label>
                    {selectedFile && (
                        <button
                            onClick={handleDownload}
                            className="font-bold mb-2 mt-4 px-4 py-2 bg-primary hover:bg-primary/70 text-blue-700 rounded-lg cursor-pointer transition-colors duration-300"
                        >
                            Click here to start processing {selectedFile.name}
                        </button>
                    )}
                    <div className="mt-2">{progressLogs}</div>
              </div> 
        </div>
        
      </main>
      
    </>
  );
}
