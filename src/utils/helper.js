import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// console.log(__dirname);
// console.log(__filename);

const dataPath = path.join(__dirname, "../data/task.json");
// console.log(dataPath);

export const readData = async () => {
  try {
    const data = await fs.readFile(dataPath, "utf-8");

    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const writeData = async (data) => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
