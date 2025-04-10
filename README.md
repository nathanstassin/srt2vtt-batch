# srt2vtt-batch

A simple Electron app to batch convert **SRT** subtitle files to **VTT** format.

---

## Installation

To build the distribution, follow these steps:

1. Install dependencies:

   ```bash
   npm install
2. Build distribution
    ```bash
    npm run dist -- --arm64

## How to Use the App

### 1. Open the App
Launch the Electron app after the build process completes.

### 2. Select Your Course Folder
The folder you choose should contain the following two subfolders:
- **SRT**: The folder where your SRT files are stored (the ones to be converted).
- **VTT**: The folder where the converted VTT files will be saved.

**Example folder structure:**
CourseFolder/  
  ├── SRT/  
  │   ├── file1.srt  
  │   ├── file2.srt  
  │   └── ...  
  └── VTT/  
      ├── file1.vtt  
      ├── file2.vtt  
      └── ...  