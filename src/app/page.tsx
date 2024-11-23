/* eslint-disable */
"use client";
import { useState } from "react";
import { Upload, FileType, X } from 'lucide-react'


export default function Home() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [progressLogs, setProgressLogs] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false)
    const [abortController, setAbortController] = useState<AbortController | null>(null);
  
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
            const controller = new AbortController();
            setAbortController(controller);
            setIsProcessing(true);
            // Add dynamic import for Mp4ToMp3
            const { default: Mp4ToMp3 } = await import('./_components/mp4_to_mp3');  
            const input_url = URL.createObjectURL(selectedFile);
            console.log(input_url)
            setProgressLogs([ "loaded file"])
            const output_url = await Mp4ToMp3(input_url, progressLogs, setProgressLogs, { signal: controller.signal });
            setProgressLogs([ "File returned!"])
            // create array, pass in by reference, update in Mp4ToMp3
            // Create a temporary anchor element
            const a = document.createElement('a');
            console.log("doc element created")
            a.href = output_url;
            a.download = selectedFile.name;
            document.body.appendChild(a);
            a.click();
            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(input_url);
            URL.revokeObjectURL(output_url);
            setIsProcessing(false);
        }
    };
  return(
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Upload a tournament MP4 file to remove commentary
      </h1>
      <div
        className="bg-white p-8 rounded-lg shadow-md"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
            e.preventDefault(); // Prevent default behavior (open file)
            const file = e.dataTransfer.files[0] as File;
            if (file && file.type === "video/mp4") {
                setSelectedFile(file);
                console.log('Selected file:', file.name);
            } else {
                alert("Please select an MP4 file");
            }
        }}
      >
        {!selectedFile ? (
          <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <input
              type="file"
              accept="video/mp4"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-16 h-16 text-gray-400 mb-4" />
              <span className="text-gray-600 font-medium">
                Click to upload or drag and drop
              </span>
              <span className="text-sm text-gray-500 mt-2">MP4 files only</span>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center">
              <FileType className="w-8 h-8 text-blue-500 mr-3" />
              <span className="font-medium text-gray-700">{selectedFile.name}</span>
            </div>
            <button
              onClick={() => {
                if (abortController) {
                    abortController.abort();
                }
                setSelectedFile(null);
                setIsProcessing(false);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
      {selectedFile && (
        <div className="mt-6 text-center">
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className={`px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? 'Processing...' : 'Start Processing'}
          </button>
        </div>
      )}
    </div>
    <footer className="mt-12 text-center text-gray-600">
      <p className="font-medium">Made by Edwin O.</p>
      <div className="mt-2 space-x-4">
        <a href="https://www.edwin.ong" className="text-blue-500 hover:underline">Website</a>
        <a href="https://www.linkedin.com/in/edwin-dd-ong/" className="text-blue-500 hover:underline">LinkedIn</a>
        <a href="https://x.com/TheBestEdwinO" className="text-blue-500 hover:underline">Twitter</a>
        <a href="mailto:edwinong@alumni.stanford.edu" className="text-blue-500 hover:underline">Contact</a>
      </div>
    </footer>
  </div>
  );
}
    

//   return (
//     <>
//       <main className="flex text-xl flex-col items-center animate-fade">
//         <div className="flex flex-col items-center justify-center w-full">
//             <p className="border-b-4 border-double border-black w-full bg-zinc-50/50 mx-4 mb-8 pt-8 pb-8 px-4 text-2xl font-bold text-center">Upload an tournament mp4 file to remove commentary</p>

//               <div
//                 className="flex flex-col items-center justify-center w-3/4 mx-auto"
//                 onDragOver={(e) => {
//                     e.preventDefault(); // Prevent default behavior (open file)
//                 }}
//                 onDrop={(e) => {
//                     e.preventDefault(); // Prevent default behavior (open file)
//                     const file = e.dataTransfer.files[0]; // Get the dropped file
//                     if (file && file.type === "video/mp4") {
//                         setSelectedFile(file);
//                         console.log('Selected file:', file.name);
//                     } else {
//                         alert("Please drop an MP4 file");
//                     }
//                 }}
//               >
//                   <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  hover:bg-gray-800 bg-gray-700 border-gray-600 hover:border-gray-500">
//                       <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                           <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
//                               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
//                           </svg>
//                           <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
//                           <p className="text-xs text-gray-500 dark:text-gray-400">Ony accepts .mp4</p>
//                       </div>
//                       <input id="dropzone-file" type="file" accept="video/mp4"onChange={handleFileUpload}className="hidden" />
//                   </label>
//                     {selectedFile && (
//                         <button
//                             onClick={handleDownload}
//                             disabled={isProcessing}
//                             className="font-bold mb-2 mt-4 px-4 py-2 bg-primary hover:bg-primary/70 text-blue-700 rounded-lg cursor-pointer transition-colors duration-300"
//                         >
//                             Click here to start processing {selectedFile.name}

//                         </button>
//                     )}
//                     <div className="mt-2">{progressLogs}</div>
//               </div> 
//         </div>
        
//       </main>
      
//     </>
//   );
// }
