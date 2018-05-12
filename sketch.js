//const formResolution = 80;

const calculatePositionX = (i, radius, angle) => cos(angle * i) * radius;

const calculatePositionY = (i, radius, angle) => sin(angle * i) * radius;

const calcAngle = formResolution => radians(360 / formResolution);

//(defn produce-tiles [angle radius form-resolution]
//(for [i (range form-resolution)] [(calc-pos-x i radius angle) (calc-pos-y i radius angle)]))
const produceTiles = (angle, radius, formResolution) => {
  return Array.from(new Array(formResolution), (a, i) => {
    const x = calculatePositionX(i, radius, angle),
      y = calculatePositionY(i, radius, angle);
    return [x, y];
  });
};

const hsbRgb = a => map(a, 0, 100, 0, 255);

const hsbToColor = a => color(a, hsbRgb(b), hsbRgb(c));

const retroColor = () => {
  switch (round(random(0, 3))) {
    case 1:
      return color(9, 255, 195);
    case 2:
      return color(0, 232, 187);
    default:
      return color(255, 5, 243);
  }
};

//;x and y axis calculation
//(defn c-x-location [location step-size]
//(+ (first location) (q/random (- step-size) step-size)))

//(defn c-y-location [location step-size]
//(+ (second location) (q/random (- step-size) step-size)))
//
const calculateXLocation = (location, stepSize) =>
  location[0] + random(-stepSize, stepSize);
const calculateYLocation = (location, stepSize) =>
  location[1] + random(-stepSize, stepSize);

//(defn c-location [step-size locations]
//(for [location locations] [(c-x-location location step-size) (c-y-location location step-size)]))
//
const calculateLocations = (stepSize, locations) => {
  return locations.map(location => [
    calculateXLocation(location, stepSize),
    calculateYLocation(location, stepSize),
  ]);
};

const xLoc = (centerX, location) => location[0] + centerX;
const yLoc = (centerY, location) => location[1] + centerY;

const drawVertex = (centerX, centerY, location) => {
  const x = xLoc(centerX, location),
    y = yLoc(centerY, location);
  curveVertex(x, y);
};

const iRadius = 800;

function mousePressed() {
  angle = calcAngle(formResolution);
  radius = iRadius * random(0.2, 1.0);
  locations = produceTiles(angle, radius, formResolution);
}

let formResolution,
  stepSize,
  locations,
  centerX,
  centerY,
  mode,
  angle,
  radius,
  song,
  amp;

function preload() {
  song = loadSound('nasa.mp3');
}

function setup() {
  createCanvas(2550, 1440);
  frameRate(30);
  colorMode(RGB);
  smooth();
  background(255, 241, 76);

  formResolution = 1000;
  radius = iRadius;
  stepSize = 50;
  angle = calcAngle(formResolution);
  locations = produceTiles(angle, radius, formResolution);
  centerX = width / 2;
  centerY = height / 2;
  song.play();
  amp = new p5.Amplitude();
  mode = 0;
}

function draw() {
  radius = map(amp.getLevel(), 0, 1, 100, 800);
  locations = produceTiles(angle, radius, formResolution);
  background(color(255, 241, 76));
  centerX = width / 2;
  centerY = height / 2;
  locations = calculateLocations(stepSize, locations);
  lastLocation = locations[locations.length - 1];
  firstLocation = locations[0];
  secondLocation = locations[1];

  strokeWeight(10);
  stroke(retroColor());
  noFill();
  beginShape();
  drawVertex(centerX, centerY, lastLocation);
  locations.map(location => drawVertex(centerX, centerY, location));
  drawVertex(centerX, centerY, firstLocation);
  drawVertex(centerX, centerY, secondLocation);
  endShape();
}
