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
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  
  return results;
}

function checkImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];
  const lines = content.split('\n');
  
  // Check for relative imports without .js extension
  const relativeImportRegex = /(from ['"])(\.\.?\/[^'"]*?)(?<!\.js|\.json|\.ts|\.tsx)(['"])/g;
  
  lines.forEach((line, lineIndex) => {
    let match;
    while ((match = relativeImportRegex.exec(line)) !== null) {
      const [, prefix, importPath, suffix] = match;
      
      // Skip if it's already a .js, .json, .ts, or .tsx import
      if (importPath.endsWith('.js') || importPath.endsWith('.json') || 
          importPath.endsWith('.ts') || importPath.endsWith('.tsx')) {
        continue;
      }
      
      // Check if the corresponding .ts file exists
      const fullPath = path.resolve(path.dirname(filePath), importPath);
      const tsFilePath = fullPath + '.ts';
      const indexTsPath = path.join(fullPath, 'index.ts');
      
      if (fs.existsSync(tsFilePath) || fs.existsSync(indexTsPath)) {
        const expectedPath = fs.existsSync(indexTsPath) 
          ? `${importPath}/index.js` 
          : `${importPath}.js`;
          
        errors.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index + prefix.length,
          message: `Missing .js extension in import. Expected: "${expectedPath}"`,
          actual: importPath,
          expected: expectedPath
        });
      }
    }
    // Reset regex for next iteration
    relativeImportRegex.lastIndex = 0;
  });
  
  return errors;
}

// Main execution
const srcDir = './src';
console.log('🔍 Checking TypeScript files for missing .js extensions...\n');

try {
  const tsFiles = findTsFiles(srcDir);
  let totalErrors = 0;
  
  tsFiles.forEach((file) => {
    const errors = checkImportsInFile(file);
    if (errors.length > 0) {
      totalErrors += errors.length;
      console.log(`❌ ${file}:`);
      errors.forEach(error => {
        console.log(`  Line ${error.line}:${error.column} - ${error.message}`);
        console.log(`    Found:    "${error.actual}"`);
        console.log(`    Expected: "${error.expected}"`);
        console.log('');
      });
    }
  });
  
  if (totalErrors === 0) {
    console.log('✅ All relative imports have proper .js extensions!');
    process.exit(0);
  } else {
    console.log(`\n❌ Found ${totalErrors} import(s) missing .js extensions in ${tsFiles.filter(file => checkImportsInFile(file).length > 0).length} file(s).`);
    console.log('\n💡 Run `node fix-imports.cjs` to automatically fix these issues.');
    process.exit(1);
  }
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
