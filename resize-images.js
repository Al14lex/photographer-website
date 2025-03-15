const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

// Головна папка зображень
const inputFolder = "src/img";
// Куди зберігати оптимізовані фото
const outputFolder = "src/img-optimized";

// Розміри для різних пристроїв
const sizes = [
    { name: "small", width: 300 },
    { name: "medium", width: 600 },
    { name: "large", width: 1200 }
];

// Функція для рекурсивного отримання підпапок
const getSubfolders = (dir) => {
    return fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isDirectory());
};

// Обробка всіх підпапок
async function processImages() {
    const folders = getSubfolders(inputFolder);

    for (const folder of folders) {
        const inputPath = path.join(inputFolder, folder);
        const outputPath = path.join(outputFolder, folder);

        await fs.ensureDir(outputPath);

        const files = fs.readdirSync(inputPath).filter(file => file.endsWith(".webp"));

        for (const file of files) {
            for (const size of sizes) {
                const inputFile = path.join(inputPath, file);
                const outputFile = path.join(outputPath, file.replace(".webp", `-${size.name}.webp`));

                await sharp(inputFile)
                    .resize(size.width)
                    .toFormat("webp")
                    .toFile(outputFile);
                
                console.log(`✅ ${folder}/${file} → ${size.name} створено`);
            }
        }
    }
    console.log("🎉 Усі зображення успішно оптимізовані у всіх папках!");
}

// Запуск скрипта
processImages();
