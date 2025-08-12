
// v3: English UI, nicer UX, macros + day totals, shopping list with Oda links.
// Estimates; not medical advice.

const ODA_SEARCH = (q) => `https://oda.com/no/search/?q=${encodeURIComponent(q)}`;

function defaultDayType(date = new Date()){
  const dow = (date.getDay()+6)%7 + 1; // Mon=1 ... Sun=7
  if([1,2,3].includes(dow)) return "A_1500";
  if([4,5].includes(dow)) return "B_1200";
  return "C_1350";
}

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function sum(a,b){ return { kcal:a.kcal+b.kcal, protein:a.protein+b.protein, carbs:a.carbs+b.carbs, fat:a.fat+b.fat }; }

// ===== Recipes & Macros
const breakfasts = [
  {
    tag: "Breakfast",
    title: "High‑Protein Oat Pancakes + Fruit",
    ingredients: [
      "40 g oats (or wholegrain flour)",
      "100 ml egg whites + 1 tsp oil for pan",
      "50–100 ml milk (any)",
      "15 g 100% nut butter",
      "150 g fruit (berries/apple)"
    ],
    steps: [
      "Blend oats, egg whites, milk; rest 5 min.",
      "Cook pancakes on lightly oiled pan.",
      "Top with nut butter; add fruit on the side."
    ],
    macros: { kcal: 430, protein: 24, carbs: 54, fat: 14 }
  },
  {
    tag: "Breakfast",
    title: "Avocado Toast & Egg + Fruit",
    ingredients: [
      "60 g wholegrain bread, toasted",
      "1 egg (poached/fried)",
      "40 g avocado",
      "10 g ghee or extra virgin olive oil",
      "150 g fruit"
    ],
    steps: [
      "Toast bread; smash avocado.",
      "Cook egg; drizzle oil/ghee.",
      "Serve with fruit."
    ],
    macros: { kcal: 465, protein: 13, carbs: 49, fat: 24 }
  },
  {
    tag: "Breakfast",
    title: "Greek Yogurt Bowl",
    ingredients: [
      "150 g 0% Greek yogurt (or 125 g kefir)",
      "30 g wholegrain flakes",
      "15 g nuts or 15 g 85% dark chocolate",
      "150 g fruit"
    ],
    steps: [
      "Mix yogurt and flakes.",
      "Top with nuts or dark chocolate and fruit."
    ],
    macros: { kcal: 400, protein: 18, carbs: 53, fat: 11 }
  },
  {
    tag: "Breakfast",
    title: "Chocolate Protein Pudding",
    ingredients: [
      "40 g quick oats",
      "150 ml milk",
      "150 g 0% Greek yogurt",
      "5 g cocoa powder",
      "15 g honey",
      "150 g fruit"
    ],
    steps: [
      "Microwave oats + milk 3 min; cool slightly.",
      "Stir in yogurt and cocoa; chill briefly.",
      "Top with honey; add fruit."
    ],
    macros: { kcal: 455, protein: 24, carbs: 67, fat: 7 }
  }
];

const amSnack = {
  tag: "Snack (AM)",
  title: "Hot Drink",
  ingredients: ["Coffee/tea/herbal tea — no sugar"],
  steps: ["Enjoy."],
  macros: { kcal: 5, protein: 0, carbs: 0, fat: 0 }
};

const pmSnackNuts = {
  tag: "Snack (PM)",
  title: "Mixed Nuts",
  ingredients: ["20 g mixed nuts"],
  steps: ["Portion and eat."],
  macros: { kcal: 120, protein: 4, carbs: 4, fat: 10 }
};

const pmSnackFruitNuts = {
  tag: "Snack (PM)",
  title: "Fruit + Nuts",
  ingredients: ["150 g fruit", "20 g mixed nuts (or 8 olives)"],
  steps: ["Combine."],
  macros: { kcal: 210, protein: 5, carbs: 27, fat: 10 }
};

const lunchAB = [
  {
    tag: "Lunch",
    title: "Rice Cakes + Tofu & Veg",
    ingredients: [
      "5 rice cakes (~45 g total)",
      "Tofu 150 g",
      "Mixed vegetables 250 g",
      "10 g EVOO/flax oil mix"
    ],
    steps: [
      "Sear tofu, sauté vegetables; season with tamari/herbs.",
      "Serve with rice cakes."
    ],
    macros: { kcal: 460, protein: 23, carbs: 49, fat: 18 }
  },
  {
    tag: "Lunch",
    title: "Rice Cakes + Eggs & Salad",
    ingredients: [
      "5 rice cakes",
      "2 eggs + 1 extra white",
      "Salad + tomatoes/cucumber 250 g",
      "10 g EVOO/flax oil mix"
    ],
    steps: [
      "Boil or scramble eggs.",
      "Dress salad; serve with rice cakes."
    ],
    macros: { kcal: 480, protein: 28, carbs: 48, fat: 20 }
  }
];

const grainOptions = [
  { name:"80 g wholegrain pasta", macros:{ kcal: 280, protein: 10, carbs: 56, fat: 2 } },
  { name:"80 g quinoa or mixed grains", macros:{ kcal: 300, protein: 11, carbs: 54, fat: 4 } },
  { name:"80 g farro/orzo/bulgur/couscous", macros:{ kcal: 280, protein: 9, carbs: 56, fat: 2 } },
  { name:"250 g potatoes (or 300 g sweet potato)", macros:{ kcal: 210, protein: 5, carbs: 48, fat: 0 } }
];

const vegBase = { kcal: 80, protein: 4, carbs: 16, fat: 1 }; // 250 g mixed veg
const oil10 = { kcal: 90, protein: 0, carbs: 0, fat: 10 };
const avocado40 = { kcal: 64, protein: 1, carbs: 3, fat: 6 };

const proteins = [
  { name:"Ricotta 150 g", macros:{ kcal: 210, protein: 15, carbs: 6, fat: 14 } },
  { name:"Tofu 150 g", macros:{ kcal: 120, protein: 14, carbs: 3, fat: 7 } },
  { name:"Tempeh 125 g", macros:{ kcal: 230, protein: 20, carbs: 12, fat: 11 } },
  { name:"Cooked legumes 240 g", macros:{ kcal: 260, protein: 18, carbs: 44, fat: 2 } },
  { name:"Eggs 2 + 1 white", macros:{ kcal: 210, protein: 20, carbs: 1, fat: 14 } }
];

function buildGrainBowl(tag){
  const g = pick(grainOptions);
  const p = pick(proteins);
  const fatSource = Math.random()<0.5 ? { name:"10 g EVOO/flax oil (3:1)", macros: oil10 }
                                      : { name:"Avocado 40 g", macros: avocado40 };
  const macros = sum(sum(sum(g.macros, p.macros), vegBase), fatSource.macros);
  const ingredients = [ g.name, p.name, "Mixed vegetables ~250 g", fatSource.name ];
  return { tag, title: `${g.name} + ${p.name}`, ingredients, steps: [
      "Cook grain al dente.",
      "Prepare protein (sear tofu/tempeh, warm legumes, or cook eggs).",
      "Combine with vegetables; add oil or avocado."
    ], macros };
}

const dinnersForAB = () => buildGrainBowl("Dinner");
const lunchesForC = () => buildGrainBowl("Lunch");

// ===== Build plan
function buildPlan(type){
  const breakfast = pick(breakfasts);
  const lunch = (type==="A_1500" || type==="B_1200") ? pick(lunchAB) : lunchesForC();
  const pmSnack = (type==="C_1350") ? pmSnackFruitNuts : pmSnackNuts;
  const dinner = (type==="B_1200") ? pick(lunchAB) : dinnersForAB();
  return [ breakfast, amSnack, lunch, pmSnack, dinner ];
}

// ===== Render
function render(plan, type){
  const root = document.getElementById("plan");
  root.innerHTML = "";
  let totals = { kcal:0, protein:0, carbs:0, fat:0 };

  plan.forEach(item => {
    totals = sum(totals, item.macros);
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="badge"><span class="dot"></span>${item.tag}</div>
      <h3>${item.title}</h3>
      <div class="meal-body">
        <div class="ing">
          <h4>Ingredients</h4>
          <ul>${item.ingredients.map(i=>`<li>${i}</li>`).join("")}</ul>
        </div>
        <div class="steps">
          <h4>Steps</h4>
          <ol>${item.steps.map(s=>`<li>${s}</li>`).join("")}</ol>
        </div>
        <div class="macros">
          <span><strong>${item.macros.kcal}</strong> kcal</span>
          <span><strong>${item.macros.protein}</strong> g protein</span>
          <span><strong>${item.macros.carbs}</strong> g carbs</span>
          <span><strong>${item.macros.fat}</strong> g fat</span>
        </div>
      </div>`;
    root.appendChild(div);
  });

  // Totals
  document.getElementById("kcalTotal").textContent = Math.round(totals.kcal);
  document.getElementById("proteinTotal").textContent = Math.round(totals.protein);
  document.getElementById("carbTotal").textContent = Math.round(totals.carbs);
  document.getElementById("fatTotal").textContent = Math.round(totals.fat);
  document.getElementById("date").textContent = new Date().toLocaleDateString();
  localStorage.setItem("preferredType", type);

  // Build shopping list
  buildShopping(plan);
}

// ===== Shopping List with Oda Links
function normalizeName(name){
  // Lowercase, remove grams quantities and extra descriptors for grouping
  return name.toLowerCase()
    .replace(/~?\\s*\\d+\\s*g/gi, "")
    .replace(/\\(.*?\\)/g, "")
    .replace(/\\s+/g, " ")
    .replace(/(^\\s|\\s$)/g, "");
}

function parseItems(ingredients){
  // Convert ingredient text to a canonical list for shopping (rough parsing)
  // We keep the readable label and also a search query for Oda.
  return ingredients.map(raw => {
    const label = raw;
    // Basic mapping to better search terms
    let q = raw.toLowerCase()
      .replace("evoo", "olivenolje")
      .replace("extra virgin olive oil", "olivenolje extra virgin")
      .replace("flax", "linfrø")
      .replace("egg whites", "eggehvite")
      .replace("egg", "egg")
      .replace("wholegrain", "fullkorn")
      .replace("oats", "havregryn")
      .replace("milk", "melk")
      .replace("yogurt", "yoghurt")
      .replace("nuts", "nøtter")
      .replace("rice cakes", "riskaker")
      .replace("mixed vegetables", "blandede grønnsaker")
      .replace("avocado", "avokado")
      .replace("berries", "bær")
      .replace("potatoes", "poteter")
      .replace("sweet potato", "søtpotet")
      .replace("quinoa", "quinoa")
      .replace("farro", "spelt")
      .replace("couscous", "couscous")
      .replace("bulgur", "bulgur");
    return { label, key: normalizeName(label), search: q };
  });
}

function buildShopping(plan){
  const listEl = document.getElementById("shoppingList");
  listEl.innerHTML = "";

  // Gather ingredients from all meals
  let items = [];
  plan.forEach(m => items.push(...parseItems(m.ingredients)));

  // Group by key
  const map = new Map();
  for(const it of items){
    if(!map.has(it.key)) map[it.key] = { label: it.label, search: it.search, count: 1 };
    else map[it.key].count += 1;
  }

  // Render
  Object.values(map).sort((a,b)=>a.label.localeCompare(b.label)).forEach(entry => {
    const li = document.createElement("li");
    li.className = "shop-item";

    const left = document.createElement("div");
    left.className = "shop-left";

    const box = document.createElement("div");
    box.className = "checkbox";
    box.setAttribute("role","checkbox");
    box.setAttribute("aria-checked","false");
    box.addEventListener("click", () => {
      const checked = box.classList.toggle("checked");
      box.setAttribute("aria-checked", checked ? "true":"false");
      box.textContent = checked ? "✓" : "";
    });

    const name = document.createElement("div");
    name.className = "item-name";
    const times = entry.count>1 ? ` ×${entry.count}` : "";
    name.textContent = `${entry.label}${times}`;

    left.appendChild(box);
    left.appendChild(name);

    const right = document.createElement("div");
    right.className = "item-link";
    const a = document.createElement("a");
    a.href = ODA_SEARCH(entry.search);
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "Search on Oda";
    right.appendChild(a);

    li.appendChild(left);
    li.appendChild(right);
    listEl.appendChild(li);
  });

  // Clear button
  const clear = document.getElementById("clearChecks");
  clear.onclick = () => {
    document.querySelectorAll(".checkbox.checked").forEach(el => {
      el.classList.remove("checked");
      el.setAttribute("aria-checked","false");
      el.textContent = "";
    });
  };
}

// ===== App init
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
