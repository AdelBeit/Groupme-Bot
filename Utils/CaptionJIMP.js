/**
 * Caption an image using the JIMP library
 */

/* eslint-disable no-unused-vars */
'use strict';
const jimp = require('jimp');
const path = require('path');
const fs = require('fs');

let activeDir = '../Assets/active/',
exportDir = '../Assets/export/';

const defaultFont = jimp.FONT_SANS_64_WHITE;

/**
 * Caption an image and return the path
 * 
 * Async function, returns a promise
 */
function caption(rawPath, caption){
  return new Promise((resolve, reject) => {
    
    caption = {'text':caption};
    caption.x = 0,
    caption.y = 0;

    const fileName = generateName()+'.jpg';

    let rawDir = path.resolve(__dirname, rawPath);
    activeDir = path.resolve(__dirname, activeDir+fileName),
    exportDir = path.resolve(__dirname, exportDir+fileName);

    jimp.read(rawDir)
    .then(image => {image.clone().write(activeDir)})

    .then(() => {jimp.read(activeDir)

      .then(image => {
        jimp.loadFont(defaultFont).then(font => {

          let width = image.bitmap.width,
          height = image.bitmap.height;

          caption.x = width/12;
          caption.y = height/20;

          caption.maxWidth = width - (width/6);
          caption.maxHeight = height - (height/10);
          
          return image.print(
            font, 
            caption.x, 
            caption.y, 
            {
              text: caption.text,
              alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
              alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
            }, 
            caption.maxWidth,
            caption.maxHeight
          );
        })
      
        .then(image => {image.quality(100).write(exportDir)})
        
        .then(image => {
          console.log('exported image: ' + exportDir);
          // cleanup
          fs.unlink(activeDir,error => {if(error) throw error});
          resolve(exportDir);
        })
      })
    })

    .catch(error => {if(error) reject(error)});
  });
}

/**
 * generator a string of random chars
 */
function generateName(len = 10) {
	const alphabet = 'abcde12345';
	let word = '',
		index = 0;
	for (let i = 0; i < len; i++) {
		index = Math.floor(Math.random() * alphabet.length);
		word += alphabet.substring(index, index + 1);
	}
	return word;
}


function basicTest(){
  const p = "../Assets/raw/test2.jpg";
  caption(p,"dUmDUm");
}
basicTest();


module.exports = {
  caption: caption
}


