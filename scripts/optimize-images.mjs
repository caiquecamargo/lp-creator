#!/usr/bin/env zx

import { glob, fs, path, chalk } from "zx";
import sharp from "sharp";

const IMAGES_DIR = "src/assets/images";
const CONTENT_DIR = "src/content";
const WEBP_QUALITY = 85;

async function getAllImages() {
  const images = await glob(`${IMAGES_DIR}/*`, { onlyFiles: true });
  return images.map((img) => ({
    path: img,
    name: path.basename(img),
    ext: path.extname(img).toLowerCase(),
  }));
}

async function getAllContentFiles() {
  const mdFiles = await glob(`${CONTENT_DIR}/**/*.md`);
  const jsonFiles = await glob(`${CONTENT_DIR}/**/*.json`);
  return [...mdFiles, ...jsonFiles];
}

async function isImageUsed(imageName, contentFiles) {
  for (const file of contentFiles) {
    const content = await fs.readFile(file, "utf-8");
    if (content.includes(imageName)) {
      return { used: true, files: [file] };
    }
  }
  return { used: false, files: [] };
}

async function findAllReferences(imageName, contentFiles) {
  const references = [];
  for (const file of contentFiles) {
    const content = await fs.readFile(file, "utf-8");
    if (content.includes(imageName)) {
      references.push(file);
    }
  }
  return references;
}

async function convertToWebp(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const baseName = path.basename(imagePath, ext);
  const newPath = path.join(path.dirname(imagePath), `${baseName}.webp`);

  try {
    await sharp(imagePath).webp({ quality: WEBP_QUALITY }).toFile(newPath);
    return { success: true, newPath, newName: `${baseName}.webp` };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function updateReferences(image, newName, files) {
  for (const file of files) {
    const oldPath = image.path.replace("src/", "");
    const newPath = oldPath.replace(image.name, newName);

    let content = await fs.readFile(file, "utf-8");
    const updatedContent = content.replaceAll(oldPath, newPath);
    await fs.writeFile(file, updatedContent, "utf-8");
  }
}

async function deleteImage(imagePath) {
  try {
    await fs.unlink(imagePath);
    return true;
  } catch (error) {
    console.error(chalk.red(`Erro ao deletar ${imagePath}: ${error.message}`));
    return false;
  }
}

async function main() {
  console.log(chalk.blue("🔍 Iniciando análise de imagens...\n"));

  const images = await getAllImages();
  const contentFiles = await getAllContentFiles();

  console.log(chalk.gray(`📁 Encontradas ${images.length} imagens em ${IMAGES_DIR}`));
  console.log(chalk.gray(`📄 Encontrados ${contentFiles.length} arquivos de conteúdo em ${CONTENT_DIR}\n`));

  const stats = {
    deleted: 0,
    converted: 0,
    skipped: 0,
    errors: 0,
  };

  for (const image of images) {
    const { used, files } = await isImageUsed(image.name, contentFiles);

    if (!used) {
      // Imagem não utilizada - deletar
      console.log(chalk.yellow(`🗑️  Deletando imagem não utilizada: ${image.name}`));
      const deleted = await deleteImage(image.path);
      if (deleted) {
        stats.deleted++;
      } else {
        stats.errors++;
      }
      continue;
    }

    // Imagem utilizada
    if (image.ext === ".webp") {
      // Já é webp - pular
      console.log(chalk.green(`✅ Já é WebP: ${image.name}`));
      stats.skipped++;
      continue;
    }

    // Não é webp - converter
    console.log(chalk.blue(`🔄 Convertendo para WebP: ${image.name}`));

    const references = await findAllReferences(image.name, contentFiles);
    const result = await convertToWebp(image.path);

    if (result.success) {
      // Atualizar referências
      await updateReferences(image, result.newName, references);
      console.log(chalk.gray(`   📝 Atualizadas ${references.length} referências`));

      // Deletar imagem original
      await deleteImage(image.path);
      console.log(chalk.green(`   ✅ Convertido: ${image.name} → ${result.newName}`));
      stats.converted++;
    } else {
      console.error(chalk.red(`   ❌ Erro ao converter ${image.name}: ${result.error}`));
      stats.errors++;
    }
  }

  console.log(chalk.blue("\n📊 Resumo:"));
  console.log(chalk.yellow(`   🗑️  Imagens deletadas (não utilizadas): ${stats.deleted}`));
  console.log(chalk.blue(`   🔄 Imagens convertidas para WebP: ${stats.converted}`));
  console.log(chalk.green(`   ✅ Imagens já em WebP (ignoradas): ${stats.skipped}`));

  if (stats.errors > 0) {
    console.log(chalk.red(`   ❌ Erros: ${stats.errors}`));
  }

  console.log(chalk.green("\n✨ Otimização concluída!"));
}

main().catch((error) => {
  console.error(chalk.red(`Erro fatal: ${error.message}`));
  process.exit(1);
});
