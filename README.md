# UK National Insurance Calculator

A modern, interactive web calculator for optimizing UK National Insurance contributions through strategic pension contribution timing.

## Overview

This calculator helps UK taxpayers understand how the timing of salary sacrifice pension contributions can affect their total National Insurance (NI) contributions. By concentrating pension contributions in months where you'd pay the higher 8% NI rate, you can potentially maximize your NI savings.

## Features

- **Modern, Responsive Design**: Clean and professional UI that works on all devices
- **2025-2026 Tax Year Rates**: Up-to-date NI bands and thresholds
- **Multiple Distribution Strategies**:
  - Equal monthly distribution (baseline)
  - Front-loaded distribution (Q1 heavy for maximum savings)
  - Custom month-by-month distribution
- **Detailed Breakdowns**: Monthly calculation breakdowns showing how NI is calculated
- **Real-time Comparison**: See exactly how much you can save by optimizing your pension timing
- **Interactive Tooltips**: Helpful explanations throughout the interface

## How It Works

The calculator performs monthly NI calculations because NI thresholds apply per pay period:

### NI Bands (2025-2026)

| Weekly | Monthly | Annual | Rate |
|--------|---------|--------|------|
| Below £242 | Below £1,048.67 | Below £12,584 | 0% |
| £242 - £967 | £1,048.67 - £4,189.33 | £12,584 - £50,284 | 8% |
| Above £967 | Above £4,189.33 | Above £50,284 | 2% |

### The Strategy

Salary sacrifice pension contributions reduce your NI-able earnings. If your salary puts you in the higher 8% NI band, front-loading pension contributions to earlier months can reduce your NI-able income below the threshold in those months, while still allowing you to pay the lower 2% rate on higher earnings in months without pension contributions.

## Usage

1. Enter your annual salary
2. Enter your total annual pension contribution amount
3. Choose a distribution strategy or create a custom one
4. Click "Calculate NI" to see your results
5. Compare baseline vs. optimized distributions and see your potential savings

## Hosting

This site is designed for GitHub Pages deployment:
- Pure HTML/CSS/JavaScript (no build step required)
- Simply enable GitHub Pages in repository settings
- Point to the root directory or use the `index.html` file

## Disclaimer

This calculator is for illustration purposes only. The calculations are estimates and should not be considered financial or tax advice. Please consult HMRC or a qualified financial advisor for official guidance on National Insurance contributions.

## Technical Stack

- Pure HTML5
- CSS3 with modern features (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- No external dependencies

## License

This project is open source and available for personal and educational use.
