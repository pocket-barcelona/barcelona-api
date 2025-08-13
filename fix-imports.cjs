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

function fixImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Regex to match relative imports that don't already have .js extension
  // Matches: import ... from "./path" or import ... from "../path"
  // But not: import ... from "./path.js"
  const importRegex = /(import\s+[^"']*from\s+["'])(\.\.?\/[^"']*?)(['"])/g;
  
  const newContent = content.replace(importRegex, (match, prefix, importPath, suffix) => {
    // Don't modify imports that already have .js extension
    if (importPath.endsWith('.js')) {
      return match;
    }
    
    // Check if this is a directory import (like './handlers' or './functions')
    // We need to determine if the import path refers to a directory with index.ts
    const fullPath = path.resolve(path.dirname(filePath), importPath);
    const indexTsPath = path.join(fullPath, 'index.ts');
    
    // If there's an index.ts file in the directory, don't add .js
    if (fs.existsSync(indexTsPath)) {
      return match;
    }
    
    // Check if it's pointing to a .ts file
    const tsFilePath = fullPath + '.ts';
    if (!fs.existsSync(tsFilePath)) {
      // File doesn't exist, might be a directory or external module
      return match;
    }
    
    // Add .js extension for actual TypeScript files
    const newMatch = prefix + importPath + '.js' + suffix;
    modified = true;
    console.log(`Fixed import in ${filePath}: ${importPath} -> ${importPath}.js`);
    return newMatch;
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
console.log('Fixing imports...\n');

let totalFixed = 0;
tsFiles.forEach((file) => {
  if (fixImportsInFile(file)) {
    totalFixed++;
  }
});

console.log(`\n✅ Fixed imports in ${totalFixed} files.`);
