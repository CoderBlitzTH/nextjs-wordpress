const fs = require('fs');
const path = require('path');

const generatedFile = path.join('gql', 'gql.ts');

fs.readFile(generatedFile, 'utf8', (readError, data) => {
  if (readError) {
    throw readError;
  }

  const updatedContent = `// @ts-nocheck\n${data}`;

  fs.writeFile(generatedFile, updatedContent, 'utf8', writeError => {
    if (writeError) {
      throw writeError;
    }
  });
});
