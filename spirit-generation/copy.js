const fs = require('fs');

async function main() {
  const src = './';
  const destinations = ['../spirit-showdown/src/', '../server/'];

  const files = [
    'spiritGeneration.js', 'assets/words.js', 'assets/abilities.js',
  ];

  for (let i = 0; i < destinations.length; i++) {
    for (let j = 0; j < files.length; j++) {
      const src_file = src + files[j];
      const dest_file = destinations[i] + files[j];
      
      fs.readFile(src_file, 'utf-8', (r_err, data) => {
        if (r_err) {
          console.log("READ ERROR > " + r_err);
        } else {
          console.log(`Read ${src_file} successfully. \nWriting to ${dest_file} ...`);
          fs.writeFile(dest_file, data, (w_err) => {
            if (w_err) {
              console.log("WRITE ERROR > " + w_err);
            } else {
              console.log(`Wrote to ${dest_file} successfully.`);
            }
          });
        }
      });
    }
  }
}

console.log("\n>>> Starting copying of spiritGeneration.js and required assets...");
main();