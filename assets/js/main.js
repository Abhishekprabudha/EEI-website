// assets/js/main.js
// EEI global JS – calculators & small interactions live here.

console.log("EEI main.js loaded");

// ------------ Utility: INR currency formatter -----------------
const eeiRupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

// ------------ EV Franchisee Calculator ------------------------
function eeiCalculateFranchiseReturns() {
  const costInput = document.getElementById("vehicleCost");
  const loanRateInput = document.getElementById("loanRate");
  const topupRateInput = document.getElementById("topupRate");
  const taxRateInput = document.getElementById("taxRate");
  const salvageRateInput = document.getElementById("salvageRate");
  const yearsInput = document.getElementById("years");
  const resultEl = document.getElementById("franchiseResult");

  if (!costInput || !resultEl) {
    // Not on the franchisee page; nothing to do
    return;
  }

  const cost = parseFloat(costInput.value) || 0;
  const loanRate = (parseFloat(loanRateInput.value) || 0) / 100;
  const topupRate = (parseFloat(topupRateInput.value) || 0) / 100;
  const taxRate = (parseFloat(taxRateInput.value) || 0) / 100;
  const salvageRate = (parseFloat(salvageRateInput.value) || 0) / 100;
  const years = parseInt(yearsInput.value, 10) || 0;

  if (cost <= 0 || years <= 0) {
    resultEl.textContent = "Please enter a valid vehicle cost and period.";
    return;
  }

  // Annual benefits
  const annualInterestFromEEI = cost * loanRate;
  const annualTopupFromEEI = cost * loanRate * topupRate;
  const annualTaxBenefit = cost * taxRate;

  const totalBenefits = (annualInterestFromEEI + annualTopupFromEEI + annualTaxBenefit) * years;
  const salvageValue = cost * salvageRate;

  const totalCashIn = totalBenefits + salvageValue;
  const netProfit = totalCashIn - cost;
  const roiPercent = (netProfit / cost) * 100;
  const effectiveAnnualReturn = (Math.pow(totalCashIn / cost, 1 / years) - 1) * 100;

  resultEl.innerHTML = `
    <h3>Illustrative Results</h3>
    <p>Total benefits from EEI (interest + top-up + tax) over ${years} years:
       <strong>${eeiRupeeFormatter.format(totalBenefits)}</strong></p>
    <p>Estimated salvage value at end of term:
       <strong>${eeiRupeeFormatter.format(salvageValue)}</strong></p>
    <p>Total value received compared to your initial cost:
       <strong>${eeiRupeeFormatter.format(totalCashIn)}</strong></p>
    <p>Net profit over term:
       <strong>${eeiRupeeFormatter.format(netProfit)}</strong></p>
    <p>ROI over term:
       <strong>${roiPercent.toFixed(1)}%</strong></p>
    <p>Effective annualised return:
       <strong>${effectiveAnnualReturn.toFixed(1)}% p.a.</strong></p>
    <small>
      Note: This is a simplified illustration. Actual returns depend on utilisation,
      downtime, exact loan structure and your tax situation.
    </small>
  `;
}

// ------------ Investor 18% vs 6% Calculator -------------------
function eeiCalculateInvestorReturns() {
  const principalInput = document.getElementById("invPrincipal");
  const highRateInput = document.getElementById("invHighRate");
  const safeRateInput = document.getElementById("invSafeRate");
  const yearsInput = document.getElementById("invYears");
  const resultEl = document.getElementById("investorResult");

  if (!principalInput || !resultEl) {
    // Not on investors page
    return;
  }

  const principal = parseFloat(principalInput.value) || 0;
  const highRate = (parseFloat(highRateInput.value) || 0) / 100;
  const safeRate = (parseFloat(safeRateInput.value) || 0) / 100;
  const years = parseInt(yearsInput.value, 10) || 0;

  if (principal <= 0 || years <= 0) {
    resultEl.textContent = "Please enter a valid principal amount and period.";
    return;
  }

  const highFuture = principal * Math.pow(1 + highRate, years);
  const safeFuture = principal * Math.pow(1 + safeRate, years);
  const difference = highFuture - safeFuture;

  resultEl.innerHTML = `
    <h3>Illustrative Outcome After ${years} Years</h3>
    <p>Illustrative EEI investment at ${(highRate * 100).toFixed(1)}% p.a.:
       <strong>${eeiRupeeFormatter.format(highFuture)}</strong></p>
    <p>Traditional safe deposit at ${(safeRate * 100).toFixed(1)}% p.a.:
       <strong>${eeiRupeeFormatter.format(safeFuture)}</strong></p>
    <p>Additional wealth created with the higher compounding rate:
       <strong>${eeiRupeeFormatter.format(difference)}</strong></p>
    <small>
      This comparison assumes annual compounding and no withdrawals. It is for
      illustration only and not a guarantee, offer or forecast of actual returns.
    </small>
  `;
}

// ------------ DOM wiring --------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Franchisee calculator form
  const franchiseForm = document.getElementById("franchiseForm");
  if (franchiseForm) {
    franchiseForm.addEventListener("submit", (event) => {
      event.preventDefault();
      eeiCalculateFranchiseReturns();
    });
  }

  // Investor calculator form
  const investorForm = document.getElementById("investorForm");
  if (investorForm) {
    investorForm.addEventListener("submit", (event) => {
      event.preventDefault();
      eeiCalculateInvestorReturns();
    });
  }
});
