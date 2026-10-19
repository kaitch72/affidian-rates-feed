/* ==========================================================================
   Bundled snapshot of https://www.affidiancu.org/resources/tools/rates
   Used ONLY when the live page can't be reached and nothing is cached.
   Snapshot taken 2026-10-19 (site says "Rates effective as of March 1st, 2026").
   Same shape the live parser produces, so you can paste fresh values here.
   ========================================================================== */

window.RATES_FALLBACK = {
  effective: "March 1st, 2026",
  capturedAt: "2026-10-19T11:15:00-04:00",   // when this snapshot was taken
  tables: [
    {
      heading: "High-Yield Checking",
      headers: ["Balance", "Dividend Rate", "APY"],
      rows: [
        ["Up to $10,000.00", "2.47%", "2.50%"],
        ["Over $10,000.00", "0.50%", "2.50% to 0.68%"],
        ["Qualifications not met", "0.05%", "0.05%"]
      ]
    },
    {
      heading: "High-Yield Checking Tier II",
      headers: ["Balance", "Dividend Rate", "APY"],
      rows: [
        ["Up to $10,000.00", "3.92%", "4.00%"],
        ["Over $10,000.00", "0.50%", "4.00% to 0.82%"],
        ["Qualifications not met", "0.05%", "0.05%"]
      ]
    },
    {
      heading: "Other Accounts",
      headers: ["Type", "Features", "APY", "Dividend Rate"],
      rows: [
        ["Regular Savings", "Min. balance $100 to pay dividends", "0.05%", "0.050%"],
        ["Christmas Club Account", "Min. balance $100", "0.05%", "0.050%"],
        ["Business Savings", "Min. balance $100", "0.05%", "0.050%"],
        ["Small Business Savings", "Min. balance to pay dividends $100.00", "0.05%", "0.050%"],
        ["IRA Savings", "Min. balance $100", "0.10%", "0.100%"],
        ["Business Checking", "N/A", "N/A", "0.000%"],
        ["H.S.A. Checking", "Min. balance $100", "N/A", "0.000%"],
        ["Money Market 1st tier", "Min. balance $2,000", "1.50%", "1.499%"],
        ["Money Market 2nd tier", "Min. balance $25,000", "1.75%", "1.736%"],
        ["Money Market 3rd tier", "Min. balance $75,000", "2.00%", "1.981%"],
        ["Money Market 4th tier", "Min. balance $200,000", "2.25%", "2.2270%"],
        ["6 Month Share Certificate & IRA (add-on feature)", "Min. balance $100", "3.50%", "3.445%"],
        ["12 Month Share Certificate & IRA (add-on feature)", "Min. balance $100", "3.40%", "3.348%"],
        ["18 Month Share Certificate & IRA", "Min. balance $100", "3.15%", "3.105%"],
        ["Kids Piggy Bank CD (1 year add-on)", "Min. balance $25", "3.50%", "3.445%"],
        ["2 Year Share Certificate & IRA", "Min. balance $100", "3.20%", "3.154%"],
        ["3 Year Share Certificate & IRA", "Min. balance $100", "3.15%", "3.105%"],
        ["4 Year Share Certificate & IRA", "Min. balance $100", "3.35%", "3.299%"],
        ["5 Year Share Certificate & IRA", "Min. balance $100", "3.45%", "3.396%"],
        ["5 Month Promo Certificate (add-on feature)", "Min. balance $1,000", "3.80%", "3.74%"],
        ["9 Month Liberty CD (NEW MONEY)", "Min. balance $50,000", "4.25%", "4.169%"]
      ]
    },
    {
      heading: "Loans",
      headers: ["Type", "Features", "Terms & APR"],
      rows: [
        ["Auto Loans (2023 – 2027)", "New or Used Auto", "As Low as 4.50% (60 mo.); 5.00% (72 mo.)"],
        ["Auto Loans (2022 and older)", "Used Auto", "As Low as 5.00% (60 mo.)"],
        ["Signature Loans", "Personal", "As Low as 11.25%"],
        ["Boats, Off-Road, Jet Skis, ATV, Snowmobiles Loans", "Boats, Off-Road, Jet Skis, ATV, Snowmobile", "As Low as 9.00% (36, 48, 60 mo.); 9.50% (72 mo.)"],
        ["Motorcycle Loans (2023 - 2027)", "New or Used Motorcycle", "As Low as 5.99% (36, 48, 60 mo.); 6.49% (72 mo.)"],
        ["Motorcycle Loans (2022 and older)", "Used Motorcycle", "As Low as 5.99% (up to 36 mo.)"],
        ["Recreation Vehicles Loans", "RV", "As Low as 6.25% (60 mo.); 7.25% (84 mo.)"],
        ["1st Mortgages Loans", "Conventional Loans, multiple terms", "View Today's Rates"],
        ["Home Equity Line of Credit", "Multiple options", "As Low as 5.75%"],
        ["2nd Mortgages Loans", "2nd Mortgages", "As Low as 8.25%"],
        ["Classic Visa Card", "Classic Visa", "As Low as 18.00%"],
        ["Visa Signature Card", "Visa Signature with Rewards (1 point per dollar)", "Prime + 9%; current rate 16.00%"],
        ["Visa Platinum", "Visa Platinum without Rewards", "Prime + 3.50%; current rate 10.50%"],
        ["Visa Quantum Signature", "Visa Signature with Rewards (3 points per dollar)", "Purchase rate Prime + 8%; current rate 15.00%"],
        ["Student Loans", "Multiple options", "View Today's Rates"]
      ]
    }
  ]
};
