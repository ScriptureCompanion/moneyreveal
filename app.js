const fileInput = document.getElementById("fileInput");
const results = document.getElementById("results");

const CATEGORY_KEYWORDS = {

  "Food & Dining": [
    "ica","coop","lidl","willy","hemköp","pressbyrån",
    "restaurant","pizza","burger","cafe","coffee","sushi","bar"
  ],

  "Transport": [
    "uber","bolt","taxi","sl ","buss","tåg","train",
    "shell","circle","okq8","fuel","bensin","parkering"
  ],

  "Subscriptions": [
    "spotify","netflix","youtube","apple","google",
    "microsoft","hbo","adobe","icloud","prime"
  ],

  "Shopping": [
    "amazon","zalando","ikea","hm","h&m","zara",
    "elgiganten","media markt","komplett"
  ],

  "Health": [
    "apotek","pharmacy","doctor","clinic","gym","fitness"
  ]

};
const MERCHANT_ALIASES = {
  "ica": ["ica", "ica nara", "ica supermarket"],
  "coop": ["coop", "coop konsum"],
  "willys": ["willys"],
  "lidl": ["lidl"],
  "shell": ["shell"],
  "circle k": ["circle k", "circlek"],
  "spotify": ["spotify"],
  "netflix": ["netflix"],
  "apple": ["apple", "itunes", "apple.com"],
  "google": ["google"],
  "amazon": ["amazon"]
};

let allTransactions = [];

fileInput.addEventListener("change", handleFileUpload);

document.getElementById("resetData").onclick = () => {
  allTransactions = [];
  results.innerHTML = "<p>Data cleared.</p>";
};

function handleFileUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
 
  const filesImported = files.length;
  results.textContent = `Reading ${files.length} file(s)...`;

  for (const file of files) {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      readExcelFile(file);
    } else if (fileName.endsWith(".csv")) {
      readCsvFile(file);
    } else {
      totalFiles--;
      if (totalFiles === 0) results.textContent = "No supported files found.";
    }
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
        const allRows = [];
        workbook.SheetNames.forEach(name => {
          const ws = workbook.Sheets[name];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
          allRows.push(...rows);
        });
                handleParsedRows(allRows, file.name, "excel", filesImported);
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
      const allRows = [];
      workbook.SheetNames.forEach(name => {
        const ws = workbook.Sheets[name];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        allRows.push(...rows);
      });
      console.log("First 3 rows:", allRows.slice(0, 3));
      console.log("Row at index 9:", allRows[9]);
      console.log("Row at index 10:", allRows[10]);
      filesImported++;
      handleParsedRows(allRows, file.name, "excel-repacked", filesImported);

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
            handleParsedRows(rows, file.name, "csv", filesImported);
    } catch (error) {
      console.error(error);
      results.textContent = "Could not read CSV file.";
    }
  };

  reader.readAsText(file);
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .filter(line => line.trim() !== "");

  return lines.map(line => {
    if (line.includes(";")) {
      return line.split(";").map(cell => cell.trim());
    }
    return line.split(",").map(cell => cell.trim());
  });
}

function handleParsedRows(rows, fileName, fileType) {
  console.log("Raw rows:", rows);

  if (!rows || rows.length === 0) {
    results.textContent = "No rows found in file.";
    return;
  }

  const previewRows = rows.slice(0, 8);
 const normalizedRows = normalizeRows(rows);
  console.log("Normalized rows:", normalizedRows);

  allTransactions = allTransactions.concat(normalizedRows);

  // Deduplicate
  const uniqueMap = new Map();
  allTransactions.forEach(t => {
    const key = t.date + t.description + t.amount;
    uniqueMap.set(key, t);
  });
  allTransactions = Array.from(uniqueMap.values());
  allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

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
    const expenses   = allTransactions.filter(r => r.amount < 0);
    const income     = allTransactions.filter(r => r.amount > 0);
    const totalSpent = expenses.reduce((s, r) => s + r.amount, 0);
    const totalIn    = income.reduce((s, r) => s + r.amount, 0);
    const net        = totalIn + totalSpent;

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
    const topCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);

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

    // Auto insight: largest category
    if(topCats.length > 0){
      const grandForInsight = topCats.reduce((s,[,v])=>s+v,0)||1;
      const [topCatName, topCatVal] = topCats[0];
      const topCatPct = Math.round((topCatVal/grandForInsight)*100);
      html += `
      <div style="margin:16px 0;padding:12px 16px;background:#fff8e1;border-left:4px solid #f0b429;border-radius:6px;">
        <div style="font-size:11px;text-transform:uppercase;color:#888;margin-bottom:4px;">Insight</div>
        <div style="font-size:14px;">${topCatName} is your largest expense category (${topCatPct}% of spending).</div>
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
    
    html += `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:13px;margin-top:16px;">
      <thead><tr style="background:#f5f5f5;"><th>Date</th><th>Description</th><th>Amount</th></tr></thead>
      <tbody>`;
   allTransactions.forEach(row => {
      const color = row.amount < 0 ? "#c0392b" : "#27ae60";
      html += `<tr>
        <td>${row.date}</td>
        <td>${row.description}</td>
        <td style="color:${color};text-align:right;">${fmt(row.amount)}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
  } else {
    html += `<p>No transactions parsed. Raw preview:</p><pre>${previewRows.map(r => JSON.stringify(r)).join("\n")}</pre>`;
  }

  results.innerHTML = html;
}

// --- Column alias map: maps bank-specific header names to normalized keys ---
const COLUMN_ALIASES = {
  date:        ["datum", "date", "transaktionsdatum", "bookingdate", "booking date", "valuedate", "transaction date", "fecha"],
  description: ["beskrivning", "text", "description", "merchant", "payee", "name", "mottagare", "transaktion", "details", "memo", "reference"],
  amount:      ["belopp", "amount", "amount (sek)", "sum", "debit/credit", "transaktionsbelopp", "value", "importe"],
  balance:     ["saldo", "balance", "running balance", "saldo efter transaktion"]
};

function detectColumns(headerRow) {
  const cols = { date: -1, description: -1, amount: -1, balance: -1 };
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

  console.log("Transactions start at row index:", startIndex);
  console.log("Total rows in file:", rows.length);

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;
    const date        = String(row[cols.date]        ?? "").trim();
    const description = String(row[cols.description] ?? "").trim();
    const rawAmt      = String(row[cols.amount]      ?? "").trim();
    const amount      = parseAmount(rawAmt);
    const balance     = cols.balance !== -1 ? parseAmount(String(row[cols.balance] ?? "")) : null;
    if (!date && !description) continue;
    if (!/^\d{4}-\d{2}-\d{2}/.test(date)) continue;
 const merchant = normalizeMerchant(description);

transactions.push({
  date,
  description,
  merchant,
  amount,
  balance,
  rawAmount: rawAmt,
  category: detectCategory(merchant)
});
  }

  if (transactions.length > 0) {
    console.log("Date range:", transactions[transactions.length - 1].date, "->", transactions[0].date);
  }

  return transactions;
}

function parseAmount(value) {
  if (!value) return null;

  let cleaned = String(value).trim();

  cleaned = cleaned.replace(/\s/g, "");

  if (cleaned.includes(",") && cleaned.includes(".")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (cleaned.includes(",")) {
    cleaned = cleaned.replace(",", ".");
  }

  const num = Number(cleaned);
  return Number.isNaN(num) ? null : num;
}

function normalizeMerchant(description) {
  const text = description.toLowerCase();

  for (const merchant in MERCHANT_ALIASES) {
    for (const alias of MERCHANT_ALIASES[merchant]) {
      if (text.includes(alias)) {
        return merchant;
      }
    }
  }

  return text.trim();
}

function detectCategory(description) {
  const text = description.toLowerCase();

  for(const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)){

    for(const keyword of keywords){

      if(text.includes(keyword)){
        return category;
      }

    }

  }

  return "Other";
}

function detectSubscriptions(transactions){

  const groups = {};

  transactions.forEach(t => {
    if(t.amount >= 0) return;
    const key = t.merchant;
    if(!groups[key]) groups[key] = [];
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
  const expenses = transactions.filter(r => r.amount < 0);
  if (expenses.length === 0) return 0;
  const dates = expenses.map(r => new Date(r.date)).filter(d => !isNaN(d));
  if (dates.length < 2) return Math.abs(expenses.reduce((s, r) => s + r.amount, 0));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const days = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24));
  const total = Math.abs(expenses.reduce((s, r) => s + r.amount, 0));
  return (total / days) * 30;
}
