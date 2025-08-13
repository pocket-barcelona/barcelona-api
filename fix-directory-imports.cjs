#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findTsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(findTsFiles(filePath));
    } else if (file.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  
  return results;
}

function fixDirectoryImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix directory imports for handlers and functions
  // Matches: from './handlers' or from "./handlers" or from './functions' or from "./functions"
  const directoryImportRegex = /(from ['"]\.\/)([^'"]*\/(?:handlers|functions)|handlers|functions)(['"]);?/g;
  
  const newContent = content.replace(directoryImportRegex, (match, prefix, dirPath, suffix) => {
    // Check if this directory has an index.ts file
    const fullPath = path.resolve(path.dirname(filePath), dirPath);
    const indexTsPath = path.join(fullPath, 'index.ts');
    
    if (fs.existsSync(indexTsPath)) {
      modified = true;
      console.log(`Fixed directory import in ${filePath}: ${dirPath} -> ${dirPath}/index.js`);
      return `${prefix}${dirPath}/index.js${suffix};`;
    }
    
    return match;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✓ Updated ${filePath}`);
  }
  
  return modified;
}

// Main execution
const srcDir = './src';
console.log('Finding TypeScript files...');
const tsFiles = findTsFiles(srcDir);

console.log(`Found ${tsFiles.length} TypeScript files.`);
console.log('Fixing directory imports...\n');

let totalFixed = 0;
tsFiles.forEach((file) => {
  if (fixDirectoryImportsInFile(file)) {
    totalFixed++;
  }
});

console.log(`\n✅ Fixed directory imports in ${totalFixed} files.`);
