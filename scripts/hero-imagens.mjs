/* Gera as variantes WebP da hero a partir de public/hero/originais/{1,2,3}.jpg.
   Uso: node scripts/hero-imagens.mjs

   Para trocar as fotos: substitua os arquivos em public/hero/originais/ e
   rode de novo. Nada mais precisa mudar — os caminhos em lib/dados.ts já
   apontam para a saída deste script. */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const RAIZ = path.join(process.cwd(), 'public', 'hero');
const ORIGEM = path.join(RAIZ, 'originais');
const LARGURAS = [2048, 1920, 1280, 768];
const QUALIDADE = 82;

if (!fs.existsSync(ORIGEM)) {
  console.error(`Não achei ${ORIGEM}. Coloque 1.jpg, 2.jpg e 3.jpg lá.`);
  process.exit(1);
}

const linhas = [];

for (const n of [1, 2, 3]) {
  const entrada = path.join(ORIGEM, `${n}.jpg`);
  if (!fs.existsSync(entrada)) {
    console.error(`Faltando: ${entrada}`);
    process.exit(1);
  }
  const meta = await sharp(entrada).metadata();

  for (const w of LARGURAS) {
    const saida = path.join(RAIZ, `${n}-${w}.webp`);
    await sharp(entrada)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALIDADE })
      .toFile(saida);
    const kb = (fs.statSync(saida).size / 1024).toFixed(0);
    linhas.push(`  ${n}-${w}.webp`.padEnd(22) + `${kb.padStart(6)} KB`);
  }
  linhas.push(`  origem ${n}.jpg: ${meta.width}x${meta.height}`);
}

console.log(`WebP q${QUALIDADE} em public/hero/`);
console.log(linhas.join('\n'));
