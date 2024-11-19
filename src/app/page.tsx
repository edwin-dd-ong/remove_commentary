/* eslint-disable */
"use client";
import { useState } from "react";
import Mp4ToMp3 from "./_components/mp4_to_mp3";


export default function Home() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
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
            // Create a URL for the file
            const input_url = URL.createObjectURL(selectedFile);
            console.log(input_url)
            const output_url = await Mp4ToMp3(input_url);
            // create array, pass in by reference, update in Mp4ToMp3
            // Create a temporary anchor element
            const a = document.createElement('a');
            a.href = output_url;
            a.download = selectedFile.name.replace('.mp4', '.mp4');
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
        <div className="mt-8 w-full">
            <p className="flex items-center justify-center">Upload an tournament mp4 file to remove commentary</p>

              <div className="flex items-center justify-center w-3/4 mx-auto">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Ony accepts mp4</p>
                      </div>
                      <input id="dropzone-file" type="file" accept="video/mp4"onChange={handleFileUpload}className="hidden" />
                  </label>
              </div> 

            {selectedFile && (
                <button
                    onClick={handleDownload}
                    className="mb-2 mt-4 px-4 py-2 bg-primary hover:bg-primary/70 text-black rounded-lg cursor-pointer transition-colors duration-300"
                >
                    Download {selectedFile.name}
                </button>
            )}
        </div>
      </main>
      
    </>
  );
}
