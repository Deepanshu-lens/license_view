export const ssr = false;

// src/routes/playback/[slug]/+page.server.ts
// import { promises as fs } from "fs";
// import path from "path";
// import { exec } from "child_process";
// import { promisify } from "util";

// const execAsync = promisify(exec);

// export const load = async () => {
//   const playbackDir = path.resolve("static", "Playback");
//   const files = await fs.readdir(playbackDir);
//   //   const tsFiles = files.filter((file) => file.endsWith(".ts"));
//   const tsFiles = files.filter(
//     (file) => (file.match(/_/g) || []).length === 9 && file.endsWith(".ts"),
//   );

//   //   console.log(tsFiles);

//   for (const file of tsFiles) {
//     const filePath = path.join(playbackDir, file);
//     const outputFilePath = filePath.replace(".ts", ".mp4");

//     // Convert .ts to .mp4 using ffmpeg
//     await execAsync(`ffmpeg -i "${filePath}" -c copy "${outputFilePath}"`);
//   }

//   // Assuming conversion is quick and you want to list the converted files
//   const convertedFiles = await fs.readdir(playbackDir);
//   console.log(convertedFiles);
//   const mp4Files = convertedFiles.filter((file) => file.endsWith(".mp4"));

//   console.log(mp4Files);

//   //   Send the list of .mp4 files to the Svelte page
//   return {
//     mp4Files,
//   };
// };

// export const load = async () => {
//   try {
//     const playbackDir = path.resolve("static", "Playback");
//     const files = await fs.readdir(playbackDir);

//     // Get all .mp4 files in the directory
//     const mp4Files = files.filter((file) => file.endsWith(".webm"));
//     // Create a set of names without extension for quick lookup
//     const mp4FileNamesWithoutExtension = new Set(
//       mp4Files.map((file) => file.replace(".webm", "")),
//     );

//     // Filter .ts files based on the new condition and the existing one
//     const tsFilesToConvert = files.filter((file) => {
//       const fileNameWithoutExtension = file.replace(".ts", "");
//       return (
//         (file.match(/_/g) || []).length === 9 &&
//         file.endsWith(".ts") &&
//         !mp4FileNamesWithoutExtension.has(fileNameWithoutExtension)
//       ); // Check if .mp4 version exists
//     });

//     console.log(tsFilesToConvert);

//     for (const file of tsFilesToConvert) {
//       const filePath = path.join(playbackDir, file);
//       const outputFilePath = filePath.replace(".ts", ".webm"); // Change the extension to .webm

//       // Convert .ts to .webm using ffmpeg with VP9 and Opus codecs
//       await execAsync(
//         `ffmpeg -i "${filePath}" -c:v libvpx-vp9 -c:a libopus "${outputFilePath}"`,
//       );
//     }

//     // Assuming conversion is quick and you want to list the converted files
//     const convertedFiles = await fs.readdir(playbackDir);
//     const updatedWebmFiles = convertedFiles.filter((file) =>
//       file.endsWith(".webm"),
//     );

//     // Send the list of .webm files to the Svelte page
//     return {
//       webmFiles: updatedWebmFiles,
//     };
//   } catch (error) {
//     console.error("Error during file conversion or listing:", error);
//     // Handle the error appropriately
//     return {
//       mp4Files: [],
//       error: "Failed to convert files or retrieve the list of converted files.",
//     };
//   }
// };

import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Function to check if a file has valid streams using ffprobe
async function hasValidStreams(filePath: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries stream=codec_type -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
    );
    // If stdout is not empty, there are streams present
    return stdout.trim().length > 0;
  } catch (error) {
    console.log(`Error probing file: ${filePath}`, error);
    return false; // Assume not convertible if an error occurs
  }
}

export const load = async () => {
  try {
    const playbackDir = path.resolve("static", "Playback");
    const files = await fs.readdir(playbackDir);

    // Create a set of existing .webm filenames without the extension for quick lookup
    const webmFileNamesWithoutExtension = new Set(
      files
        .filter((file) => file.endsWith(".webm"))
        .map((file) => file.replace(".webm", "")),
    );

    // Filter .ts files that have 9 underscores and do not have a corresponding .webm file
    const tsFilesToProbe = files.filter((file) => {
      const baseName = file.replace(".ts", "");
      return (
        (file.match(/_/g) || []).length === 9 &&
        file.endsWith(".ts") &&
        !webmFileNamesWithoutExtension.has(baseName)
      );
    });

    // Filter and convert files asynchronously
    const conversionPromises = tsFilesToProbe.map(async (file) => {
      const filePath = path.join(playbackDir, file);
      if (await hasValidStreams(filePath)) {
        const outputFilePath = filePath.replace(".ts", ".webm");
        await execAsync(
          `ffmpeg -i "${filePath}" -c:v libvpx-vp9 -c:a libopus "${outputFilePath}"`,
        );
        return outputFilePath; // Return the path of the successfully converted file
      }
      return null; // Return null for files that are not convertible
    });

    // Wait for all conversions to complete
    const convertedFiles = (await Promise.all(conversionPromises)).filter(
      (filePath) => filePath !== null,
    );
    console.log(convertedFiles);

    // Assuming you want to list the converted files
    const updatedWebmFiles = convertedFiles.filter((file) =>
      file.endsWith(".webm"),
    );
    console.log(updatedWebmFiles);

    const webmFiles = files.filter((file) => file.endsWith(".webm"));
    return {
      webmFiles,
    };
  } catch (error) {
    console.error("Error during file conversion or listing:", error);
    return {
      webmFiles: [],
      error: "Failed to convert files or retrieve the list of converted files.",
    };
  }
};
