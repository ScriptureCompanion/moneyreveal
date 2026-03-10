console.log("%c MoneyReveal app.js VERSION 3 - Transfers & Internal REMOVED ", "background:#27ae60;color:#fff;font-size:14px;padding:4px 8px;border-radius:4px;");

const fileInput = document.getElementById("fileInput");
const results = document.getElementById("results");

const CATEGORY_KEYWORDS = {

  "Food & Dining": [
    "ica","coop","lidl","willys","hemköp","hemkop",
    "restaurant","restaurang","pizza","burger","cafe","coffee","kafé",
    "espresso house","max","mcdonald","burger king",
    "pressbyrån","pressbyran","systembolaget","mat","livsmedel"
  ],

  "Transport": [
    "uber","bolt","taxi","sl","sj","mtab","skånetrafiken","vasttrafik",
    "buss","tåg","train","flyg","ryanair","sas","norwegian",
    "shell","circle k","okq8","preem","st1",
    "fuel","bensin","diesel","parkering","p-hus","p-avgift",
    "trängselskatt","congestion"
  ],

  "Travel": [
    "hotel","hotell","airbnb","booking.com","expedia","hotels.com",
    "trivago","hostel","resort","hyra bil","avis","hertz","europcar",
    "airport","flygplats","kryssning"
  ],

  "Software & SaaS": [
    "spotify","netflix","youtube","hbo","prime video","viaplay","disney",
    "apple","icloud","itunes","google","google play","microsoft","office 365",
    "adobe","dropbox","slack","zoom","notion","figma","github","gitlab",
    "atlassian","jira","trello","hubspot","salesforce","pipedrive",
    "mailchimp","mailerlite","canva","intercom","typeform","zapier",
    "loom","calendly","clickup","airtable","webflow","squarespace",
    "wix","wordpress","elementor","chatgpt","openai","anthropic"
  ],

  "Accounting & Admin": [
    "fortnox","visma","bokio","pe accounting","speedledger",
    "skatteverket","bolagsverket","kronofogden",
    "revisor","redovisning","bokföring","årsredovisning",
    "accountor","pwc","kpmg","deloitte","ey "
  ],

  "Marketing": [
    "meta","facebook ads","facebook","instagram","google ads","adwords",
    "linkedin ads","linkedin","twitter ads","tiktok ads","snapchat ads",
    "mailerlite","mailchimp","klaviyo","activecampaign","sendinblue",
    "canva","semrush","ahrefs","hotjar","unbounce","leadpages",
    "printful","tryck","reklam","annons"
  ],

  "Telecom & Internet": [
    "telia","tele2","telenor","tre","3 sverige","comviq","hallon","vimla",
    "bahnhof","bredband","halebop","boxer","telesur","ip-only",
    "mobilabonnemang","bredbandsabonnemang","internet","telefoni","mobil"
  ],

  "Office Supplies": [
    "kontorsmaterial","staples","officedepot","papyrus","apax",
    "kontorsvaror","pennor","papper","skrivare","bläck","toner",
    "reco","lyreco"
  ],

  "Shipping & Postage": [
    "postnord","posten","dhl","fedex","ups","schenker","bring","budbee",
    "instabox","airmee","frakt","porto","paket","leverans","courier"
  ],

  "Rent & Premises": [
    "hyra","hyresavi","lokalhyra","kontorshyra","sublease",
    "fastighetsägare","brf","hsb","riksbyggen","hyresvärd"
  ],

  "Utilities": [
    "el","elbolag","vattenfall","eon","fortum","tibber","bixia",
    "vatten","fjärrvärme","gas","sophämtning","avfall","renhållning",
    "elnät","elöverföring"
  ],

  "Insurance": [
    "försäkring","folksam","if försäkring","trygg hansa","länsförsäkringar",
    "skandia","alecta","afa","premie","insurance","hemförsäkring",
    "företagsförsäkring","olycksfallsförsäkring"
  ],

  "Health": [
    "apotek","apoteket","kronans","apotek hjartat","lloyds apotek",
    "pharmacy","doctor","läkare","klinik","clinic","tandläkare","tandvård",
    "gym","fitness","sats","actic","nordic wellness","sjukvård","friskvård",
    "optiker","synoptik","specsavers"
  ],

  "Education": [
    "kurs","utbildning","konferens","seminarium","workshop","webinar",
    "udemy","coursera","linkedin learning","pluralsight","skillshare",
    "bok","böcker","bokus","adlibris","kompendium"
  ],

  "Shopping & Equipment": [
    "amazon","zalando","ikea","hm","h&m","clas ohlson","biltema","jula",
    "elgiganten","media markt","webhallen","dustin","komplett","inet",
    "kjell","kjell och company","netonnet","tretti","stadium","decathlon",
    "verktyg","utrustning","inköp","equipment"
  ],

  "Banking & Fees": [
    "bankavgift","kontoavgift","kortavgift","årsavgift","serviceavgift",
    "avgift","aviavgift","aviiseringsavgift",
    "ränta","räntekostnad","dröjsmålsränta","övertrasseringsavgift",
    "valutaväxling","exchange fee","swift","banköverföring"
  ],

  "Loans & Credit": [
    "amortering","lånebetalning","lån","kredit","kreditfaktura",
    "klarna","resurs bank","ikano","seb lån","nordea lån",
    "leasing","avbetalning","skuld"
  ],

  "Taxes": [
    "skatteverket","f-skatt","a-skatt","moms","arbetsgivaravgift",
    "preliminärskatt","arbetsgivare","sociala       avgifter","skatteåterbäring",
    "skattebetalning","skattsedel","trängselskatt"
  ],

  "Payroll & Owner Draw": [
    "lön","lönebetalning","löneuttag","eget uttag","uttag",
    "utbetalning lön","personalkostnad","arvode","konsultarvode",
    "dividend","utdelning","lönespecifikation"
  ],

  "Internal Transfers": [
    "överföring","överf","överf mobil","stående överf","autogiro",
    "bg ","pg ","bankgiro","plusgiro","intern","interntransfer",
    "sparande","flytt","swish"
  ],

  "Investment": [
    "avanza","investment"
  ],

"Entertainment": [
    "tickster","ticketmaster","ticket","event"
  ],

  "Memberships & Fees": [
    "a-kassa","akassa","fackavgift","medlemsavgift","föreningsavgift","unionen"
  ],

  "Personal Transfers": [
    "överf mobil","överföring mobil","overforing mobil",
    "overf mobil",
    "överf internet","overf internet",
    "stående överf","staende overf",
    "stående","staende"
  ]

};
const MERCHANT_ALIASES = {

  "ica": ["ica","ica supermarket","ica kvantum","ica nara"],
  "coop": ["coop","coop konsum","coop forum"],
  "willys": ["willys"],
  "lidl": ["lidl"],
  "hemköp": ["hemköp","hemkop"],

  "systembolaget": ["systembolaget"],

  "espresso house": ["espresso house"],
  "pressbyrån": ["pressbyrån","pressbyran"],
  "max": ["max burger","max"],
  "burger king": ["burger king"],
  "mcdonald": ["mcdonald","mcdonalds"],

  "shell": ["shell"],
  "circle k": ["circle k","circlek"],
  "okq8": ["okq8"],
  "preem": ["preem"],

  "uber": ["uber"],
  "bolt": ["bolt"],
  "taxi": ["taxi"],

  "sj": ["sj","statens jarnvagar"],
  "sl": ["sl","storstockholms lokaltrafik"],

  "spotify": ["spotify"],
  "netflix": ["netflix"],
  "youtube": ["youtube"],
  "apple": ["apple","itunes","apple.com"],
  "google": ["google","google play"],
  "microsoft": ["microsoft"],
  "adobe": ["adobe"],
  "dropbox": ["dropbox"],
  "icloud": ["icloud"],

  "amazon": ["amazon"],
  "zalando": ["zalando"],
  "ikea": ["ikea"],
  "h&m": ["hm","h&m"],
  "clas ohlson": ["clas ohlson"],
  "biltema": ["biltema"],
  "jula": ["jula"],
  "elgiganten": ["elgiganten"],
  "media markt": ["media markt"],

  "apoteket": ["apoteket"],
  "kronans apotek": ["kronans","kronans apotek"],
  "apotek hjartat": ["apotek hjartat"],

  "klarna": ["klarna"],
  "paypal": ["paypal"],
  "swish": ["swish"],

  "fortnox": ["fortnox"],
  "loopia": ["loopia"],
  "one": ["one.com"],
  "shopify": ["shopify"]

};

const MERCHANT_CATEGORY_MAP = {

  // --- Grocery / Supermarkets ---
  "ica": "Food & Dining",
  "coop": "Food & Dining",
  "willys": "Food & Dining",
  "lidl": "Food & Dining",
  "hemköp": "Food & Dining",
  "tesco": "Food & Dining",
  "aldi": "Food & Dining",
  "carrefour": "Food & Dining",
  "rewe": "Food & Dining",
  "spar": "Food & Dining",
  "whole foods": "Food & Dining",
  "kroger": "Food & Dining",
  "costco": "Food & Dining",
  "walmart": "Food & Dining",
  "target": "Food & Dining",

  // --- Restaurants / fast food ---
  "mcdonald": "Food & Dining",
  "burger king": "Food & Dining",
  "subway": "Food & Dining",
  "starbucks": "Food & Dining",
  "dominos": "Food & Dining",
  "pizza hut": "Food & Dining",
  "kfc": "Food & Dining",
  "taco bell": "Food & Dining",
  "espresso house": "Food & Dining",
  "max": "Food & Dining",

  // --- Food delivery ---
  "uber eats": "Food & Dining",
  "doordash": "Food & Dining",
  "foodora": "Food & Dining",
  "wolt": "Food & Dining",
  "deliveroo": "Food & Dining",
  "just eat": "Food & Dining",

  // --- Transport ---
  "uber": "Transport",
  "bolt": "Transport",
  "lyft": "Transport",
  "shell": "Transport",
  "circle k": "Transport",
  "okq8": "Transport",
  "preem": "Transport",
  "bp": "Transport",
  "esso": "Transport",
  "chevron": "Transport",
  "exxon": "Transport",

  // --- Public transport ---
  "sl": "Transport",
  "sj": "Transport",
  "vasttrafik": "Transport",
  "skånetrafiken": "Transport",
  "amtrak": "Transport",
  "db": "Transport",
  "sncf": "Transport",
  "trenitalia": "Transport",

  // --- Airlines ---
  "sas": "Travel",
  "ryanair": "Travel",
  "norwegian": "Travel",
  "lufthansa": "Travel",
  "british airways": "Travel",
  "klm": "Travel",
  "delta": "Travel",
  "united": "Travel",
  "american airlines": "Travel",

  // --- Hotels ---
  "booking": "Travel",
  "booking.com": "Travel",
  "airbnb": "Travel",
  "expedia": "Travel",
  "hotels.com": "Travel",
  "marriott": "Travel",
  "hilton": "Travel",
  "hyatt": "Travel",

  // --- Streaming ---
  "spotify": "Software & SaaS",
  "netflix": "Software & SaaS",
  "youtube": "Software & SaaS",
  "disney": "Software & SaaS",
  "hbo": "Software & SaaS",
  "prime video": "Software & SaaS",
  "apple tv": "Software & SaaS",

  // --- Big tech ---
  "apple": "Software & SaaS",
  "google": "Software & SaaS",
  "microsoft": "Software & SaaS",
  "amazon web services": "Software & SaaS",
  "aws": "Software & SaaS",

  // --- SaaS / dev tools ---
  "github": "Software & SaaS",
  "gitlab": "Software & SaaS",
  "figma": "Software & SaaS",
  "notion": "Software & SaaS",
  "slack": "Software & SaaS",
  "zoom": "Software & SaaS",
  "dropbox": "Software & SaaS",
  "adobe": "Software & SaaS",
  "openai": "Software & SaaS",
  "chatgpt": "Software & SaaS",
  "anthropic": "Software & SaaS",
  "canva": "Software & SaaS",
  "atlassian": "Software & SaaS",
  "jira": "Software & SaaS",

  // --- Ecommerce ---
  "amazon": "Shopping & Equipment",
  "zalando": "Shopping & Equipment",
  "ikea": "Shopping & Equipment",
  "hm": "Shopping & Equipment",
  "h&m": "Shopping & Equipment",
  "etsy": "Shopping & Equipment",
  "ebay": "Shopping & Equipment",
  "shopify": "Shopping & Equipment",

  // --- Electronics ---
  "elgiganten": "Shopping & Equipment",
  "media markt": "Shopping & Equipment",
  "best buy": "Shopping & Equipment",
  "netonnet": "Shopping & Equipment",
  "webhallen": "Shopping & Equipment",
  "micro center": "Shopping & Equipment",
  "apple store": "Shopping & Equipment",

  // --- Logistics ---
  "postnord": "Shipping & Postage",
  "dhl": "Shipping & Postage",
  "ups": "Shipping & Postage",
  "fedex": "Shipping & Postage",
  "schenker": "Shipping & Postage",
  "bring": "Shipping & Postage",
  "gls": "Shipping & Postage",

  // --- Telecom ---
  "telia": "Telecom & Internet",
  "tele2": "Telecom & Internet",
  "telenor": "Telecom & Internet",
  "vodafone": "Telecom & Internet",
  "verizon": "Telecom & Internet",
  "att": "Telecom & Internet",
  "tmobile": "Telecom & Internet",

  // --- Payment platforms ---
  "paypal": "Banking & Fees",
  "stripe": "Banking & Fees",
  "square": "Banking & Fees",
  "klarna": "Loans & Credit",
 "swish": "Personal Transfers",
  "venmo": "Personal Transfers",
  "cash app": "Personal Transfers",

  // --- Accounting ---
  "fortnox": "Accounting & Admin",
  "visma": "Accounting & Admin",
  "quickbooks": "Accounting & Admin",
  "xero": "Accounting & Admin",
  "bokio": "Accounting & Admin",

  // --- Government ---
  "skatteverket": "Taxes",
  "hmrc": "Taxes",
  "irs": "Taxes",
  "finanzamt": "Taxes",

  // --- Added mappings ---
  "stadshypotek": "Loans & Credit",
  "geab": "Utilities",
  "transportstyre": "Transport",
  "transportst": "Transport",
  "transportstyrelsen": "Transport",
  "region gotland": "Health",
  "qliro": "Loans & Credit",
  "destination go": "Travel",
  "skattekonto": "Taxes",
  "harry carlsson": "Shopping & Equipment",
  "avanza bank": "Investment",

  // --- Additional mappings ---
  "lf gotland": "Banking & Fees",
  "booking com": "Travel",
  "formvisborg": "Health",
  "intersport vi": "Shopping & Equipment",
  "mq marqet visb": "Shopping & Equipment",
  "hebe fiber": "Telecom & Internet",
"scandinavian a": "Travel",

  // --- New mappings ---
  "oob visby": "Shopping & Equipment",
  "unionens a kas": "Memberships & Fees",
  "unionens a-kas": "Memberships & Fees",
  "tickster": "Entertainment",
  "ticketmaster s": "Entertainment",
  "wavespeedai": "Software & SaaS",
  "zettle": "Banking & Fees",

  // --- Custom merchant mappings ---
  "licencia 2824": "Transport",
  "les 15 nits": "Food & Dining",
  "meze": "Food & Dining",
  "nyx wisbygaest": "Travel",
  "harnostjarna r": "Food & Dining",
  "walley": "Banking & Fees",
  "zettle granna": "Banking & Fees",
  "zettle bargar": "Banking & Fees",
  "zettle stora": "Banking & Fees",
  "svea bank": "Loans & Credit",
  "sumup pho ta": "Banking & Fees",
  "din x roma": "Transport",
  "adyen": "Banking & Fees",
  "craft n draft": "Food & Dining",
  "clarioncollect": "Travel",
  "dyning": "Food & Dining",
  "h rn stj": "Food & Dining"

};

function getBestSheet(workbook) {
  let bestRows = [];
  for (const name of workbook.SheetNames) {
    const ws = workbook.Sheets[name];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    if (rows.length > bestRows.length) bestRows = rows;
  }
  return bestRows;
}

let allTransactions = [];
let filesImported = 0;
let importedFileSignatures = new Set();

fileInput.addEventListener("change", handleFileUpload);

document.getElementById("resetData").onclick = () => {
  allTransactions = [];
  importedFileSignatures.clear();
  results.innerHTML = "<p>Data cleared.</p>";
};

function handleFileUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  results.textContent = `Reading ${files.length} file(s)...`;

  let supportedFiles = 0;
  let skippedFiles = 0;
  for (const file of files) {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || fileName.endsWith(".csv")) {
      const sig = `${file.name}|${file.size}|${file.lastModified}`;
      if (importedFileSignatures.has(sig)) {
        skippedFiles++;
        continue;
      }
      importedFileSignatures.add(sig);
      supportedFiles++;
      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        readExcelFile(file);
      } else {
        readCsvFile(file);
      }
    }
  }
  if (supportedFiles === 0 && skippedFiles === 0) {
    results.textContent = "No supported files found.";
  } else if (supportedFiles === 0 && skippedFiles > 0) {
    results.textContent = `All ${skippedFiles} file(s) already imported, skipped.`;
  } else if (skippedFiles > 0) {
    results.textContent = `Reading ${supportedFiles} file(s)... (${skippedFiles} duplicate(s) skipped)`;
  }
}

function readExcelFile(file) {
  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      const data = e.target.result;

      // Try SheetJS directly first
      try {
        const arr = new Uint8Array(data);
        const workbook = XLSX.read(arr, { type: "array", cellDates: true });
        console.log("Sheet names:", workbook.SheetNames);
        const allRows = getBestSheet(workbook);
                handleParsedRows(allRows, file.name, "excel");
        return;
      } catch (directErr) {
        console.warn("SheetJS direct failed, trying JSZip repack:", directErr.message);
      }

      // Repack ZIP with JSZip then re-read with SheetJS
      const zip = await JSZip.loadAsync(data);
      const repackedZip = new JSZip();
      for (const [path, zipEntry] of Object.entries(zip.files)) {
        if (!zipEntry.dir) {
          const content = await zipEntry.async("uint8array");
          repackedZip.file(path, content, { compression: "DEFLATE" });
        }
      }
      const repackedData = await repackedZip.generateAsync({ type: "uint8array" });
      const workbook = XLSX.read(repackedData, { type: "array", cellDates: true });
      console.log("Sheet names:", workbook.SheetNames);
      const allRows = getBestSheet(workbook);
      console.log("First 3 rows:", allRows.slice(0, 3));
      console.log("Row at index 9:", allRows[9]);
      console.log("Row at index 10:", allRows[10]);
      handleParsedRows(allRows, file.name, "excel-repacked");

    } catch (err) {
      console.error("All Excel read methods failed:", err);
      results.textContent = "Could not read Excel file: " + err.message;
    }
  };
  reader.readAsArrayBuffer(file);
}

function readCsvFile(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const text = e.target.result;
      const rows = parseCsv(text);
            handleParsedRows(rows, file.name, "csv");
    } catch (error) {
      console.error(error);
      results.textContent = "Could not read CSV file.";
    }
  };

  reader.readAsText(file);
}

function parseCsv(text) {
  // Detect delimiter from first non-empty line
  const firstLine = text.trimStart().split(/\r?\n/)[0];
  const delimiter = (firstLine.split(";").length >= firstLine.split(",").length) ? ";" : ",";

  const rows = [];
  let row = [];
  let cur = "";
  let inQuote = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuote) {
      if (ch === '"' && text[i + 1] === '"') {
        // Escaped quote
        cur += '"';
        i += 2;
      } else if (ch === '"') {
        inQuote = false;
        i++;
      } else {
        cur += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuote = true;
        i++;
      } else if (ch === delimiter) {
        row.push(cur.trim());
        cur = "";
        i++;
      } else if (ch === "\r" && text[i + 1] === "\n") {
        row.push(cur.trim());
        cur = "";
        if (row.some(c => c !== "")) rows.push(row);
        row = [];
        i += 2;
      } else if (ch === "\n") {
        row.push(cur.trim());
        cur = "";
        if (row.some(c => c !== "")) rows.push(row);
        row = [];
        i++;
      } else {
        cur += ch;
        i++;
      }
    }
  }

  // Flush last field/row
  row.push(cur.trim());
  if (row.some(c => c !== "")) rows.push(row);

  return rows;
}

function handleParsedRows(rows, fileName, fileType) {
  console.log("Raw rows:", rows);

  if (handleParsedRows.__skipAdd) {
    // Rerender path: skip parsing, just rebuild HTML from allTransactions
  } else {
  if (!rows || rows.length === 0) {
    results.textContent = "No rows found in file.";
    return;
  }
  filesImported += 1;

  const previewRows = rows.slice(0, 8);
 const normalizedRows = normalizeRows(rows);
  console.log("Normalized rows:", normalizedRows);

  validateBalanceSequence(normalizedRows);

  allTransactions = allTransactions.concat(normalizedRows);

  // Deduplicate
  const uniqueMap = new Map();
  allTransactions.forEach(t => {
    const key = t.date + t.description + t.amount;
    uniqueMap.set(key, t);
  });
  allTransactions = Array.from(uniqueMap.values());
  allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  } // end !__skipAdd
  
  const allDates = allTransactions.map(t => new Date(t.date)).filter(d=>!isNaN(d));
const minDate = allDates.length ? new Date(Math.min(...allDates)).toISOString().slice(0,10) : "—";
const maxDate = allDates.length ? new Date(Math.max(...allDates)).toISOString().slice(0,10) : "—";

let html = `
<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;">
  <div style="flex:1;min-width:160px;padding:12px 16px;background:#f0f4ff;border-left:4px solid #4a6cf7;border-radius:6px;">
    <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">Analysis Period</div>
    <div style="font-size:15px;font-weight:600;">${minDate} → ${maxDate}</div>
  </div>
  <div style="flex:1;min-width:160px;padding:12px 16px;background:#f0f4ff;border-left:4px solid #4a6cf7;border-radius:6px;">
    <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">Files Imported</div>
    <div style="font-size:15px;font-weight:600;">${filesImported}</div>
  </div>
  <div style="flex:1;min-width:160px;padding:12px 16px;background:#f0f4ff;border-left:4px solid #4a6cf7;border-radius:6px;">
    <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">Total Transactions</div>
    <div style="font-size:15px;font-weight:600;">${allTransactions.length}</div>
  </div>
</div>`;

  if (allTransactions.length > 0) {
    const expenses = allTransactions.filter(
      r =>
        r.amount < 0 &&
        r.category !== "Internal Transfers" &&
        r.category !== "Personal Transfers"
    );
    const income = allTransactions.filter(
      r =>
        r.amount > 0 &&
        r.category !== "Internal Transfers" &&
        r.category !== "Personal Transfers"
    );
    const totalSpent = expenses.reduce((s, r) => s + r.amount, 0);
    const totalIn = income.reduce((s, r) => s + r.amount, 0);
    const net = totalIn + totalSpent;

    const descCount = {};
    expenses.forEach(r => {
      const key = r.description.toLowerCase().trim();
      descCount[key] = (descCount[key] || 0) + 1;
    });
    const recurring = Object.entries(descCount)
  .filter(([, n]) => n >= 2)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

const { subscriptions, recurringMerchants } = detectSubscriptions(allTransactions);
    const monthlyEstimate = estimateMonthlySpending(allTransactions);

   console.log(subscriptions);

    // Top spending categories (simple keyword buckets)
    const catTotals = {};
   expenses.forEach(r => {
  const cat = r.category || "Other";
  catTotals[cat] = (catTotals[cat] || 0) + Math.abs(r.amount);
});
    const topCats = Object.entries(catTotals)
      .filter(
        ([cat]) =>
          cat !== "Other" &&
          cat !== "Personal Transfers" &&
          cat !== "Internal Transfers"
      )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const fmt = n => (n == null || isNaN(n)) ? "—" : n.toLocaleString("sv-SE", { minimumFractionDigits: 2 });

    html += `
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin:16px 0;">
      <div style="flex:1;min-width:160px;padding:14px 18px;background:#fff8f0;border-left:4px solid #e07000;border-radius:6px;">
        <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">Total Spent</div>
        <div style="font-size:22px;font-weight:700;color:#c0392b;">${fmt(totalSpent)}</div>
      </div>
      <div style="flex:1;min-width:160px;padding:14px 18px;background:#f0fff4;border-left:4px solid #27ae60;border-radius:6px;">
        <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">Total Income</div>
        <div style="font-size:22px;font-weight:700;color:#27ae60;">+${fmt(totalIn)}</div>
      </div>
     <div style="flex:1;min-width:160px;padding:14px 18px;background:#f5f5ff;border-left:4px solid #7b5ea7;border-radius:6px;">
        <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">Net</div>
        <div style="font-size:22px;font-weight:700;color:${net >= 0 ? "#27ae60" : "#c0392b"};">${net >= 0 ? "+" : ""}${fmt(net)}</div>
      </div>
    </div>`;
    html += `
    <div style="flex:1;min-width:160px;padding:14px 18px;background:#fffbe6;border-left:4px solid #e0a800;border-radius:6px;">
      <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">
        Estimated Monthly Spending
      </div>
      <div style="font-size:22px;font-weight:700;color:#e07000;">
        ${fmt(monthlyEstimate)}
      </div>
    </div>`;

// Categorization coverage
    const categorized = allTransactions.filter(t => t.category !== "Other").length;
    const covPct = allTransactions.length ? Math.round((categorized/allTransactions.length)*100) : 0;
    html += `
    <div style="margin:16px 0;padding:12px 16px;background:#f9f9f9;border-left:4px solid #aaa;border-radius:6px;">
      <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">Categorization Coverage</div>
      <div style="font-size:15px;font-weight:600;">${covPct}% categorized &nbsp; <span style="color:#888;font-weight:400;">${100-covPct}% uncategorized</span></div>
    </div>`;

    // Auto insight: largest category (exclude Personal Transfers)
    const topCatsForInsight = Object.entries(catTotals)
      .filter(
        ([cat]) =>
          cat !== "Personal Transfers" &&
          cat !== "Internal Transfers" &&
          cat !== "Other"
      )
      .sort((a, b) => b[1] - a[1]);
    if(topCatsForInsight.length > 0){
      const grandForInsight = topCatsForInsight.reduce((s,[,v])=>s+v,0)||1;
      const [topCatName, topCatVal] = topCatsForInsight[0];
      const topCatPct = Math.round((topCatVal/grandForInsight)*100);
      html += `
      <div style="margin:16px 0;padding:12px 16px;background:#fff8e1;border-left:4px solid #f0b429;border-radius:6px;">
        <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">Insight</div>
        <div style="font-size:14px;">${topCatName === "Other" ? "A large share of your spending is still uncategorized. Add more merchant mappings to improve analysis." : `${topCatName} is your largest expense category (${topCatPct}% of spending).`}</div>
      </div>`;
    }
    
    if (topCats.length > 0) {
      const grandTotal = topCats.reduce((s, [, v]) => s + v, 0) || 1;
      html += `<div style="margin:16px 0;"><strong>Spending by Category</strong><div style="margin-top:8px;">`;
      topCats.forEach(([cat, val]) => {
        const pct = Math.round((val / grandTotal) * 100);
        html += `<div style="margin-bottom:6px;font-size:13px;">
          <span style="display:inline-block;width:140px;">${cat}</span>
          <span style="display:inline-block;background:#e0e0e0;width:180px;height:10px;border-radius:5px;vertical-align:middle;">
            <span style="display:block;background:#e07000;width:${pct}%;height:10px;border-radius:5px;"></span>
          </span>
          <span style="margin-left:8px;">${fmt(val)} (${pct}%)</span>
        </div>`;
      });
      html += `</div></div>`;
    }

    if (recurring.length > 0) {
      html += `<div style="margin:16px 0;"><strong>Likely Recurring Payments</strong><ul style="margin-top:6px;">`;
      recurring.forEach(([desc, count]) => {
        html += `<li style="font-size:13px;">${desc} — ${count}x</li>`;
      });
      html += `</ul></div>`;
    }

   if(subscriptions.length > 0){
      html += `<div style="margin:16px 0;"><strong>Detected Subscriptions</strong><ul style="margin-top:6px;">`;
      subscriptions.slice(0,5).forEach(s => {
        html += `<li style="font-size:13px;">${s.merchant} – ~${s.avgAmount} kr / month (${s.count}x)</li>`;
      });
      html += `</ul></div>`;
    }

    if(recurringMerchants.length > 0){
      html += `<div style="margin:16px 0;"><strong>Recurring Merchants</strong><ul style="margin-top:6px;">`;
      recurringMerchants.slice(0,5).forEach(s => {
        html += `<li style="font-size:13px;">${s.merchant} – ~${s.avgAmount} kr avg (${s.count}x)</li>`;
      });
      html += `</ul></div>`;
    }

// Top Merchants
    const uncatMerchants = {};
    expenses.filter(t => t.category === "Other" && t.merchant && t.merchant !== "unknown").forEach(t => {
      uncatMerchants[t.merchant] = (uncatMerchants[t.merchant] || 0) + Math.abs(t.amount);
    });
    const topUncat = Object.entries(uncatMerchants).sort((a, b) => b[1] - a[1]).slice(0, 15);

    const merchantTotals = {};
    expenses.forEach(t => {
      merchantTotals[t.merchant] = (merchantTotals[t.merchant]||0) + Math.abs(t.amount);
    });
    const topMerchants = Object.entries(merchantTotals).sort((a,b)=>b[1]-a[1]).slice(0,5);
    if(topMerchants.length > 0){
      html += `<div style="margin:16px 0;"><strong>Top Merchants</strong><div style="margin-top:8px;">`;
      topMerchants.forEach(([merchant, total]) => {
        html += `<div style="margin-bottom:4px;font-size:13px;">
          <span style="display:inline-block;width:180px;text-transform:capitalize;">${merchant}</span>
          <span style="color:#c0392b;">${fmt(total)} kr</span>
        </div>`;
      });
      html += `</div></div>`;
    }
    
    if (topUncat.length > 0) {
      html += `<div style="margin:16px 0;"><strong>Top Uncategorized Merchants</strong><div style="margin-top:8px;">`;
      topUncat.forEach(([merchant, total]) => {
        html += `<div style="margin-bottom:4px;font-size:13px;">
          <span style="display:inline-block;width:180px;text-transform:capitalize;">${merchant}</span>
          <span style="color:#888;">${fmt(total)} kr</span>
        </div>`;
      });
      html += `</div></div>`;
    }

    const ALL_CATEGORY_OPTIONS = Object.keys(CATEGORY_KEYWORDS).concat(
      ["Other"].filter(c => !Object.keys(CATEGORY_KEYWORDS).includes(c))
    );

    html += `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:13px;margin-top:16px;">
      <thead><tr style="background:#f5f5f5;"><th>Date</th><th>Description</th><th>Amount</th><th>Category</th></tr></thead>
      <tbody>`;
   allTransactions.forEach((row, idx) => {
      const color = row.amount < 0 ? "#c0392b" : "#27ae60";
      let rowBg = "";
      if (row.category === "Other") rowBg = 'background:#fff3cd;';
      else if (row.category === "Personal Transfers") rowBg = 'background:#eef2ff;';
      const opts = ALL_CATEGORY_OPTIONS.map(c =>
        `<option value="${c}"${c === row.category ? " selected" : ""}>${c}</option>`
      ).join("");
      html += `<tr style="${rowBg}">
        <td>${row.date}</td>
        <td>${row.description}</td>
        <td style="color:${color};text-align:right;">${fmt(row.amount)}</td>
        <td><select data-merchant="${row.merchant}" style="font-size:12px;padding:2px;">${opts}</select></td>
      </tr>`;
    });
    html += `</tbody></table>`;
  } else {
    html += `<p>No transactions parsed. Raw preview:</p><pre>${(typeof previewRows !== "undefined" ? previewRows : []).map(r => JSON.stringify(r)).join("\n")}</pre>`;
  }

  results.innerHTML = html;

  results.querySelectorAll("select[data-merchant]").forEach(sel => {
    sel.addEventListener("change", function() {
      const merchant = this.getAttribute("data-merchant");
      const category = this.value;
      setMerchantCategoryOverride(merchant, category);
      allTransactions.forEach(t => { if (t.merchant === merchant) t.category = category; });
      handleParsedRows.__rerender();
    });
  });

  handleParsedRows.__rerender = function() {
    // Re-invoke rendering by re-calling with current allTransactions already populated
    // We call handleParsedRows with empty rows to skip re-parsing; guard with flag
    handleParsedRows.__skipAdd = true;
    handleParsedRows([], "__rerender__", "rerender");
    handleParsedRows.__skipAdd = false;
  };
}

// --- Column alias map: maps bank-specific header names to normalized keys ---
const COLUMN_ALIASES = {
  date:            ["datum", "date", "fecha"],
  bookingDate:     ["bokföringsdatum", "bokfdatum", "bokf datum", "booking date", "bookingdate", "buchungsdatum"],
  transactionDate: ["transaktionsdatum", "transaction date", "transactiondate", "valuedate", "value date", "handelsdatum"],
  description:     ["beskrivning", "text", "description", "merchant", "payee", "name", "mottagare", "transaktion", "details", "memo", "transaction text", "avsändare", "namn"],
  description2:    ["referens", "reference", "meddelande", "message", "ocr", "kommentar", "comment", "note", "notering"],
  amount:          ["belopp", "amount", "amount (sek)", "belopp sek", "sum", "total", "transaktionsbelopp", "value", "importe", "debit/credit"],
  debit:           ["debet", "uttag", "ut", "belopp ut", "debit amount", "debit", "withdrawals", "withdrawal"],
  credit:          ["kredit", "insättning", "in", "belopp in", "credit amount", "credit", "deposits", "deposit"],
  balance:         ["saldo", "balance", "running balance", "available balance", "saldo efter transaktion"]
};

function detectColumns(headerRow) {
  const cols = {
    date: -1, bookingDate: -1, transactionDate: -1,
    description: -1, description2: -1,
    amount: -1, debit: -1, credit: -1, balance: -1
  };
  headerRow.forEach((cell, i) => {
    const normalized = String(cell).toLowerCase().trim();
    for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
      if (cols[key] === -1 && aliases.includes(normalized)) {
        cols[key] = i;
      }
    }
  });
  return cols;
}

function inferColumnsByData(rows, sampleSize = 30) {
  const scores = [];
  const sample = rows.slice(0, sampleSize);

  for (let col = 0; col < (rows[0] || []).length; col++) {
    let dateScore = 0;
    let amountScore = 0;
    let textScore = 0;

    sample.forEach(r => {
      const v = String(r[col] ?? "").trim();

      if (/^\d{4}-\d{2}-\d{2}/.test(normalizeDate(v))) dateScore++;
      if (!isNaN(parseAmount(v))) amountScore++;
      if (/[a-zåäö]/i.test(v)) textScore++;
    });

    scores[col] = { col, dateScore, amountScore, textScore };
  }

  const dateCol = scores.sort((a,b)=>b.dateScore-a.dateScore)[0]?.col ?? -1;
  const amountCol = scores.sort((a,b)=>b.amountScore-a.amountScore)[0]?.col ?? -1;
  const textCol = scores.sort((a,b)=>b.textScore-a.textScore)[0]?.col ?? -1;

  return { date: dateCol, amount: amountCol, description: textCol };
}

function normalizeDate(value) {
  if (value == null || value === "") return "";

  // JS Date object (from SheetJS cellDates:true)
  if (value instanceof Date) {
    if (isNaN(value)) return "";
    return value.toISOString().slice(0, 10);
  }

  // Excel serial number (e.g. 45123)
  if (typeof value === "number") {
    // Excel epoch: Dec 30 1899
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const ms = excelEpoch.getTime() + value * 86400000;
    const d = new Date(ms);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0, 10);
  }

  const s = String(value).trim();

  // YYYY-MM-DD or YYYY-MM-DD HH:mm:ss
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10).replace("T", " ").slice(0, 10);

  // YYYY/MM/DD
  if (/^\d{4}\/\d{2}\/\d{2}/.test(s)) return s.slice(0, 10).replace(/\//g, "-");

  // YYYYMMDD
  if (/^\d{8}$/.test(s)) return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;

  // DD/MM/YYYY
  const dmy1 = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(s);
  if (dmy1) return `${dmy1[3]}-${dmy1[2]}-${dmy1[1]}`;

  // DD-MM-YYYY
  const dmy2 = /^(\d{2})-(\d{2})-(\d{4})/.exec(s);
  if (dmy2) return `${dmy2[3]}-${dmy2[2]}-${dmy2[1]}`;

  return s; // return as-is and let the existing date filter handle it
}

function isValidTransactionRow(date, amount, description) {
  if (!date) return false;
  if (amount === null || isNaN(amount)) return false;
  if (Math.abs(amount) > 100000000) return false;

  const text = (description || "").toLowerCase();

  const invalidWords = [
    "saldo",
    "balance",
    "total",
    "opening",
    "closing",
    "summary"
  ];

  if (invalidWords.some(w => text.includes(w))) return false;

  return true;
}

function normalizeRows(rows) {
  const transactions = [];

  let startIndex = 0;
  let cols = { date: 1, description: 2, amount: 3, balance: 4 }; // fallback

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowText = row.join(" ").toLowerCase();
    // Detect any row that contains date-like and amount-like headers
    const hasDateCol  = COLUMN_ALIASES.date.some(a => rowText.includes(a));
    const hasAmountCol = COLUMN_ALIASES.amount.some(a => rowText.includes(a));
    if (hasDateCol && hasAmountCol) {
      cols = detectColumns(row);
      startIndex = i + 1;
      console.log("Detected columns:", cols, "at row", i);
      break;
    }
  }

  if (cols.date === -1 && cols.amount === -1) {
    console.log("Header not detected, using probabilistic inference");
    cols = inferColumnsByData(rows.slice(0, 40));
    startIndex = 0;
  }

  console.log("Transactions start at row index:", startIndex);
  console.log("Total rows in file:", rows.length);

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;
    // Date: prefer transactionDate > bookingDate > date
    const dateColIndex =
      cols.transactionDate !== -1 ? cols.transactionDate :
      cols.bookingDate     !== -1 ? cols.bookingDate :
      cols.date;
    const date = normalizeDate(row[dateColIndex] ?? "");

    // Description: combine description + description2 if both present and different
    const desc1 = cols.description  !== -1 ? String(row[cols.description]  ?? "").trim() : "";
    const desc2 = cols.description2 !== -1 ? String(row[cols.description2] ?? "").trim() : "";
    const description = (desc2 && desc2 !== desc1) ? `${desc1} ${desc2}`.trim() : desc1;

    // Amount: use amount column, or derive from debit/credit
    let rawAmt = "";
    let amount = null;
    if (cols.amount !== -1) {
      rawAmt = String(row[cols.amount] ?? "").trim();
      amount = parseAmount(rawAmt);
    } else if (cols.debit !== -1 || cols.credit !== -1) {
      const debitVal  = cols.debit  !== -1 ? parseAmount(String(row[cols.debit]  ?? "")) : null;
      const creditVal = cols.credit !== -1 ? parseAmount(String(row[cols.credit] ?? "")) : null;
      const debitNum  = (debitVal  != null && debitVal  !== 0) ? -Math.abs(debitVal)  : 0;
      const creditNum = (creditVal != null && creditVal !== 0) ?  Math.abs(creditVal) : 0;
      if (debitVal != null || creditVal != null) {
        amount = debitNum + creditNum || null;
      }
      rawAmt = String(row[cols.debit !== -1 ? cols.debit : cols.credit] ?? "").trim();
    }

    const balance = cols.balance !== -1 ? parseAmount(String(row[cols.balance] ?? "")) : null;
   if (!date && !description) continue;
    if (!isValidTransactionRow(date, amount, description)) continue;
 const merchant = normalizeMerchant(description);

transactions.push({
  date,
  description,
  merchant,
  amount,
  balance,
  rawAmount: rawAmt,
  category: getMerchantCategoryOverride(merchant) || detectCategory(merchant)
});
  }

  if (transactions.length > 0) {
    console.log("Date range:", transactions[transactions.length - 1].date, "->", transactions[0].date);
  }

  return transactions;
}

function parseAmount(value) {
  if (value == null || value === "") return null;

  let cleaned = String(value).trim();

  // 1. Strip currency prefix: "SEK", "EUR", "USD" etc
  cleaned = cleaned.replace(/^[A-Z]{2,3}\s*/i, "");
  cleaned = cleaned.trim();

  // 2. Trailing minus: "123,45-" → negativ
  const trailingMinus = cleaned.endsWith("-");
  if (trailingMinus) cleaned = cleaned.slice(0, -1);

  // 3. Parenteser som negativ: "(123,45)" → "-123,45"
  const parenNeg = /^\(([^)]+)\)$/.exec(cleaned);
  if (parenNeg) cleaned = "-" + parenNeg[1];

  // 4. Extrahera och spara ledande minus: "-123,45"
  let leadingMinus = false;
  if (cleaned.startsWith("-")) {
    leadingMinus = true;
    cleaned = cleaned.slice(1).trim();
  }

  // 5. Ta bort mellanslag (tusentalsavskiljare: "1 234,56")
  cleaned = cleaned.replace(/\s/g, "");

  // 6. Normalisera decimal/tusentalsavskiljare
  if (cleaned.includes(",") && cleaned.includes(".")) {
    const lastComma = cleaned.lastIndexOf(",");
    const lastDot   = cleaned.lastIndexOf(".");
    if (lastComma > lastDot) {
      // Europeiskt: "1.234,56" → punkt=tusental, komma=decimal
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      // Amerikanskt: "1,234.56" → komma=tusental
      cleaned = cleaned.replace(/,/g, "");
    }
  } else if (cleaned.includes(",")) {
    // Bara komma → decimalavskiljare
    cleaned = cleaned.replace(",", ".");
  }

  const num = Number(cleaned);
  if (Number.isNaN(num)) return null;

  const signed = leadingMinus ? -Math.abs(num) : num;
  return trailingMinus ? -Math.abs(signed) : signed;
}

function stripBankNoise(text) {
  const prefixes = [
    "kortköp", "kortkop", "köp", "kop", "card purchase", "purchase",
    "autogiro", "autogiro betalning",
    "swish betalning", "swish",
    "bg", "pg", "bankgiro", "plusgiro",
    "betalning", "transaktion", "överföring", "overföring",
    "insättning", "insattning", "uttag",
    "paypal", "internet", "övf", "ovf"
  ];

  let t = text;

  let changed = true;
  while (changed) {
    changed = false;
    for (const p of prefixes) {
      const re = new RegExp("^" + p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*", "");
      const next = t.replace(re, "");
      if (next !== t) { t = next.trim(); changed = true; }
    }
  }

  t = t.replace(/\b\d{6}\b/g, "");
  t = t.replace(/\b\d{8}\b/g, "");
  t = t.replace(/\b\d{4}-\d{2}-\d{2}\b/g, "");
  t = t.replace(/\b[\d*-]{5,}\b/g, "");
  t = t.replace(/\b(ab|as|oy|ltd|gmbh|inc|llc|kb|hb)\b/g, "");
  t = t.replace(/\s+/g, " ").trim();

  return t;
}

function normalizeMerchant(description) {

  let text = description.toLowerCase();

  // remove special characters (keep letters, digits, spaces, swedish chars, * for PAYPAL*SHOPIFY)
  text = text.replace(/[^a-zåäö0-9\s*]/g, " ");

  // collapse spaces
  text = text.replace(/\s+/g, " ").trim();

  // check alias dictionary first (before stripping numbers, so "circle k" etc. still match)
  for (const merchant in MERCHANT_ALIASES) {
    for (const alias of MERCHANT_ALIASES[merchant]) {
      if (text.includes(alias)) {
        return merchant;
      }
    }
  }

  // strip noise, then try alias match again on cleaned text
  const cleaned = stripBankNoise(text);

  for (const merchant in MERCHANT_ALIASES) {
    for (const alias of MERCHANT_ALIASES[merchant]) {
      if (cleaned.includes(alias)) {
        return merchant;
      }
    }
  }

  // merchant clustering fallback on cleaned text
  const clusterWords = [
    "ica", "coop", "willys", "lidl", "hemköp", "systembolaget",
    "shell", "circle", "okq8", "preem", "uber", "bolt",
    "spotify", "netflix", "apple", "google", "amazon",
    "klarna", "paypal", "swish"
  ];

  const words = cleaned.split(" ").filter(Boolean);

  for (const word of words) {
    if (clusterWords.includes(word)) {
      return word;
    }
  }

  // best 1-3 word phrase from remaining cleaned text
  const phrase = words.slice(0, 3).join(" ");
  return phrase || "unknown";
}

function detectCategory(merchant) {
  const text = merchant.toLowerCase();

  // Check merchant-to-category index first (fast, exact match)
  if (MERCHANT_CATEGORY_MAP[text]) {
    return MERCHANT_CATEGORY_MAP[text];
  }

  // Early check: transfer-like merchants containing "internet" or "mobil" must not fall into Telecom
  const transferPrefixes = [
    "överf internet","overf internet",
    "överf mobil","overf mobil",
    "överföring mobil","overforing mobil",
    "stående överf","staende overf"
  ];
  if (transferPrefixes.some(p => text.includes(p))) {
    return "Personal Transfers";
  }

  // Fall back to keyword scanning over CATEGORY_KEYWORDS
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }

  if (looksLikePersonName(text)) {
    return "Personal Transfers";
  }

  return "Other";
}

function getMerchantCategoryOverride(merchant) {
  try { return localStorage.getItem("cat_override:" + merchant) || null; } catch(e) { return null; }
}
function setMerchantCategoryOverride(merchant, category) {
  try { localStorage.setItem("cat_override:" + merchant, category); } catch(e) {}
}

function looksLikePersonName(text) {
  const words = text.trim().split(/\s+/);
  if (words.length < 2 || words.length > 3) return false;
  for (const w of words) {
    if (!/^[a-zåäö]+$/.test(w)) return false;
    if (w.length < 2) return false;
  }
  const businessPatterns = [
    "ab","as","kb","hb","ltd","inc","llc","gmbh","oy",
    "bank","banken","skatt","hypotek","trafik","styrelsen",
    "bolaget","handel","service","center","gruppen","media",
    "förening","stiftelse","region","stad","kommun","myndighet",
    "apotek","försäkring","finans","kredit","invest","fond",
    "transport","logistik","teknik","system","digital","online",
    "shop","store","market","butik","go","destination","booking"
  ];
  for (const w of words) {
    if (businessPatterns.includes(w)) return false;
  }
  return true;
}

function validateBalanceSequence(transactions) {
  // Only run if at least half the rows have a balance value — otherwise data
  // does not carry a running balance column and every row would fire a warning.
  const withBalance = transactions.filter(t => t.balance != null);
  if (withBalance.length < transactions.length * 0.5) return;

  let mismatches = 0;
  const MAX_WARNINGS = 3;

  for (let i = 1; i < transactions.length; i++) {
    const prev = transactions[i - 1];
    const curr = transactions[i];

    if (prev.balance != null && curr.balance != null && curr.amount != null) {
      const expected = prev.balance + curr.amount;
      const diff = Math.abs(expected - curr.balance);

      // Tolerance: 1 unit — covers rounding in source files
      if (diff > 1) {
        mismatches++;
        if (mismatches <= MAX_WARNINGS) {
          console.warn("Balance mismatch at row", i, "— expected", expected.toFixed(2), "got", curr.balance, curr);
        }
      }
    }
  }

  if (mismatches > MAX_WARNINGS) {
    console.warn(`Balance mismatch: ${mismatches} total rows affected (first ${MAX_WARNINGS} logged above).`);
  }
}

function detectSubscriptions(transactions){

  const groups = {};

  transactions.forEach(t => {
    if (t.amount >= 0) return;
    if (t.category === "Internal Transfers" || t.category === "Personal Transfers") return;
    const key = t.merchant;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  const subscriptions = [];
  const recurringMerchants = [];

  for(const merchant in groups){
    const list = groups[merchant].sort((a,b)=>new Date(a.date)-new Date(b.date));
    if(list.length < 2) continue;

    const amounts = list.map(t => Math.abs(t.amount));
    const avg = amounts.reduce((a,b)=>a+b,0)/amounts.length;
    const variance = Math.max(...amounts) - Math.min(...amounts);

    // Calculate average interval between payments in days
    let avgInterval = 0;
    if(list.length >= 2){
      const intervals = [];
      for(let i=1;i<list.length;i++){
        const diff = (new Date(list[i].date) - new Date(list[i-1].date))/(1000*60*60*24);
        intervals.push(diff);
      }
      avgInterval = intervals.reduce((a,b)=>a+b,0)/intervals.length;
    }

    const isSubscription = list.length >= 3 && (variance/avg) < 0.05 && avgInterval >= 20 && avgInterval <= 40;

    if(isSubscription){
      subscriptions.push({ merchant, count: list.length, avgAmount: avg.toFixed(2), type: "subscription" });
    } else if(list.length >= 2){
      recurringMerchants.push({ merchant, count: list.length, avgAmount: avg.toFixed(2), type: "recurring" });
    }
  }

  return { subscriptions, recurringMerchants };
}

function estimateMonthlySpending(transactions) {
  const expenses = transactions.filter(
    r =>
      r.amount < 0 &&
      r.category !== "Internal Transfers" &&
      r.category !== "Personal Transfers"
  );
  if (expenses.length === 0) return 0;
  const dates = expenses.map(r => new Date(r.date)).filter(d => !isNaN(d));
  if (dates.length < 2) return Math.abs(expenses.reduce((s, r) => s + r.amount, 0));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const days = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24));
  const total = Math.abs(expenses.reduce((s, r) => s + r.amount, 0));
  return (total / days) * 30;
}

