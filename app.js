
// Data and rules adapted from the user's PDF plan (vegetarian swaps, grams, rotation).
// Not medical advice.

const grainOptions = [
  "Riso basmati/integrale/venere 80 g",
  "Farro/orzo/bulgur/cous cous 80 g",
  "Quinoa/avena/mix cereali/miglio 80 g",
  "Pasta integrale/di legumi/mais 80 g",
  "Patate dolci 300 g oppure patate classiche 250 g",
];

const vegProteins = [
  "Uova: 2 intere + 1 albume",
  "Ricotta fresca 150 g",
  "Stracchino/Crescenza 100 g (light 100 g; standard 50 g)",
  "Grana Padano 60 g",
  "Tofu 150 g",
  "Tempeh 125 g",
  "Edamame 150 g",
  "Legumi cotti 240 g (o 80 g secchi)",
  "Piselli/fave 300 g",
  "Burger vegetale 1 pz",
  "Affettato vegano 50 g",
];

const breakfasts = [
  {
    title: "Pancake integrali",
    details: "40 g farina (avena/riso/farro) + 100 ml albume + latte q.b.; 15 g crema 100% frutta secca; frutta 150 g."
  },
  {
    title: "Avocado toast & uovo",
    details: "60 g pane integrale + 1 uovo; 40 g avocado; 10 g burro chiarificato o 10 g olio mix; frutta 150 g."
  },
  {
    title: "Yogurt greco & cereali",
    details: "150 g yogurt greco (o 125 g kefir) + 30 g fiocchi; 15 g frutta secca o 15 g fondente; frutta 150 g."
  },
  {
    title: "Budino proteico cacao",
    details: "40 g avena + 150 ml latte (microonde 3') + 150 g yogurt greco 0% + 5 g cacao; riposa; frutta 150 g; 15 g miele."
  },
  {
    title: "Toast ricotta",
    details: "60 g pane integrale + 100 g ricotta + 10 g burro chiarificato/olio; frutta 150 g."
  },
  {
    title: "Wrap hummus & verdure",
    details: "Piadina 60 g con 50 g hummus/tofu + verdure; frutta 150 g; 10 g olio o 15 g frutta secca o 40 g avocado."
  }
];

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function defaultDayType(date = new Date()){
  // ISO Monday=1 ... Sunday=7
  const dow = (date.getDay()+6)%7 + 1;
  if([1,2,3].includes(dow)) return "A_1500";
  if([4,5].includes(dow)) return "B_1200";
  return "C_1350";
}

function lunchFor(type){
  if(type==="A_1500" || type==="B_1200"){
    const base = "4–6 gallette di riso/mais/quinoa (oppure 20 g triangolini legumi/mais)";
    const protein = pick(vegProteins);
    return { title: `Pranzo: gallette + ${protein}`, details: `${base}; verdure 250 g; Olio mix 10–20 g.` };
  } else {
    const grain = pick(grainOptions);
    const protein = pick(vegProteins);
    return { title: `Primo ${grain} + ${protein}`, details: `Verdure 250 g; olio mix 10 g o avocado 40 g.` };
  }
}

function dinnerFor(type){
  if(type==="B_1200"){
    const base = "4–6 gallette di riso/mais/quinoa (oppure 20 g triangolini legumi/mais)";
    const protein = pick(vegProteins);
    return { title: `Cena: gallette + ${protein}`, details: `${base}; verdure 250 g; Olio mix 10–20 g.` };
  } else {
    const grain = pick(grainOptions);
    const protein = pick(vegProteins);
    return { title: `Cena: ${grain} + ${protein}`, details: `Verdure 250 g; olio mix 10 g o avocado 40 g.` };
  }
}

function buildPlan(type){
  const breakfast = pick(breakfasts);
  const amSnack = { title: "Bevanda calda", details: "Caffè lungo/orzo/tè/tisana — senza zucchero." };
  const lunch = lunchFor(type);
  const pmSnack = (type==="C_1350")
    ? { title: "Frutta + frutta secca", details: "Frutta 150 g + 20 g frutta secca (oppure 8 olive)." }
    : { title: "Frutta secca / Olive", details: "20 g frutta secca mista oppure 8 olive." };
  const dinner = dinnerFor(type);

  return [
    { tag:"Breakfast", ...breakfast },
    { tag:"Snack (AM)", ...amSnack },
    { tag:"Lunch", ...lunch },
    { tag:"Snack (PM)", ...pmSnack },
    { tag:"Dinner", ...dinner }
  ];
}

function render(plan, type){
  const root = document.getElementById("plan");
  root.innerHTML = "";
  plan.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<span class="tag">${item.tag}</span>
                     <h3>${item.title}</h3>
                     <p>${item.details}</p>`;
    root.appendChild(div);
  });
  document.getElementById("date").textContent = new Date().toLocaleDateString();
  localStorage.setItem("preferredType", type);
}

async function registerSW(){
  if('serviceWorker' in navigator){
    try { await navigator.serviceWorker.register('service-worker.js'); } catch(e){}
  }
}

function init(){
  registerSW();
  const sel = document.getElementById("dayType");
  const saved = localStorage.getItem("preferredType");
  if(saved){ sel.value = saved; }

  const type = sel.value || defaultDayType();
  render(buildPlan(type), type);

  document.getElementById("regenBtn").addEventListener("click", () => {
    const t = sel.value;
    render(buildPlan(t), t);
  });

  document.getElementById("todayBtn").addEventListener("click", () => {
    const t = defaultDayType();
    sel.value = t;
    render(buildPlan(t), t);
  });

  sel.addEventListener("change", () => {
    const t = sel.value;
    render(buildPlan(t), t);
  });
}

document.addEventListener("DOMContentLoaded", init);
