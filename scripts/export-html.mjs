import { readFile, writeFile, readdir } from 'node:fs/promises';
const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');
const images = {};
for (const name of await readdir(new URL('../public/images/', import.meta.url))) {
  images['/images/' + name] = 'data:image/svg+xml;base64,' + Buffer.from(await read('public/images/' + name)).toString('base64');
}
let main = (await read('src/main.js')).replace(/^import .*;\n/gm, '');
main = main.replace(/^const photo=(.*);$/m, (_, expression) => `const imagePath=${expression};\nconst images=${JSON.stringify(images)};\nconst photo=id=>images[imagePath(id)];`);
const js = [await read('src/nutrition.js'), await read('src/data.js'), await read('src/motion.js'), main].join('\n').replace(/^export /gm, '').replace(/<\/script/gi, '<\\/script');
const font = (await readFile(new URL('../public/fonts/Anton-Regular.ttf', import.meta.url))).toString('base64');
const css = (await read('src/style.css')).replace('/fonts/Anton-Regular.ttf', 'data:font/ttf;base64,'+font).replace(/<\/style/gi, '<\\/style');
const fontLicense = (await read('public/fonts/OFL-Anton.txt')).replaceAll('--', '—');
const html = (await read('index.html')).replace('<head>', '<head><!-- Anton font / SIL Open Font License\n'+fontLicense+'\n-->').replace('</head>', `<style>${css}</style></head>`).replace('<script type="module" src="/src/main.js"></script>', `<script>${js}</script>`);
await writeFile(new URL('../Sainttraining.html', import.meta.url), html);
console.log('Created Sainttraining.html — self-contained, no server required.');
