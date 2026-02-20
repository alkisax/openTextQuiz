import path from "path";
import fs from "fs";
import { transcribeAudioService } from "./transcribe.service";

const run = async () => {
  try {
    const mp3Dir = path.join(process.cwd(), "mp3");

    const files = fs
      .readdirSync(mp3Dir)
      .filter((file) => file.endsWith(".mp3"));

    console.log(`Found ${files.length} mp3 files\n`);

    for (const fileName of files) {
      const filePath = path.join(mp3Dir, fileName);
      const outputPath = path.join(
        mp3Dir,
        fileName.replace(".mp3", ".txt")
      );

      // ✅ skip before calling OpenAI
      if (fs.existsSync(outputPath)) {
        console.log(`Skipping ${fileName} (already exists)`);
        continue;
      }

      console.log(`Transcribing ${fileName}...`);

      const transcript = await transcribeAudioService(filePath);

      fs.writeFileSync(outputPath, transcript, "utf-8");

      console.log(`✔ Saved ${outputPath}\n`);
    }

    console.log("DONE.");
  } catch (err) {
    console.error(`Error during transcription`, err);
  }
};

run();