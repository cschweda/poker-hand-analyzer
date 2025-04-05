import "./style.css";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// Initialize Prism
document.addEventListener("DOMContentLoaded", () => {
  Prism.highlightAll();
});

// --- Poker Analyzer Code ---
const hands = [
  "4 of a Kind",
  "Straight Flush",
  "Straight",
  "Flush",
  "High Card",
  "1 Pair",
  "2 Pair",
  "Royal Flush",
  "3 of a Kind",
  "Full House",
];

const A = 14,
  K = 13,
  Q = 12,
  J = 11,
  T = 10;
const cardRanks = [2, 3, 4, 5, 6, 7, 8, 9, T, J, Q, K, A];
const rankMap = {
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "T",
  11: "J",
  12: "Q",
  13: "K",
  14: "A",
};

const suits = { "♠": 1, "♣": 2, "♥": 4, "♦": 8 };
const suitSymbols = { 1: "♠", 2: "♣", 4: "♥", 8: "♦" };
const suitColors = { 1: "black", 2: "black", 4: "red", 8: "red" };

// Helper function to format binary with highlighting - THIS IS THE SINGLE FUNCTION TO USE EVERYWHERE
function formatBinary(number, length = 32) {
  const binary = BigInt(number).toString(2).padStart(length, "0");
  let result = "";

  // Process each bit adding nibble groups with clear spacing
  for (let nibbleIndex = 0; nibbleIndex < binary.length / 4; nibbleIndex++) {
    // Add very clear spacing between nibbles (except first)
    if (nibbleIndex > 0) {
      result +=
        '<span style="display:inline-block; margin:0 3px; color:#6B7280; font-weight:bold">|</span>';
    }

    // Process each bit in the nibble
    for (let bitIndex = 0; bitIndex < 4; bitIndex++) {
      const i = nibbleIndex * 4 + bitIndex;
      if (i >= binary.length) break;

      const bit = binary[i];
      const position = binary.length - 1 - i; // Position from right to left
      const isSetBit = bit === "1";

      // Format the bit with appropriate highlighting
      if (isSetBit) {
        // For suit bits (positions 0-3), use amber
        if (position <= 3) {
          result += `<span class="text-amber-400 bg-amber-900/30 px-0">${bit}</span>`;
        } else {
          // For rank bits (positions 4+), use emerald
          result += `<span class="text-emerald-400 bg-emerald-900/30 px-0">${bit}</span>`;
        }
      } else {
        // Unset bits are green
        result += `<span class="text-green-400">${bit}</span>`;
      }
    }
  }

  return result;
}

// Compatibility wrapper for any existing code that might call formatBinaryWithHighlight
function formatBinaryWithHighlight(
  number,
  length = 32,
  highlightPositions = []
) {
  // Simply delegate to our unified function
  return formatBinary(number, length);
}

// Function to generate bit reference tables
function generateBitReferenceTables() {
  console.log("Generating bit reference tables...");

  // First, find or create the tab container
  let tabContainer = document.querySelector(".tab-container");
  if (!tabContainer) {
    tabContainer = document.createElement("div");
    tabContainer.className = "tab-container";
    const contentSection = document.querySelector(".content-section");
    if (contentSection) {
      contentSection.appendChild(tabContainer);
    } else {
      console.warn("No content section found to add tab container");
      return;
    }
  }

  // Add explanation div BEFORE the tabs
  const explanationDiv = document.createElement("div");
  explanationDiv.className = "mb-6 p-4 bg-gray-900 rounded-lg text-gray-300";
  explanationDiv.innerHTML = `
    <p class="mb-2"><strong>Understanding the 32-bit Binary Representation:</strong></p>
    <ul class="list-disc pl-6 space-y-2">
      <li>The full 32-bit number is divided into 8 groups of 4 bits (called <span class="tech-term"><strong>nibbles</strong><span class="tooltip"><span class="tooltip-title">Nibble</span><span class="tooltip-content">A group of 4 bits, representing half a byte. In computing, nibbles are often used for compact representation of small values from 0-15.</span></span></span>) for readability, with spaces between each nibble.</li>
      <li>Each card's <strong class="text-emerald-400">rank</strong> sets a single bit in positions 2-14:
        <ul class="list-none mt-2 space-y-1 font-mono">
          <li>• When a bit is <span class="tech-term">set<span class="tooltip"><span class="tooltip-title">Set Bit</span><span class="tooltip-content">When a bit has a value of 1 rather than 0. In this analyzer, a set bit represents the presence of a specific rank or suit.</span></span></span> (1), it's shown with <span class="text-emerald-400 bg-emerald-900/30 px-1">emerald shading</span></li>
          <li>• Example: Ace sets bit 14, King sets bit 13, etc.</li>
          <li>• Only one rank bit is set per card</li>
        </ul>
      </li>
      <li>Each card's <strong class="text-amber-400">suit</strong> is encoded in the rightmost nibble (bits 0-3):
        <ul class="list-none mt-2 space-y-1 font-mono">
          <li>• When a bit is set (1), it's shown with <span class="text-amber-400 bg-amber-900/30 px-1">amber shading</span></li>
          <li>• Bit 0: Spades (♠)</li>
          <li>• Bit 1: Clubs (♣)</li>
          <li>• Bit 2: Hearts (♥)</li>
          <li>• Bit 3: Diamonds (♦)</li>
          <li>• Only one suit bit is set per card</li>
        </ul>
      </li>
      <li>
        <span class="mb-2">Reading the 32-bit number:</span>
        <ul class="list-none mt-2 space-y-1 font-mono">
          <li>• Full format: <code>0000 0000 0000 0000 0000 0000 0000 0000</code></li>
          <li>• <span class="tech-term">Most significant bits<span class="tooltip"><span class="tooltip-title">Most Significant Bits (MSB)</span><span class="tooltip-content">The leftmost bits in a binary number that carry the highest values. In this analyzer, these bits represent high card ranks.</span></span></span> (MSB) are on the left</li>
          <li>• <span class="tech-term">Least significant bits<span class="tooltip"><span class="tooltip-title">Least Significant Bits (LSB)</span><span class="tooltip-content">The rightmost bits in a binary number that carry the lowest values. In this analyzer, these bits represent suits and low card ranks.</span></span></span> (LSB) are on the right</li>
          <li>• Bit positions increase right-to-left (0-31)</li>
          <li class="mt-4">• <span class="text-emerald-400 bg-emerald-900/30 px-1">Emerald shading</span> = Set rank bit (single bit in positions 2-14)</li>
          <li>• <span class="text-amber-400 bg-amber-900/30 px-1">Amber shading</span> = Set suit bit (single bit in positions 0-3)</li>
        </ul>
      </li>
    </ul>
  `;
  tabContainer.appendChild(explanationDiv);

  // Create tab navigation
  const tabNav = document.createElement("div");
  tabNav.className = "tab-nav";
  tabContainer.appendChild(tabNav);

  const suitConfigs = {
    spades: { symbol: "♠", id: "spades", isRed: false, bitValue: 1 },
    clubs: { symbol: "♣", id: "clubs", isRed: false, bitValue: 2 },
    hearts: { symbol: "♥", id: "hearts", isRed: true, bitValue: 4 },
    diamonds: { symbol: "♦", id: "diamonds", isRed: true, bitValue: 8 },
  };

  // Create tab buttons
  Object.entries(suitConfigs).forEach(([suit, config], tabIndex) => {
    const tabButton = document.createElement("button");
    tabButton.id = `tab-${config.id}`;
    tabButton.className = `tab-btn ${config.isRed ? "text-red-500" : ""}`;
    tabButton.setAttribute("role", "tab");
    tabButton.setAttribute("aria-controls", config.id);
    tabButton.setAttribute("aria-selected", "false");
    tabButton.innerHTML = `${config.symbol} ${
      suit.charAt(0).toUpperCase() + suit.slice(1)
    }`;
    tabNav.appendChild(tabButton);
  });

  // Create tables for each suit
  Object.entries(suitConfigs).forEach(([suit, config], tabIndex) => {
    console.log(`Generating table for ${suit}...`);

    // Create table container if it doesn't exist
    let tableContainer = document.getElementById(config.id);
    if (!tableContainer) {
      tableContainer = document.createElement("div");
      tableContainer.id = config.id;
      tableContainer.setAttribute("role", "tabpanel");
      tableContainer.className = "table-container hidden";
      tabContainer.appendChild(tableContainer);
    }

    // Create table structure with ID number
    const table = document.createElement("table");
    table.className = "bit-reference-table w-full";

    // Add a table number to the top
    const caption = document.createElement("caption");
    caption.textContent = `Table ${tabIndex + 1}: ${
      suit.charAt(0).toUpperCase() + suit.slice(1)
    }`;
    caption.className = "text-left text-lg font-bold mb-2 text-gray-300";
    table.appendChild(caption);

    // Add table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Create header cells - remove Hex column from all tables
    const headers = [
      { text: "Card", className: "w-24 text-left" },
      { text: "Binary Representation (MSB → LSB)", className: "text-left" },
      { text: "Explanation", className: "text-left" },
    ];

    headers.forEach((header) => {
      const th = document.createElement("th");
      th.className = header.className;
      th.textContent = header.text;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");
    const ranks = [
      { name: "A", value: 14 },
      { name: "K", value: 13 },
      { name: "Q", value: 12 },
      { name: "J", value: 11 },
      { name: "T", value: 10 },
      { name: "9", value: 9 },
      { name: "8", value: 8 },
      { name: "7", value: 7 },
      { name: "6", value: 6 },
      { name: "5", value: 5 },
      { name: "4", value: 4 },
      { name: "3", value: 3 },
      { name: "2", value: 2 },
    ];

    ranks.forEach((rank) => {
      const rankBit = 1n << BigInt(rank.value);
      const suitBit = BigInt(config.bitValue);
      const combinedValue = rankBit | suitBit;

      const tr = document.createElement("tr");

      // Create card cell
      const cardCell = document.createElement("td");
      cardCell.className = "py-2";
      const cardSpan = document.createElement("span");
      cardSpan.className = `card-display ${config.isRed ? "red" : ""}`;
      cardSpan.textContent = `${rank.name}${config.symbol}`;
      cardCell.appendChild(cardSpan);

      // Create binary representation cell
      const binaryCell = document.createElement("td");
      binaryCell.className = "py-2 font-mono";
      binaryCell.innerHTML = formatBinary(combinedValue, 32);

      // Create explanation cell
      const explainCell = document.createElement("td");
      explainCell.className = "py-2 text-gray-300 explanation-cell";
      explainCell.style.maxWidth = "400px";
      explainCell.style.whiteSpace = "normal";
      explainCell.style.wordWrap = "break-word";
      explainCell.style.overflowWrap = "break-word";

      // Simplified explanation text to prevent overflow
      const rankName = rank.name === "T" ? "10" : rank.name;
      const suitName = Object.keys(suitConfigs).find(
        (key) => suitConfigs[key].bitValue === config.bitValue
      );
      const suitNameCapitalized =
        suitName.charAt(0).toUpperCase() + suitName.slice(1);
      explainCell.innerHTML = `The ${rankName} of ${suitNameCapitalized} sets: Bit ${
        rank.value
      } for rank, Bit ${Math.log2(config.bitValue)} for suit.`;

      // Append cells to row in the right order
      tr.appendChild(cardCell);
      tr.appendChild(binaryCell);
      tr.appendChild(explainCell);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
  });

  console.log("Bit reference tables generation complete");

  // Add this function after the tables are generated
  initializeTabs();
}

// Function to handle tab switching
function switchTab(tabButton) {
  console.log("Switching to tab:", tabButton.getAttribute("aria-controls"));

  // Get all tab buttons and content
  const tabButtons = document.querySelectorAll('[role="tab"]');
  const tabPanels = document.querySelectorAll('[role="tabpanel"]');

  // Remove active class from all tabs and hide all content
  tabButtons.forEach((button) => {
    button.classList.remove("active");
    button.setAttribute("aria-selected", "false");
  });

  tabPanels.forEach((panel) => {
    panel.classList.remove("active");
    panel.classList.add("hidden");
  });

  // Add active class to clicked tab and show its content
  tabButton.classList.add("active");
  tabButton.setAttribute("aria-selected", "true");

  const panelId = tabButton.getAttribute("aria-controls");
  const panel = document.getElementById(panelId);

  if (panel) {
    console.log(`Activating panel: ${panelId}`);
    panel.classList.add("active");
    panel.classList.remove("hidden");
  }
}

// Initialize tabs
function initializeTabs() {
  console.log("Initializing tabs...");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContainers = document.querySelectorAll(".table-container");

  if (tabButtons.length === 0) {
    console.error("No tab buttons found");
    return;
  }

  console.log(
    `Found ${tabButtons.length} tab buttons and ${tabContainers.length} tab containers`
  );

  // Set the first tab as active by default
  tabButtons[0].classList.add("active");
  if (tabContainers[0]) {
    tabContainers[0].classList.remove("hidden");
  }

  // Add click event listeners to all tab buttons
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      tabButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to the clicked button
      button.classList.add("active");

      // Hide all tab containers
      tabContainers.forEach((container) => container.classList.add("hidden"));

      // Show the corresponding tab container
      const tabId = button.getAttribute("aria-controls");
      const tabContainer = document.getElementById(tabId);
      if (tabContainer) {
        tabContainer.classList.remove("hidden");
      }
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing application...");

  // Generate the bit reference tables for different suits
  generateBitReferenceTables();

  // Make sure Spades tab is selected by default
  const spadesTab = document.getElementById("tab-spades");
  if (spadesTab) {
    spadesTab.click();
  }

  // Add event listener to the deal button
  const dealButton = document.getElementById("dealButton");
  if (dealButton) {
    dealButton.addEventListener("click", dealHand);
  } else {
    console.warn("Deal button not found");
  }

  // Ensure step analysis is hidden initially
  const stepAnalysis = document.getElementById("stepAnalysis");
  if (stepAnalysis) {
    stepAnalysis.classList.add("hidden");
  }

  // Make sure initial placeholder cards are visible and properly styled
  const handDisplay = document.getElementById("handDisplay");
  if (handDisplay && handDisplay.children.length === 0) {
    // Add 5 placeholder cards if none exist
    for (let i = 0; i < 5; i++) {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card placeholder";
      cardDiv.setAttribute("role", "img");
      cardDiv.setAttribute("aria-label", "Card back");
      handDisplay.appendChild(cardDiv);
    }
  }

  console.log("Application initialization complete");
});

// Function to format a single bit position with highlighting
function formatSingleBitField(position) {
  const value = 1n << BigInt(position);
  return formatBinary(value, 32);
}

// Add this function before updateStepAnalysis
function formatCard(card) {
  const rankSymbol = rankMap[card.rank];
  const suitSymbol = suitSymbols[card.suit];
  const isRed = suitColors[card.suit] === "red";
  return `<span class="card-display ${
    isRed ? "red" : ""
  }">${rankSymbol}${suitSymbol}</span>`;
}

// Update the step analysis functions
function updateStepAnalysis(hand) {
  const stepAnalysis = document.getElementById("stepAnalysis");

  if (!hand || !hand.cards || hand.cards.length === 0) {
    stepAnalysis.classList.add("hidden");
    return;
  }

  // Calculate the combined value and other patterns
  const combinedValue = hand.cards.reduce(
    (acc, card) => acc | (1n << BigInt(card.rankValue)),
    0n
  );
  const allSetPositions = hand.cards.map((card) => card.rankValue);

  const lowestBit = combinedValue & -combinedValue;
  const normalizedPattern = lowestBit ? combinedValue / lowestBit : 0n;

  // Determine straights and flushes
  const isStraight = normalizedPattern === 31n || combinedValue === 0x403cn;
  const isFlush = hand.cards.every((card) => card.suit === hand.cards[0].suit);
  const isAceLowStraight = combinedValue === 0x403cn;

  // Use the result from rankPokerHand if available
  let handType = "High Card";
  let handExplanation = "";

  if (hand.result) {
    // Use the result directly from rankPokerHand
    handType = hand.result.handName;

    // Generate explanation based on hand type
    if (handType === "Royal Flush") {
      handExplanation =
        "A 10-J-Q-K-A sequence of the same suit - the best possible hand!";
    } else if (handType === "Straight Flush") {
      handExplanation = "Five consecutive cards of the same suit.";
    } else if (handType === "4 of a Kind") {
      handExplanation = "Four cards of the same rank.";
    } else if (handType === "Full House") {
      handExplanation =
        "Three cards of one rank and two cards of another rank.";
    } else if (handType === "Flush") {
      handExplanation = "Five cards of the same suit, not in sequence.";
    } else if (handType === "Straight") {
      handExplanation = isAceLowStraight
        ? "Five consecutive cards (A-2-3-4-5) of different suits."
        : "Five consecutive cards of different suits.";
    } else if (handType === "3 of a Kind") {
      handExplanation = "Three cards of the same rank.";
    } else if (handType === "2 Pair") {
      handExplanation = "Two different pairs of cards of the same rank.";
    } else if (handType === "1 Pair") {
      handExplanation = "Two cards of the same rank.";
    } else {
      handExplanation = "Five unmatched cards, evaluated by highest card.";
    }
  } else {
    // Fallback to basic detection if result is not available
    if (isStraight && isFlush) {
      if ((combinedValue & 0x7c00n) === 0x7c00n) {
        // A, K, Q, J, 10
        handType = "Royal Flush";
        handExplanation =
          "A 10-J-Q-K-A sequence of the same suit - the best possible hand!";
      } else {
        handType = "Straight Flush";
        handExplanation = "Five consecutive cards of the same suit.";
      }
    } else if (isStraight) {
      handType = "Straight";
      handExplanation = isAceLowStraight
        ? "Five consecutive cards (A-2-3-4-5) of different suits."
        : "Five consecutive cards of different suits.";
    } else if (isFlush) {
      handType = "Flush";
      handExplanation = "Five cards of the same suit, not in sequence.";
    } else {
      handExplanation = "Five unmatched cards, evaluated by highest card.";
    }
  }

  stepAnalysis.classList.remove("hidden");

  // Update the step analysis with table structure
  stepAnalysis.innerHTML = `
    <div class="step-card">
      <h3 class="text-xl font-semibold mb-4">Step-by-Step Analysis</h3>
      
      <div class="calculation-step">
        <div class="font-semibold mb-2">SECTION 1: Individual Card Patterns</div>
        <p class="text-gray-300 mb-4">
          Each card in the hand is converted into a unique 32-bit binary pattern. The pattern combines:
          <ul class="list-disc ml-6 mb-4 text-gray-300">
            <li>The card's rank (2-14) sets a single bit in positions 2-14 (<span class="text-emerald-400 bg-emerald-900/30 px-1">emerald shading</span>)</li>
            <li>The card's suit (♠♣♥♦) sets a single bit in the rightmost 4 positions (<span class="text-amber-400 bg-amber-900/30 px-1">amber shading</span>)</li>
            <li>This creates a unique <span class="tech-term">binary fingerprint<span class="tooltip"><span class="tooltip-title">Binary Fingerprint</span><span class="tooltip-content">A unique binary pattern that identifies a specific card, with one bit set for its rank and one bit set for its suit.</span></span></span> for each card, with distinct shading for rank and suit bits</li>
          </ul>
        </p>
        <table class="w-full text-left step-analysis-table">
          <tr>
            <th class="w-32 pr-4">Card</th>
            <th>Binary Pattern</th>
          </tr>
          ${hand.cards
            .map((card) => {
              const rankBit = 1n << BigInt(card.rankValue);
              const suitBit = BigInt(card.suit);
              const cardPattern = rankBit | suitBit;
              return `
                <tr>
                  <td class="pr-4">${formatCard(card)}</td>
                  <td class="font-mono binary-cell">${formatBinary(
                    cardPattern,
                    32
                  )}</td>
                </tr>
              `;
            })
            .join("")}
        </table>
      </div>

      <div class="calculation-step">
        <div class="font-semibold mb-2">SECTION 2: Combined Pattern</div>
        <p class="text-gray-300 mb-4">
          All card patterns are merged using <span class="tech-term">bitwise OR operations<span class="tooltip"><span class="tooltip-title">Bitwise OR</span><span class="tooltip-content">An operation (|) that combines bits, setting a result bit to 1 if any corresponding input bit is 1. Used to merge card patterns together.</span></span></span>. This creates a single 32-bit pattern where:
          <ul class="list-disc ml-6 mb-4 text-gray-300">
            <li>Each set rank bit (<span class="text-emerald-400 bg-emerald-900/30 px-1">emerald shading</span>) represents a rank present in the hand</li>
            <li>Each set suit bit (<span class="text-amber-400 bg-amber-900/30 px-1">amber shading</span>) represents the suits present</li>
            <li>Multiple cards of the same rank only set their bit once</li>
            <li>The distinct shading helps visualize the rank and suit patterns</li>
          </ul>
        </p>
        <table class="w-full text-left step-analysis-table">
          <tr>
            <th class="w-32 pr-4">Pattern</th>
            <th>Binary Value</th>
          </tr>
          <tr>
            <td class="pr-4">Combined</td>
            <td class="font-mono binary-cell">${formatBinary(
              combinedValue,
              32
            )}</td>
          </tr>
        </table>
      </div>

      <div class="calculation-step">
        <div class="font-semibold mb-2">SECTION 3: Pattern Analysis</div>
        <p class="text-gray-300 mb-4">
          The combined pattern is analyzed to detect specific hand types:
          <ul class="list-disc ml-6 mb-4 text-gray-300">
            <li><span class="tech-term">Straight detection<span class="tooltip"><span class="tooltip-title">Straight Detection</span><span class="tooltip-content">A technique to identify five consecutive card ranks by normalizing the bit pattern and checking if it equals 31 (binary: 11111).</span></span></span>: Checks if set rank bits (<span class="text-emerald-400 bg-emerald-900/30 px-1">emerald</span>) are consecutive</li>
            <li><span class="tech-term">Ace-low straight<span class="tooltip"><span class="tooltip-title">Ace-low Straight</span><span class="tooltip-content">A special case straight where Ace acts as the lowest card (A-2-3-4-5). Detected by checking for a specific bit pattern (0x403c).</span></span></span>: Special case check for specific rank pattern</li>
            <li><span class="tech-term">Flush detection<span class="tooltip"><span class="tooltip-title">Flush Detection</span><span class="tooltip-content">A technique to identify when all five cards share the same suit by comparing bit patterns in the suit positions.</span></span></span>: Verifies suit bits (<span class="text-amber-400 bg-amber-900/30 px-1">amber</span>) match</li>
            <li>Other patterns: Analyzes bit groupings to detect pairs, three of a kind, etc.</li>
            <li>The <span class="tech-term">normalized pattern<span class="tooltip"><span class="tooltip-title">Normalized Pattern</span><span class="tooltip-content">The result of dividing the bit pattern by its lowest set bit, which aligns patterns to start from bit 0, making pattern recognition easier.</span></span></span> helps identify straights by removing gaps between set bits</li>
          </ul>
        </p>
        <table class="w-full text-left step-analysis-table">
          <tr>
            <th class="w-32 pr-4">Check</th>
            <th>Result</th>
          </tr>
          <tr>
            <td class="pr-4">Normalized</td>
            <td class="font-mono binary-cell">${formatBinary(
              normalizedPattern,
              32
            )}</td>
          </tr>
          <tr>
            <td class="pr-4">Straight</td>
            <td class="font-mono ${
              isStraight ? "text-emerald-400" : "text-red-500"
            }">${
    isStraight
      ? `✓ Straight detected${isAceLowStraight ? " (Ace-low)" : ""}`
      : "✗ Not a straight - bits not consecutive"
  }</td>
          </tr>
          <tr>
            <td class="pr-4">Flush</td>
            <td class="font-mono ${
              isFlush ? "text-emerald-400" : "text-red-500"
            }">${
    isFlush
      ? `✓ Flush detected - all ${suitSymbols[hand.cards[0].suit]}`
      : "✗ Not a flush - suits don't match"
  }</td>
          </tr>
          ${
            hand.result && hand.result.v
              ? `
          <tr>
            <td class="pr-4">Other</td>
            <td class="font-mono ${
              [
                "1 Pair",
                "2 Pair",
                "3 of a Kind",
                "Full House",
                "4 of a Kind",
              ].includes(handType)
                ? "text-emerald-400"
                : "text-red-500"
            }">${
                  [
                    "1 Pair",
                    "2 Pair",
                    "3 of a Kind",
                    "Full House",
                    "4 of a Kind",
                  ].includes(handType)
                    ? `✓ ${handType} detected`
                    : "✗ No pairs or sets detected"
                }</td>
          </tr>`
              : ""
          }
        </table>
      </div>

      <div class="calculation-step">
        <div class="font-semibold mb-2">SECTION 4: Final Result</div>
        <p class="text-gray-300 mb-4">
          The final analysis combines all previous calculations to determine the hand rank:
          <ul class="list-disc ml-6 mb-4 text-gray-300">
            <li>Combined pattern shows all ranks (<span class="text-emerald-400 bg-emerald-900/30 px-1">emerald</span>) and suits (<span class="text-amber-400 bg-amber-900/30 px-1">amber</span>) present</li>
            <li>Normalized pattern helps identify special sequences in the rank bits</li>
            <li><span class="tech-term">Bit grouping analysis<span class="tooltip"><span class="tooltip-title">Bit Grouping Analysis</span><span class="tooltip-content">A technique that counts occurrences of each rank in a 4-bit space, enabling detection of pairs, three of a kind, and other poker hand patterns.</span></span></span> detects pairs, three of a kind, full house, etc.</li>
            <li>The shaded bits visually confirm the hand's composition</li>
          </ul>
        </p>
        
        <div class="bg-gray-800 p-4 mb-4 rounded-lg border border-emerald-500">
          <h4 class="text-xl font-bold text-center text-emerald-400 mb-2">Hand Analysis Result: ${handType}</h4>
          <p class="text-gray-300 text-center">${handExplanation}</p>
        </div>
        
        <table class="w-full text-left step-analysis-table">
          <tr>
            <th class="w-32 pr-4">Value</th>
            <th>Pattern</th>
          </tr>
          <tr>
            <td class="pr-4"><span class="tech-term">Combined<span class="tooltip"><span class="tooltip-title">Combined Value</span><span class="tooltip-content">The result of merging all card ranks using bitwise OR operations. Each set bit represents a rank present in the hand. This pattern is the foundation for all hand analysis.</span></span></span></td>
            <td class="font-mono binary-cell">${formatBinary(
              combinedValue,
              32
            )}</td>
          </tr>
          <tr>
            <td class="pr-4"><span class="tech-term">Normalized<span class="tooltip"><span class="tooltip-title">Normalized Pattern</span><span class="tooltip-content">The result of dividing the combined value by its lowest set bit. This aligns patterns to remove gaps between bits, making it easy to detect straights when the normalized value equals 31 (binary: 11111).</span></span></span></td>
            <td class="font-mono binary-cell">${formatBinary(
              normalizedPattern,
              32
            )}</td>
          </tr>
          <tr>
            <td class="pr-4"><span class="tech-term">Hex Value<span class="tooltip"><span class="tooltip-title">Hexadecimal Value</span><span class="tooltip-content">A compact base-16 representation of the combined binary pattern. Hex makes it easier to identify specific bit patterns, like 0x7c00 for a royal flush or 0x403c for an ace-low straight, without counting individual bits.</span></span></span></td>
            <td class="font-mono">0x${combinedValue
              .toString(16)
              .toUpperCase()
              .padStart(8, "0")}</td>
          </tr>
          ${
            hand.result && hand.result.v
              ? `
          <tr>
            <td class="pr-4"><span class="tech-term">v Value<span class="tooltip"><span class="tooltip-title">v Value</span><span class="tooltip-content">The core mathematical value of the algorithm that identifies pairs, three-of-a-kind, etc. It works by using 4-bit counters (nibbles) for each rank, incrementing each time a card of that rank appears. After processing, v mod 15 produces unique values: 6=One Pair, 7=Two Pair, 9=Three of a Kind, 10=Full House, 1=Four of a Kind. This elegant approach avoids nested if/else statements, making the code compact and efficient.</span></span></span></td>
            <td class="font-mono">0x${BigInt(hand.result.v)
              .toString(16)
              .toUpperCase()
              .padStart(8, "0")}</td>
          </tr>`
              : ""
          }
          <tr>
            <td class="pr-4">Hand Type</td>
            <td class="font-bold text-emerald-400">${handType}</td>
          </tr>
        </table>
      </div>
    </div>
  `;
}

function validateHand(hand) {
  if (!hand || !Array.isArray(hand) || hand.length !== 5) {
    console.error("Invalid hand: Must have exactly 5 cards");
    return false;
  }

  // Validate ranks and suits
  for (let card of hand) {
    if (!card.rank || !card.suit) {
      console.error("Invalid card:", card);
      return false;
    }
    if (card.rank < 2 || card.rank > 14) {
      console.error("Invalid rank:", card.rank);
      return false;
    }
    if (![1, 2, 4, 8].includes(card.suit)) {
      console.error("Invalid suit:", card.suit);
      return false;
    }
  }

  return true;
}

function rankPokerHand(cs, ss) {
  // Input validation
  if (
    !Array.isArray(cs) ||
    !Array.isArray(ss) ||
    cs.length !== 5 ||
    ss.length !== 5
  ) {
    throw new Error("Invalid input: Must provide two arrays of length 5");
  }

  console.log("Input:", { cards: cs, suits: ss });

  // Create bit field for ranks
  var s =
    (1 << cs[0]) | (1 << cs[1]) | (1 << cs[2]) | (1 << cs[3]) | (1 << cs[4]);
  console.log("Rank bit field:", s.toString(2).padStart(32, "0"));

  var v, i, o;

  try {
    for (i = -1, v = o = 0; i < 5; i++) {
      let currentRank = cs[i] || 0;
      if (i >= 0) {
        let offsetBig = BigInt(2) ** BigInt(currentRank * 4);
        o = Number(offsetBig);
        let vBig = BigInt(v);
        let nibbleValue = 0;
        if (o !== 0) {
          nibbleValue = Math.floor(v / o) & 15;
        }
        vBig += offsetBig * BigInt(nibbleValue + 1);
        v = Number(vBig);
        if (!Number.isFinite(v)) {
          console.error("Calculation resulted in non-finite number");
          v = 0;
          break;
        }
      }
    }
  } catch (e) {
    console.error("Error during v calculation:", e);
    v = 0;
  }

  let s_normalized = 0;
  let lowestSetBit = s & -s;
  if (lowestSetBit !== 0) {
    s_normalized = s / lowestSetBit;
  }

  let modResult = Number.isFinite(v) ? v % 15 : 5;
  let straightCheck = s_normalized === 31 || s === 0x403c;
  let flushCheck = ss.length === 5 && ss[0] === (ss[1] | ss[2] | ss[3] | ss[4]);
  let royalCheck = s === 0x7c00;

  let resultIndex = modResult - (straightCheck ? 3 : 1);
  resultIndex -= (flushCheck ? 1 : 0) * (royalCheck ? -5 : 1);
  resultIndex = Math.max(
    0,
    Math.min(hands.length - 1, Math.round(resultIndex))
  );

  return {
    handName: hands[resultIndex] || "Unknown Hand",
    isAceLowStraight: s === 0x403c,
    s,
    v,
    s_normalized,
    resultIndex,
  };
}

function createDeck() {
  const deck = [];
  for (const suitSymbol in suits) {
    const suitFlag = suits[suitSymbol];
    for (const rank of cardRanks) {
      deck.push({ rank: rank, suit: suitFlag });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function dealHand() {
  const deck = shuffleDeck(createDeck());
  const hand = deck.slice(0, 5);

  // Validate hand before analysis
  if (!validateHand(hand)) {
    console.error("Invalid hand dealt");
    return;
  }

  const cardRanksInput = hand.map((card) => card.rank);
  const cardSuitsInput = hand.map((card) => card.suit);

  // Validate inputs for rankPokerHand
  console.log("Validating hand inputs:", {
    ranks: cardRanksInput,
    suits: cardSuitsInput,
  });

  const handDisplay = document.getElementById("handDisplay");
  const resultDisplay = document.getElementById("resultDisplay");
  const stepAnalysis = document.getElementById("stepAnalysis");

  // Clear any previous result
  resultDisplay.textContent = "";
  resultDisplay.className = "text-center font-semibold text-xl min-h-[2rem]";
  stepAnalysis.classList.add("hidden");

  // Clear previous cards
  handDisplay.innerHTML = "";

  // Display new cards with a sequential deal animation
  hand.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    const rankDisplay = rankMap[card.rank];
    const suitSymbolDisplay = suitSymbols[card.suit];
    const isRed = suitColors[card.suit] === "red";

    // Start with a placeholder (face down) and add deal animation class
    cardDiv.className = "card placeholder";
    cardDiv.setAttribute("role", "img");
    cardDiv.setAttribute(
      "aria-label",
      `${rankDisplay} of ${suitSymbolDisplay}`
    );

    handDisplay.appendChild(cardDiv);

    // Reveal each card sequentially with a slight delay
    setTimeout(() => {
      // Replace placeholder with the actual card
      cardDiv.className = "card deal-animation";
      cardDiv.innerHTML = `
        <span class="rank ${isRed ? "red" : "black"}">${rankDisplay}</span>
        <span class="suit ${
          isRed ? "red" : "black"
        }">${suitSymbolDisplay}</span>
      `;

      // After the last card is dealt, show the result
      if (index === hand.length - 1) {
        setTimeout(showResult, 500, cardRanksInput, cardSuitsInput, hand);
      }
    }, 200 * (index + 1)); // Each card reveals after a 200ms delay from the previous one
  });
}

// Function to show the analysis result after cards are dealt
function showResult(cardRanksInput, cardSuitsInput, hand) {
  const resultDisplay = document.getElementById("resultDisplay");
  const stepAnalysis = document.getElementById("stepAnalysis");

  try {
    // Get the full poker hand analysis from rankPokerHand
    const result = rankPokerHand(cardRanksInput, cardSuitsInput);

    resultDisplay.textContent = `Result: ${result.handName}${
      result.isAceLowStraight ? " (Ace low)" : ""
    }`;
    resultDisplay.className =
      "text-center font-semibold text-xl text-emerald-400";

    // Update the step analysis with the hand and results
    // Pass the full result to ensure all analysis steps match
    updateStepAnalysis({
      cards: hand.map((card) => ({ ...card, rankValue: card.rank })),
      result: result, // Pass the full result from rankPokerHand
    });
  } catch (error) {
    console.error("Error analyzing hand:", error);
    resultDisplay.textContent = "Error analyzing hand. Check console.";
    resultDisplay.className = "text-center font-semibold text-xl text-red-500";
    stepAnalysis.classList.add("hidden");
  }
}

// Smart tooltip positioning
function initTooltips() {
  const techTerms = document.querySelectorAll(".tech-term");

  techTerms.forEach((term) => {
    const tooltip = term.querySelector(".tooltip");
    if (tooltip) {
      term.addEventListener("mouseenter", () => {
        // Get dimensions and positions
        const termRect = term.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Reset positioning classes
        tooltip.classList.remove(
          "position-bottom",
          "position-left",
          "position-right"
        );

        // Check vertical position
        const tooltipHeight = tooltipRect.height;
        const spaceAbove = termRect.top;
        const spaceBelow = viewportHeight - termRect.bottom;

        if (
          spaceAbove < tooltipHeight + 10 &&
          spaceBelow >= tooltipHeight + 10
        ) {
          // Place below
          tooltip.classList.add("position-bottom");
        }

        // Check horizontal position
        setTimeout(() => {
          const updatedTooltipRect = tooltip.getBoundingClientRect();

          if (updatedTooltipRect.left < 10) {
            // Too close to left edge
            tooltip.classList.add("position-left");
          } else if (updatedTooltipRect.right > viewportWidth - 10) {
            // Too close to right edge
            tooltip.classList.add("position-right");
          }
        }, 0);
      });
    }
  });
}

// Initialize on page load and whenever DOM might change
document.addEventListener("DOMContentLoaded", initTooltips);
window.addEventListener("resize", initTooltips);

// Call now for any already loaded content
setTimeout(initTooltips, 500);
