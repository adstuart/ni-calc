// National Insurance Calculator - 2025/2026 Tax Year

// Constants for NI calculations (monthly thresholds)
const NI_CONSTANTS = {
    LOWER_THRESHOLD_MONTHLY: 1048.67,  // £242/week × 52/12
    UPPER_THRESHOLD_MONTHLY: 4189.33,  // £967/week × 52/12
    RATE_STANDARD: 0.08,               // 8% between thresholds
    RATE_UPPER: 0.02,                  // 2% above upper threshold
    MONTHS_IN_YEAR: 12
};

// Month names for display
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// State
let calculationResults = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupInputFormatting();
});

// Event Listeners
function initializeEventListeners() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const distributionStrategy = document.getElementById('distributionStrategy');
    const monthPercentages = document.querySelectorAll('.month-percentage');

    calculateBtn.addEventListener('click', handleCalculate);
    resetBtn.addEventListener('click', handleReset);
    distributionStrategy.addEventListener('change', handleStrategyChange);

    // Monitor custom distribution changes
    monthPercentages.forEach(input => {
        input.addEventListener('input', updateTotalPercentage);
    });

    // Setup expand buttons for breakdowns
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const target = document.getElementById(targetId);
            if (target.style.display === 'none') {
                target.style.display = 'block';
                this.textContent = 'Hide Monthly Breakdown';
            } else {
                target.style.display = 'none';
                this.textContent = 'View Monthly Breakdown';
            }
        });
    });
}

// Input Formatting
function setupInputFormatting() {
    const salaryInput = document.getElementById('annualSalary');
    const pensionInput = document.getElementById('totalPension');

    [salaryInput, pensionInput].forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove all non-digit characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Format with commas
            if (value) {
                value = parseInt(value).toLocaleString('en-GB');
            }
            
            e.target.value = value;
        });
    });
}

// Handle distribution strategy change
function handleStrategyChange(e) {
    const strategy = e.target.value;
    const customDistribution = document.getElementById('customDistribution');
    const monthInputs = document.querySelectorAll('.month-percentage');

    if (strategy === 'custom') {
        customDistribution.style.display = 'block';
    } else {
        customDistribution.style.display = 'none';
        
        // Set predefined distribution
        if (strategy === 'equal') {
            setEqualDistribution();
        } else if (strategy === 'frontloaded') {
            setFrontloadedDistribution();
        } else if (strategy === 'h1frontloaded') {
            setH1FrontloadedDistribution();
        } else if (strategy === 'quarterly') {
            setQuarterlyDistribution();
        } else if (strategy === 'backloaded') {
            setBackloadedDistribution();
        } else if (strategy === 'twomonth') {
            setTwoMonthBurstDistribution();
        }
    }
}

// Set equal distribution
function setEqualDistribution() {
    const monthInputs = document.querySelectorAll('.month-percentage');
    monthInputs.forEach((input, index) => {
        if (index === 11) {
            input.value = '8.34'; // Last month gets the rounding difference
        } else {
            input.value = '8.33';
        }
    });
    updateTotalPercentage();
}

// Set front-loaded distribution (Q1 heavy)
function setFrontloadedDistribution() {
    const monthInputs = document.querySelectorAll('.month-percentage');
    // Front-load: 33.33% each for Jan, Feb, Mar (Q1), 0% for the rest
    const frontLoadDistribution = [33.33, 33.33, 33.34, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    monthInputs.forEach((input, index) => {
        input.value = frontLoadDistribution[index].toFixed(2);
    });
    updateTotalPercentage();
}

// Set H1 front-loaded distribution (first 6 months)
function setH1FrontloadedDistribution() {
    const monthInputs = document.querySelectorAll('.month-percentage');
    // H1 Front-load: 16.67% each for Jan-Jun, 0% for Jul-Dec
    const h1FrontLoadDistribution = [16.67, 16.67, 16.67, 16.67, 16.67, 16.65, 0, 0, 0, 0, 0, 0];
    monthInputs.forEach((input, index) => {
        input.value = h1FrontLoadDistribution[index].toFixed(2);
    });
    updateTotalPercentage();
}

// Set quarterly distribution (start of each quarter)
function setQuarterlyDistribution() {
    const monthInputs = document.querySelectorAll('.month-percentage');
    // Quarterly: 25% at start of each quarter (Jan, Apr, Jul, Oct)
    const quarterlyDistribution = [25, 0, 0, 25, 0, 0, 25, 0, 0, 25, 0, 0];
    monthInputs.forEach((input, index) => {
        input.value = quarterlyDistribution[index].toFixed(2);
    });
    updateTotalPercentage();
}

// Set back-loaded distribution (Q4 heavy)
function setBackloadedDistribution() {
    const monthInputs = document.querySelectorAll('.month-percentage');
    // Back-loaded: 33.33% each for Oct, Nov, Dec (Q4), 0% for the rest
    const backLoadDistribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 33.33, 33.33, 33.34];
    monthInputs.forEach((input, index) => {
        input.value = backLoadDistribution[index].toFixed(2);
    });
    updateTotalPercentage();
}

// Set two-month burst distribution (Jan & Feb only)
function setTwoMonthBurstDistribution() {
    const monthInputs = document.querySelectorAll('.month-percentage');
    // Two-month burst: 50% each for Jan and Feb, 0% for the rest
    const twoMonthBurstDistribution = [50, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    monthInputs.forEach((input, index) => {
        input.value = twoMonthBurstDistribution[index].toFixed(2);
    });
    updateTotalPercentage();
}

// Update total percentage display
function updateTotalPercentage() {
    const monthInputs = document.querySelectorAll('.month-percentage');
    let total = 0;
    
    monthInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });
    
    const totalElement = document.getElementById('totalPercentage');
    const warningElement = document.getElementById('percentageWarning');
    
    totalElement.textContent = total.toFixed(2);
    
    // Show warning if not equal to 100
    if (Math.abs(total - 100) > 0.01) {
        warningElement.style.display = 'inline';
        totalElement.style.color = 'var(--danger-color)';
    } else {
        warningElement.style.display = 'none';
        totalElement.style.color = 'var(--text-primary)';
    }
}

// Parse input value (remove commas)
function parseInputValue(value) {
    return parseFloat(value.replace(/,/g, '')) || 0;
}

// Format currency
function formatCurrency(amount) {
    return '£' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Validate that pension distribution doesn't create negative NI-able pay
function validateNegativeNI(annualSalary, totalPension, pensionDistributionPercentages) {
    const monthlySalary = annualSalary / NI_CONSTANTS.MONTHS_IN_YEAR;
    const negativeMonths = [];
    
    for (let month = 0; month < NI_CONSTANTS.MONTHS_IN_YEAR; month++) {
        const monthlyPension = (totalPension * pensionDistributionPercentages[month]) / 100;
        const niableIncome = monthlySalary - monthlyPension;
        
        if (niableIncome < 0) {
            negativeMonths.push({
                month: MONTH_NAMES[month],
                monthlyPension: monthlyPension,
                monthlySalary: monthlySalary,
                deficit: Math.abs(niableIncome)
            });
        }
    }
    
    return negativeMonths;
}

// Calculate NI for a single month
function calculateMonthlyNI(niableIncome) {
    let ni = 0;
    
    if (niableIncome <= NI_CONSTANTS.LOWER_THRESHOLD_MONTHLY) {
        // Below lower threshold - no NI
        ni = 0;
    } else if (niableIncome <= NI_CONSTANTS.UPPER_THRESHOLD_MONTHLY) {
        // Between lower and upper threshold - 8%
        ni = (niableIncome - NI_CONSTANTS.LOWER_THRESHOLD_MONTHLY) * NI_CONSTANTS.RATE_STANDARD;
    } else {
        // Above upper threshold - 8% up to upper, then 2% above
        const standardBand = (NI_CONSTANTS.UPPER_THRESHOLD_MONTHLY - NI_CONSTANTS.LOWER_THRESHOLD_MONTHLY) * NI_CONSTANTS.RATE_STANDARD;
        const upperBand = (niableIncome - NI_CONSTANTS.UPPER_THRESHOLD_MONTHLY) * NI_CONSTANTS.RATE_UPPER;
        ni = standardBand + upperBand;
    }
    
    return Math.round(ni * 100) / 100; // Round to nearest penny
}

// Get pension distribution percentages
function getPensionDistribution() {
    const strategy = document.getElementById('distributionStrategy').value;
    
    // For predefined strategies, return the distribution directly
    if (strategy === 'equal') {
        return Array(12).fill(100 / 12);
    } else if (strategy === 'frontloaded') {
        return [33.33, 33.33, 33.34, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    } else if (strategy === 'h1frontloaded') {
        return [16.67, 16.67, 16.67, 16.67, 16.67, 16.65, 0, 0, 0, 0, 0, 0];
    } else if (strategy === 'quarterly') {
        return [25, 0, 0, 25, 0, 0, 25, 0, 0, 25, 0, 0];
    } else if (strategy === 'backloaded') {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 33.33, 33.33, 33.34];
    } else if (strategy === 'twomonth') {
        return [50, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    
    // For custom strategy, read from inputs
    const monthInputs = document.querySelectorAll('.month-percentage');
    const percentages = Array.from(monthInputs).map(input => parseFloat(input.value) || 0);
    
    // Validate total equals 100%
    const total = percentages.reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 100) > 0.01) {
        throw new Error('Pension distribution percentages must total 100%');
    }
    
    return percentages;
}

// Calculate annual NI with given pension distribution
function calculateAnnualNI(annualSalary, totalPension, pensionDistributionPercentages) {
    const monthlySalary = annualSalary / NI_CONSTANTS.MONTHS_IN_YEAR;
    const monthlyBreakdown = [];
    let totalAnnualNI = 0;
    
    for (let month = 0; month < NI_CONSTANTS.MONTHS_IN_YEAR; month++) {
        const monthlyPension = (totalPension * pensionDistributionPercentages[month]) / 100;
        const niableIncome = monthlySalary - monthlyPension;
        const monthlyNI = calculateMonthlyNI(niableIncome);
        
        totalAnnualNI += monthlyNI;
        
        monthlyBreakdown.push({
            month: MONTH_NAMES[month],
            grossPay: monthlySalary,
            pension: monthlyPension,
            niableIncome: niableIncome,
            ni: monthlyNI
        });
    }
    
    return {
        totalNI: Math.round(totalAnnualNI * 100) / 100,
        monthlyBreakdown: monthlyBreakdown
    };
}

// Handle calculate button click
function handleCalculate() {
    const calculateBtn = document.getElementById('calculateBtn');
    
    try {
        // Get inputs
        const annualSalary = parseInputValue(document.getElementById('annualSalary').value);
        const totalPension = parseInputValue(document.getElementById('totalPension').value);
        
        // Validate inputs
        if (!annualSalary || annualSalary <= 0) {
            alert('Please enter a valid annual salary');
            return;
        }
        
        if (totalPension < 0) {
            alert('Pension contribution cannot be negative');
            return;
        }
        
        if (totalPension > annualSalary) {
            alert('Pension contribution cannot exceed annual salary');
            return;
        }
        
        // Show loading state
        calculateBtn.classList.add('loading');
        calculateBtn.disabled = true;
        
        // Get distribution
        const distribution = getPensionDistribution();
        
        // Validate that no month has negative NI-able pay
        const negativeMonths = validateNegativeNI(annualSalary, totalPension, distribution);
        if (negativeMonths.length > 0) {
            let errorMessage = 'Error: The following month(s) would have negative NI-able income:\n\n';
            negativeMonths.forEach(m => {
                errorMessage += `${m.month}: Pension contribution ${formatCurrency(m.monthlyPension)} exceeds monthly salary ${formatCurrency(m.monthlySalary)} by ${formatCurrency(m.deficit)}\n`;
            });
            errorMessage += '\nPlease adjust your distribution strategy to ensure no single month\'s pension contribution exceeds the monthly salary.';
            alert(errorMessage);
            calculateBtn.classList.remove('loading');
            calculateBtn.disabled = false;
            return;
        }
        
        // Calculate baseline (equal distribution)
        const equalDistribution = Array(12).fill(100 / 12);
        const baselineResults = calculateAnnualNI(annualSalary, totalPension, equalDistribution);
        
        // Calculate optimized (custom distribution)
        const optimizedResults = calculateAnnualNI(annualSalary, totalPension, distribution);
        
        // Calculate savings
        const savings = baselineResults.totalNI - optimizedResults.totalNI;
        const savingsPercentage = baselineResults.totalNI > 0 
            ? (savings / baselineResults.totalNI * 100).toFixed(2)
            : 0;
        
        // Store results
        calculationResults = {
            baseline: baselineResults,
            optimized: optimizedResults,
            savings: savings,
            savingsPercentage: savingsPercentage
        };
        
        // Display results
        displayResults();
        
        // Remove loading state
        calculateBtn.classList.remove('loading');
        calculateBtn.disabled = false;
        
    } catch (error) {
        alert(error.message);
        calculateBtn.classList.remove('loading');
        calculateBtn.disabled = false;
    }
}

// Display results
function displayResults() {
    const resultsSection = document.getElementById('resultsSection');
    const strategy = document.getElementById('distributionStrategy').value;
    
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Update baseline
    document.getElementById('baselineNI').textContent = formatCurrency(calculationResults.baseline.totalNI);
    displayBreakdown('baselineBreakdownBody', calculationResults.baseline.monthlyBreakdown);
    
    // Update optimized
    document.getElementById('optimizedNI').textContent = formatCurrency(calculationResults.optimized.totalNI);
    displayBreakdown('optimizedBreakdownBody', calculationResults.optimized.monthlyBreakdown);
    
    // Update description based on strategy
    let strategyDescription = 'Your custom pension distribution';
    if (strategy === 'equal') {
        strategyDescription = 'Equal monthly pension contributions (same as baseline)';
    } else if (strategy === 'frontloaded') {
        strategyDescription = 'Front-loaded pension contributions (Q1 heavy)';
    } else if (strategy === 'h1frontloaded') {
        strategyDescription = 'H1 front-loaded pension contributions (first 6 months)';
    } else if (strategy === 'quarterly') {
        strategyDescription = 'Quarterly pension contributions (start of each quarter)';
    } else if (strategy === 'backloaded') {
        strategyDescription = 'Back-loaded pension contributions (Q4 heavy)';
    } else if (strategy === 'twomonth') {
        strategyDescription = 'Two-month burst pension contributions (Jan & Feb only)';
    }
    document.getElementById('optimizedDescription').textContent = strategyDescription;
    
    // Update savings
    const savingsCard = document.querySelector('.savings-card');
    const savingsAmount = document.getElementById('savingsAmount');
    const savingsPercentage = document.getElementById('savingsPercentage');
    const savingsMessage = document.getElementById('savingsMessage');
    
    savingsAmount.textContent = formatCurrency(Math.abs(calculationResults.savings));
    savingsPercentage.textContent = Math.abs(calculationResults.savingsPercentage) + '%';
    
    // Update styling and message based on savings
    savingsCard.classList.remove('no-savings', 'negative-savings');
    
    if (calculationResults.savings > 0.01) {
        savingsMessage.textContent = `🎉 Great! By adjusting your pension distribution, you can save ${formatCurrency(calculationResults.savings)} in National Insurance contributions annually.`;
    } else if (calculationResults.savings < -0.01) {
        savingsCard.classList.add('negative-savings');
        savingsMessage.textContent = `This distribution would actually cost you ${formatCurrency(Math.abs(calculationResults.savings))} more in NI. Consider front-loading contributions instead.`;
    } else {
        savingsCard.classList.add('no-savings');
        savingsMessage.textContent = 'This distribution results in the same NI as equal monthly contributions. Consider front-loading to maximize savings.';
    }
}

// Display monthly breakdown
function displayBreakdown(tableBodyId, breakdown) {
    const tbody = document.getElementById(tableBodyId);
    tbody.innerHTML = '';
    
    breakdown.forEach(month => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${month.month}</td>
            <td>${formatCurrency(month.grossPay)}</td>
            <td>${formatCurrency(month.pension)}</td>
            <td>${formatCurrency(month.niableIncome)}</td>
            <td>${formatCurrency(month.ni)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Handle reset
function handleReset() {
    // Clear inputs
    document.getElementById('annualSalary').value = '';
    document.getElementById('totalPension').value = '';
    document.getElementById('distributionStrategy').value = 'equal';
    
    // Reset distribution
    setEqualDistribution();
    
    // Hide custom distribution
    document.getElementById('customDistribution').style.display = 'none';
    
    // Hide results
    document.getElementById('resultsSection').style.display = 'none';
    
    // Reset calculation results
    calculationResults = null;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
