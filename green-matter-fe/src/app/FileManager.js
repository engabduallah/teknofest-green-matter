import React, { useState, useRef } from 'react';
import DwvComponent from './DwvComponent';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    if (event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files).map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }));

      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const handleDeleteFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    if (selectedFileIndex === index) {
      setSelectedFileIndex(null);
    } else if (selectedFileIndex > index) {
      setSelectedFileIndex(selectedFileIndex - 1);
    }
  };

  const handleSelectFile = (index) => {
    setSelectedFileIndex(index);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold flex-grow">File Manager</h2>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
          onClick={() => fileInputRef.current.click()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Files
        </button>
      </div>

      <div className="flex h-[calc(100%-4rem)]">
        <div className="w-72 overflow-auto border-r border-gray-200 bg-gray-50">
          {files.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {files.map((file, index) => (
                <li
                  key={index}
                  className={`hover:bg-gray-100 cursor-pointer ${selectedFileIndex === index ? 'bg-blue-50' : ''}`}
                >
                  <div
                    className="px-4 py-3 flex justify-between items-center"
                    onClick={() => handleSelectFile(index)}
                  >
                    <div>
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">{`${formatFileSize(file.size)} • ${file.type || 'Unknown type'}`}</p>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(index);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">
                No files uploaded. Click "Add Files" to upload.
              </p>
            </div>
          )}
        </div>

        <div className="flex-grow overflow-auto p-4 h-[600px]">
          {selectedFileIndex !== null ? (
            <DwvComponent
              key={'dwvcomp' + selectedFileIndex}
              fileToLoad={files[selectedFileIndex].file}
              hideDropbox={true}
            />
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">
                Select a file from the list to view
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManager;