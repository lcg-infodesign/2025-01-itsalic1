//variabili legate al dataset, alle statistiche e alla grafica
let table;
let col0 = [], col1 = [], col2 = [], col3 = [], col4 = [];

let media, std, moda, mediana, sommaFinale;
let fishX = 0;
let fishY = 200;
let fishSpeed;
// è necessario identificare l'array per poter disporre le bolle
let bubblePositions = [];
let numBolle = 30;

let fish_img;

/* passaggio necessario per caricare il dataset 
e le successive immagini */
function preload() {
  table = loadTable("dataset.csv", "csv");
  fish_img = loadImage("fish.png");
} 

function setup() {
  createCanvas(800, 600);
  textSize(14);
  textFont("Helvetica");

  /* attraverso questa formula individuo 
  e filtro le righe valide secondo le richieste di rules.txt */
  for (let i = 0; i < table.getRowCount(); i++) {
    let r = table.getRow(i);
    let v0 = r.getNum(0);
    let v1 = r.getNum(1);
    let v2 = r.getNum(2);
    let v3 = r.getNum(3);
    let v4 = r.getNum(4);

    if (v2 < 0 && Number.isInteger(v3) && v3 >= 30 && v3 < 42) {
      col0.push(v0);
      col1.push(v1);
      col2.push(v2);
      col3.push(v3);
      col4.push(v4);
    }
  }

  /* in seguito, utilizzo le variabili per associare a ciascuna la 
  funzione necessaria per calcolare il valore richiesto */
  media = calculateMean(col0);
  std = calculateStd(col1);
  moda = calculateMode(col2);
  mediana = calculateMedian(col3);
  media1 = calculateMean(col4) 
  std1 = calculateStd(col4);

  /* la funzione map mi aiuta a stabilire la velocità del pesciolino,
  proporzionalmente al risultato di std1 */
  fishSpeed = map(std1, 0, 100, 1, 5);

  /* il ciclo mi permette di posizionare le bolle
  in posizioni random ed il push di generarle come elementi 
  dell'array */
  for (let i = 0; i < numBolle; i++) {
  let x = random(width);
  let y = random(height);
  bubblePositions.push({ x: x, y: y });
}
}

function draw() {
  background(180, 220, 255);
 
  /*MEDIA COL. 0 - 
   disegno bolle, il cui diametro corrisponde alla media */
  drawBubbles()

  /* DEVIAZIONE COL. 1 E MODA COL. 2 -
  aggiungo degli elementi decorativi come "contenitori" +
  i valori legati alle due rappresentazioni testuali */
  drawContainers();
  fill("white");
  // nf mi aiuta a ridurre i decimali, formattando in modo corretto //
  text("Deviazione standard della colonna 1: " + nf(std, 1, 2), 20, 540);
  text("Moda della colonna 2: " + moda, 620, 540);

  /* MEDIANA COL. 3 - 
  basandomi sulla mediana, riproduco degli archi come fondale*/
  drawSeabed(mediana);

  /* DEV. STANDARD e MEDIA COL. 4 -
  disegno il pesciolino secondo le dimensioni standard e 
  aggiungo la media come modificatore per la posizione Y */
  function drawFish(x, y) {
  image(fish_img, x, y - media1, 120, 120);
  }
  /* aggiungo il movimento basandomi sul risultato della somma 
  tra media e deviazione standard */
  drawFish(fishX, fishY);
  fishX += fishSpeed;
  /* considerato l'incremento, aggiungo un leggero margine 
  affinchè il movimento del pesciolino sia ciclico */
  if (fishX > width + 100) fishX = -100;
}

/* MEDIANA COL. 3 -
 questa funzione mi permette di creare degli archi,
 la cui altezza corrisponde alla mediana */
function drawSeabed(mediana) {
  let arcHeight = mediana;
  fill(200, 180, 150);
  noStroke();
/* il ciclo parte da sinistra e, ad ogni giro, aumenta di 70
fino a che non raggiunge la fine */
  for (let x = 0; x <= width; x += 70) {
/* l'ampiezza è 80 in modo da creare una leggera sovrapposizione - 
PI, TWO_PI è perchè si parla di mezzo cerchio rivolto verso l'alto */
  arc(x, height, 90, arcHeight * 2, PI, TWO_PI);
}
}

/* MEDIA COL. 0 -
mi permette di disegnare un ellisse 
il cui diametro corrisponde alla media della colonna
e di replicarlo */
function drawBubbles() {
  let diametro = calculateMean(col0);
  noStroke();
  fill(0, 100, 255, 100);

/* considera i valori dell'array, li estrapola e, ad ognuno,
attribuisce una posizione x e y */
  for (let i = 0; i < bubblePositions.length; i++) {
    let pos = bubblePositions[i];
    ellipse(pos.x, pos.y, diametro, diametro);
  }
}

/* elementi decorativi in cui inserisco i valori rappresentati testualmente
"div + testo" */
function drawContainers() {
  noStroke();
  fill(40, 70, 100);
  triangle(
    -300, height,      
    0, height - 250,   
    500, height         
  );
  fill(40, 50, 100);
  triangle(
    100, height,         
    800, height - 180,   
    1000, height          
  );
}

function calculateMean(arr) {
  // calcola la somma dei numeri nell'array
    let somma = 0;
  /* ogni valore viene addizionato
  sino ad avere la somma totale dei numeri */
  for (let i = 0; i < arr.length; i++) {
    somma = somma + arr[i];
  }
  //divide la somma per il numero di elementi nell'array
  let media = somma / arr.length;
  //restituisce i valori
  return media;
;
}
/* si parte dal calcolare la media e, ad essa, si
aggiunge la varianza - ritrovata ccon la funzione reduce */
function calculateStd(arr) {
  let mean = calculateMean(arr);
  let variance = arr.reduce((sum, val) => sum + (val - mean) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

/* raggruppa i valori nell'array in ordine crescente e,
se i numeri sono dispari si considera il centrale; 
altrimenti, se pari, si trova la media tra i due centrali */
function calculateMedian(arr) {
  let sorted = [...arr].sort((a, b) => a - b);
  let mid = floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function calculateMode(array) {
  let frequenze = {};
  let maxFrequenza = 0;

  for (let i = 0; i < array.length; i++) {
    let valore = array[i];
    frequenze[valore] = (frequenze[valore] || 0) + 1;
    if (frequenze[valore] > maxFrequenza) {
      maxFrequenza = frequenze[valore];
    }
  }
/* essendoci più risultati, ho comparato il dataset con dataset-excel
e ho mantenuto, tra tutti, il valore più vicino allo zero */
  let candidati = [];
  for (let valore in frequenze) {
    if (frequenze[valore] === maxFrequenza) {
      candidati.push(Number(valore));
    }
  }

  return Math.max(...candidati);
}


