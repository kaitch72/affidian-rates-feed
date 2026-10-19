/* ==========================================================================
   Affidian Lobby Rates Feed — CONFIGURATION
   Everything you'd normally want to change lives in this file.
   ========================================================================== */

window.RATES_CONFIG = {

  /* ---- Data source -------------------------------------------------------
     The live rates page. Browsers block reading another website's HTML
     (CORS), so unless these files are hosted ON affidiancu.org you'll want
     to set proxyUrl to the Cloudflare Worker in /proxy (see README).
     If both fail, the app uses the last good copy it saved, then the
     bundled snapshot in js/rates-fallback.js — the screen never goes blank. */
  sourceUrl: "https://www.affidiancu.org/resources/tools/rates",
  proxyUrl: "",              // e.g. "https://affidian-rates.your-account.workers.dev/"
  refreshMinutes: 60,        // how often to re-pull rates while running

  /* ---- Display ---------------------------------------------------------- */
  timeZone: "America/Denver",   // "Last Refreshed" time zone (Colorado / Mountain Time)
  defaultCategory: "checking",  // shown if the URL has no #hash (or an unknown one)
  showBackArrow: false,         // true = show the "<" in the header (it only does history.back())
  showSourceStatus: false,      // true = tiny "live / cached / snapshot" tag (handy while testing)

  /* ---- Categories -------------------------------------------------------
     id        : used in the URL hash, e.g. index.html#savings
     color     : coffee | blue | gold | brown   (header + border colour)
     kind      : "deposit" (shows APY) or "loan" (shows APR)
     rows      : what appears, in order.
        { group: "Heading" }            -> a sub-heading row
        { label, match, table?, col? }  -> a rate row
           label : text shown on screen
           match : start of the "Type" text on the website (case/punctuation ignored)
           table : (optional) heading of the website table to look in
           col   : (optional) column to read. Defaults: deposit = APY, loan = Terms & APR
           features: true -> show the website's "Features" text under the label */
  categories: [
    {
      id: "checking", title: "Checking", color: "coffee", kind: "deposit",
      rows: [
        { group: "High-Yield Checking Tier I" },
        { label: "On balances up to $10,000.00",       table: "High-Yield Checking",         match: "Up to $10,000" },
        { label: "On portion of balance over $10,000.00", table: "High-Yield Checking",      match: "Over $10,000" },
        { label: "When qualifications are not met",    table: "High-Yield Checking",         match: "Qualifications not met" },
        { group: "High-Yield Checking Tier II" },
        { label: "On balances up to $10,000.00",       table: "High-Yield Checking Tier II", match: "Up to $10,000" },
        { label: "On portion of balance over $10,000.00", table: "High-Yield Checking Tier II", match: "Over $10,000" },
        { label: "When qualifications are not met",    table: "High-Yield Checking Tier II", match: "Qualifications not met" }
      ]
    },
    {
      id: "savings", title: "Savings Accounts", color: "blue", kind: "deposit",
      rows: [
        { label: "Regular Savings",        match: "Regular Savings" },
        { label: "Christmas Club Account", match: "Christmas Club" },
        { label: "Business Savings",       match: "Business Savings" },
        { label: "Small Business Savings", match: "Small Business Savings" },
        { label: "IRA Savings",            match: "IRA Savings" }
      ]
    },
    {
      id: "money-market", title: "Money Market Accounts", color: "gold", kind: "deposit",
      rows: [
        { label: "Money Market 1st Tier", match: "Money Market 1st", features: true },
        { label: "Money Market 2nd Tier", match: "Money Market 2nd", features: true },
        { label: "Money Market 3rd Tier", match: "Money Market 3rd", features: true },
        { label: "Money Market 4th Tier", match: "Money Market 4th", features: true }
      ]
    },
    {
      id: "certificates", title: "Certificates", color: "brown", kind: "deposit",
      rows: [
        { label: "5 Month Promo Certificate (add-on feature)",      match: "5 Month Promo",            features: true },
        { label: "6 Month Share Certificate & IRA (add-on feature)", match: "6 Month Share Certificate", features: true },
        { label: "9 Month Liberty CD (New Money)",                   match: "9 Month Liberty",          features: true },
        { label: "12 Month Share Certificate & IRA (add-on feature)",match: "12 Month Share Certificate",features: true },
        { label: "Kids Piggy Bank CD (1 year add-on)",               match: "Kids Piggy Bank",          features: true },
        { label: "18 Month Share Certificate & IRA",                 match: "18 Month Share Certificate",features: true },
        { label: "2 Year Share Certificate & IRA",                   match: "2 Year Share Certificate", features: true },
        { label: "3 Year Share Certificate & IRA",                   match: "3 Year Share Certificate", features: true },
        { label: "4 Year Share Certificate & IRA",                   match: "4 Year Share Certificate", features: true },
        { label: "5 Year Share Certificate & IRA",                   match: "5 Year Share Certificate", features: true }
      ]
    },
    {
      id: "credit-cards", title: "Credit Cards", color: "coffee", kind: "loan",
      rows: [
        { label: "Classic Visa Card",      match: "Classic Visa" },
        { label: "Visa Signature Card",    match: "Visa Signature Card", features: true },
        { label: "Visa Platinum",          match: "Visa Platinum",       features: true },
        { label: "Visa Quantum Signature", match: "Visa Quantum",        features: true }
      ]
    },
    {
      id: "vehicle-loans", title: "Vehicle Loans", color: "blue", kind: "loan",
      rows: [
        { label: "Auto Loans (2023 – 2027)",                    match: "Auto Loans (2023" },
        { label: "Auto Loans (2022 and older)",                 match: "Auto Loans (2022" },
        { label: "Boats, Off-Road, Jet Skis, ATV, Snowmobiles", match: "Boats" },
        { label: "Motorcycle Loans (2023 – 2027)",              match: "Motorcycle Loans (2023" },
        { label: "Motorcycle Loans (2022 and older)",           match: "Motorcycle Loans (2022" },
        { label: "Recreation Vehicle Loans",                    match: "Recreation Vehicle" }
      ]
    },
    {
      id: "home-loans", title: "Home Loans", color: "gold", kind: "loan",
      rows: [
        { label: "1st Mortgage Loans",        match: "1st Mortgage" },
        { label: "Home Equity Line of Credit", match: "Home Equity" },
        { label: "2nd Mortgage Loans",        match: "2nd Mortgage" }
      ]
    },
    {
      id: "personal-loans", title: "Personal Loans", color: "brown", kind: "loan",
      rows: [
        { label: "Signature Loans", match: "Signature Loans" },
        { label: "Student Loans",   match: "Student Loans" }
      ]
    }
  ]
};
