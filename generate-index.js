//Create the index.js file using command node generate-index.js
import fs from 'fs';
import path from 'path';

const projectRoot = './'; //path to where we want to create the file

//In the direcotry get all the .js files from all the folders expect node_modules and return absolute path
function getAllJavaScriptFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory && file !== 'node_modules') {
      // Skip the 'node_modules' directory
      getAllJavaScriptFiles(filePath, fileList);
    } else if (!isDirectory && file.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allJavaScriptFiles = getAllJavaScriptFiles(projectRoot);

//Generate export statements for each JavaScript file found during the search
const exportStatements = allJavaScriptFiles.map((filePath) => {
  const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
  return `export * from './${relativePath}';`;
});

//Writing the generated export statements to index.js
const indexFilePath = path.join(projectRoot, 'index.js');
fs.writeFileSync(indexFilePath, exportStatements.join('\n'));

console.log(`index.js created in ${indexFilePath}`);
