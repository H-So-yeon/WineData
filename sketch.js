let wineGlass;
let maskImage;
let grape1;
let grape2;
let wineData;
let purpleShades = [];
let ellipses = [];
let selectedTitles = []; // 선택된 국가의 와인 타이틀을 저장할 배열
let minDiameter = 32; 
let maxDiameter = 320;
let selectedEllipse = null; //
let button;

function preload() {
  wineGlass = loadImage('glass.png');
  maskImage = loadImage('mask.png');
  grape1 = loadImage('grape.png');
  grape2 = loadImage('grape2.png');
  wineData = loadTable('WineDataset.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  document.body.style.overflow = 'hidden';

  purpleShades = [
    color(128, 0, 128, 150),
    color(138, 43, 226, 150),
    color(147, 112, 219, 150),
    color(153, 50, 204, 150),
    color(186, 85, 211, 150), 
    color(221, 160, 221, 150),
    color(151, 80, 231, 150),
    color(100, 80, 231,150),
    color(130, 100, 231,150),
    color(135, 0, 88,150),
    color(96, 12, 107, 150),
    color(140, 0, 143, 150),
    color(143, 0, 90, 150),
    color(140, 7, 120, 150),
    color(176, 16, 152, 150),
    color(248,202,218, 150),
    color(242,151,192,150,),
    color(217,94,168,150),
    color(179,53,164,150),
    color(129,8,98,150),
    color(110,5,94,150),
    color(92,4,87,150),
    color(72,2,74,150),
    color(108, 5,45,150),
    color(138, 28, 95, 150),
    color(212, 15, 166, 150),
    color(150, 3, 156, 150)
  ];



  // Button
  button = createButton("Go to Gehna's project");
  button.position((width - button.width) / 2, height*0.95);
  button.style('background-color', 'transparent'); 
  button.style('border', '2px solid #c4cca2');       
  button.style('color', '#000');                   
  button.style('padding', '5px 10px');           
  button.style('font-size', '18px');               
  button.style('border-radius', '0px');
  button.style('font-family', 'Crimson Text');
  button.style('color', '#c4cca2');
  button.style('cursor', 'pointer');

  button.mousePressed(() => {
    window.location.href = 'https://gehna-goel.github.io/mm621project2/';
  });



  // 나라별 비율 계산

  let countries = wineData.getColumn("Country").filter(country => country.trim() !== '');

  let countryCount = {};
  countries.forEach(country => {
    if (country) {
      countryCount[country] = (countryCount[country] || 0) + 1;
    }
  });

  let total = countries.length;
  let countryPercentage = {};
  for (let country in countryCount) {
    countryPercentage[country] = (countryCount[country] / total * 100).toFixed(2);
  }

  let uniqueCountries = [...new Set(countries)];
  let glassX = width / 2;
  let glassY = height / 3.5;

  let maskHeight = height * 0.39;
  let maskWidth = (maskImage.width / maskImage.height) * maskHeight;

  //Ellipse Area : chat gpt
  maskImage.loadPixels();

  let colorIndex = 0;

  for (let i = 0; i < uniqueCountries.length; i++) {
    let x, y;
    let validPosition = false;
    let attempts = 0;
    let maxAttempts = 100000;
  
    // ellipse size
    let productionPercent = countryPercentage[uniqueCountries[i]] || 0; // undefined = 0
    let diameter = map(productionPercent, 0, 100, minDiameter, maxDiameter);
    let radius = diameter / 2;
  
    while (!validPosition && attempts < maxAttempts) {
      x = random(glassX - maskWidth / 2 + radius, glassX + maskWidth / 2 - radius);
      y = random(glassY - maskHeight / 2 + radius, glassY + maskHeight / 2 - radius);
      attempts++;
  
      let localX = int(map(x, glassX - maskWidth / 2, glassX + maskWidth / 2, 0, maskImage.width));
      let localY = int(map(y, glassY - maskHeight / 2, glassY + maskHeight / 2, 0, maskImage.height));
      let pixelIndex = 4 * (localY * maskImage.width + localX);
      let brightness = maskImage.pixels[pixelIndex];
  
      if (brightness === 0) { // black > valid area
        validPosition = true;
  
        // prevent overlap
        for (let j = 0; j < ellipses.length; j++) {
          let other = ellipses[j];
          let distance = dist(x, y, other.x, other.y);
          if (distance < (radius + other.diameter / 2 - 1)) {
            validPosition = false;
            break;
          }
        }
      }
    }
  
    if (validPosition) {
      let color = purpleShades[colorIndex];
      colorIndex = (colorIndex + 1) % purpleShades.length;

      ellipses.push({
        x: x,
        y: y,
        color: purpleShades[i % purpleShades.length],
        country: uniqueCountries[i],
        percentage: productionPercent,
        diameter: diameter
      });
    }
  }
}


function draw() {
  background(243, 244, 239);
  textSize(40);
  textFont('Crimson Text');
  textAlign(LEFT);
  textStyle(NORMAL);
  fill(196, 204, 162);

  //Title
  text("Wine Data Visualization", width*0.01, height*0.03);

  textSize(20);
  textAlign(CENTER);
  fill(207, 207, 207);
  text("click the ellipse", width/2, height*0.06);

  //My Name
  textSize(20);
  textAlign(RIGHT);
  text("Anna Hwang", width*0.99, height*0.97);

  
  //Wine Glass Image
  let glassX = width / 2;
  let glassY = height / 2;

  let imgHeight = height * 0.85;
  let imgWidth = (wineGlass.width / wineGlass.height) * imgHeight;

  let maskHeight = height * 0.39;
  let maskWidth = (maskImage.width / maskImage.height) * maskHeight;


  // Shadow
  drawingContext.shadowOffsetX = width*0.7;
  drawingContext.shadowOffsetY = 5; 
  drawingContext.shadowBlur = 40;    
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.10)';

  fill(243, 244, 239);
  ellipse(0, height*0.9, width/2, maskHeight*0.15);

  // Glass Shadow
  drawingContext.shadowOffsetX = 150;
  drawingContext.shadowOffsetY = 5; 
  drawingContext.shadowBlur = 60;    
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.24)';

  // Glass Image
  image(wineGlass, glassX, glassY, imgWidth, imgHeight);
  
  // Clear Shadow
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0)';

  //Deco Grape
  image(grape1, 250, height*0.85, grape1.width/1.5, grape1.height/1.5);
  image(grape2, width - 250, height*0.15, grape1.width/1.5, grape1.height/1.5);


  //Info Ellipse
  for (let i = 0; i < ellipses.length; i++) {
    let e = ellipses[i];
    
    fill(e.color);
    noStroke();
    ellipse(e.x, e.y, e.diameter, e.diameter);

    fill(18, 7, 1);
    textAlign(CENTER, CENTER);
    textSize(e.diameter / 4);
    textFont('Old Standard TT');
    text(e.country, e.x, e.y);
  }

  
  // select ellipse > Couantry name]
  if (selectedEllipse) {
    fill(18, 7, 1);
    textSize(80);
    textAlign(LEFT);
    textFont('Crimson Text');
    textStyle(NORMAL);
    text(selectedEllipse.country, width * 0.66, height * 0.15);
    fill(135, 0, 20);
    textSize(70);
    text(`: ${selectedEllipse.percentage}%`, width * 0.66, height * 0.23);

    fill(18, 7, 1);
    stroke(0);
    strokeWeight(2);
    line(width * 0.66, height * 0.37, width * 0.67, height * 0.37);

    noStroke();
    textSize(30);
    text("Wine List", width * 0.675, height * 0.37);

    // Country Title
    textSize(18);
    let yOffset = height * 0.43;
    selectedTitles.forEach((title, index) => {
      text(`${index + 1}. ${title}`, width * 0.675, yOffset + index * 30);
    });
  }
}




function mousePressed() {
  // reset to purpleshades
  ellipses.forEach((e, i) => {
    e.color = purpleShades[i % purpleShades.length];
  });

  selectedEllipse = null;
  selectedTitles = [];

  for (let i = 0; i < ellipses.length; i++) {
    let e = ellipses[i];
    let d = dist(mouseX, mouseY, e.x, e.y);

    if (d < e.diameter / 2) {
      selectedEllipse = e;
      e.color = color(135, 0, 20);

      //Wine List
      let countryTitles = wineData.findRows(e.country, "Country").map(row => row.get("Title"));
      selectedTitles = countryTitles.slice(0, 10);
      break;
    }
  }
}
