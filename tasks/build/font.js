/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const fs = require('fs');
const glob = require('glob');
const log = require('../utils/logger');

const srcFolder = 'src';

function buildSCSS(module, fontSets, fontPrefix) {
  let generatedText = '// Attention: this file was generated by tasks/build/font.js\n\n';

  fontSets.forEach((fontSet) => {
    const { selection } = fontSet;

    selection.forEach((icon) => {
      generatedText += `$${fontPrefix}${icon.name}: \\${icon.code.toString(16)};\n\n`;
      generatedText += `.${fontPrefix}${icon.name} {\n`;
      generatedText += `  @include sg-icon-before($${fontPrefix}${icon.name});\n`;
      generatedText += '}\n';
      generatedText += '\n';
    });
  });

  const targetPath = module.replace('.font.json', '_generated.scss');
  fs.writeFileSync(targetPath, generatedText);
}

function buildPUG(module, fontSets, fontPrefix) {
  let generatedText = '//- Attention: this file was generated by tasks/build/font.js\n\n';
  generatedText += 'mixin sg-icons()\n';
  generatedText += '  .sg-icons\n';

  fontSets.forEach((fontSet) => {
    const { selection } = fontSet;

    selection.forEach((icon) => {
      generatedText += '    .sg-icons_tile\n';
      generatedText += `      .${fontPrefix}${icon.name}\n`;
      generatedText += `      span .${fontPrefix}${icon.name}\n`;
      generatedText += `      span $${fontPrefix}${icon.name}\n`;
      generatedText += '\n';
    });
  });

  const targetPath = module.replace('.font.json', '_generated.pug');
  fs.writeFileSync(targetPath, generatedText);
}

function build(module) {
  try {
    const json = JSON.parse(fs.readFileSync(module, 'utf8'));
    const fontSets = json.iconSets;
    const fontPrefix = json.preferences.fontPref.prefix;

    buildSCSS(module, fontSets, fontPrefix);
    buildPUG(module, fontSets, fontPrefix);
  } catch (error) {
    log.error('font', error);
  }
}

function rebuild(event, module) {
  if (event === 'remove') {
    log.fileChange('font', 'remove', module);

    const pugFile = module.replace('.font.json', '_generated.pug');
    if (fs.existsSync(pugFile)) {
      log.fileChange('font', 'remove', pugFile);
      fs.unlinkSync(pugFile);
    }
    const scssFile = module.replace('.font.json', '_generated.scss');
    if (fs.existsSync(scssFile)) {
      log.fileChange('font', 'remove', scssFile);
      fs.unlinkSync(scssFile);
    }
  } else {
    log.fileChange('font', 'build', module);
    build(module);
  }
}

async function run() {
  await new Promise((fontResolve) => {
    glob(`${srcFolder}/**/*.font.json`, async (error, files) => {
      if (error) {
        log.error('font', error);
      } else {
        const modules = files;
        await Promise.all(modules.map(module => build(module)));

        fontResolve();
      }
    });
  });
}

if (require.main === module) run();

exports.rebuild = rebuild;
exports.run = run;
