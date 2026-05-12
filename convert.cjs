const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function convertFiles() {
  const srcDir = path.join(__dirname, 'src');
  
  const files = [];
  walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      if (!filePath.endsWith('.d.ts')) {
        files.push(filePath);
      } else {
        console.log(`Deleting ${filePath}`);
        fs.unlinkSync(filePath);
      }
    }
  });

  files.forEach(filePath => {
    console.log(`Converting ${filePath}...`);
    const code = fs.readFileSync(filePath, 'utf-8');
    
    const isTSX = filePath.endsWith('.tsx');
    
    try {
      const result = babel.transformSync(code, {
        plugins: [
          ["@babel/plugin-transform-typescript", { isTSX: isTSX, allExtensions: true }]
        ],
        filename: filePath,
        retainLines: true,
      });

      const newExt = isTSX ? '.jsx' : '.js';
      const newFilePath = filePath.substring(0, filePath.lastIndexOf('.')) + newExt;
      
      fs.writeFileSync(newFilePath, result.code, 'utf-8');
      fs.unlinkSync(filePath);
      console.log(`Successfully converted to ${newFilePath}`);
    } catch (e) {
      console.error(`Failed to convert ${filePath}`, e);
    }
  });
}

convertFiles();
