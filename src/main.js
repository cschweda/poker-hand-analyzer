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

// Helper function to format binary with highlighting
function formatBinaryWithHighlight(
  number,
  length = 32,
  highlightPositions = []
) {
  const binary = BigInt(number).toString(2).padStart(length, "0");
  const groups = binary.match(/.{1,4}/g) || [];

  return groups
    .map((group, groupIndex) => {
      const bits = group
        .split("")
        .map((bit, bitIndex) => {
          const position = groupIndex * 4 + bitIndex;
          const isSetBit = bit === "1";
          if (isSetBit || highlightPositions.includes(position)) {
            return `<span class="active-bit">${bit}</span>`;
          }
          return bit;
        })
        .join("");
      return `<span class="bit-group">${bits}</span>`;
    })
    .join(" ");
}

// Function to generate bit reference tables
function generateBitReferenceTables() {
  console.log("Generating bit reference tables...");

  // First, find or create the tab container
  let tabContainer = document.querySelector(".tab-container");
  if (!tabContainer) {
    // Create and insert the tab container if it doesn't exist
    tabContainer = document.createElement("div");
    tabContainer.className = "tab-container";
    const contentSection = document.querySelector(".content-section");
    if (contentSection) {
      contentSection.appendChild(tabContainer);
    } else {
      console.warn("No content section found to add tab container");
      return; // Exit if we can't find a place to add the container
    }
  }

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

  const suitConfigs = {
    spades: { symbol: "♠", id: "spades", isRed: false, bitValue: 1 },
    clubs: { symbol: "♣", id: "clubs", isRed: false, bitValue: 2 },
    hearts: { symbol: "♥", id: "hearts", isRed: true, bitValue: 4 },
    diamonds: { symbol: "♦", id: "diamonds", isRed: true, bitValue: 8 },
  };

  // Add explanation div before the tables
  const explanationDiv = document.createElement("div");
  explanationDiv.className = "mb-6 p-4 bg-gray-900 rounded-lg text-gray-300";
  explanationDiv.innerHTML = `
    <p class="mb-2"><strong>How bits are set:</strong></p>
    <ul class="list-disc pl-6 space-y-2">
      <li>Each card's <strong class="text-emerald-400">rank</strong> determines which bit to set (2-14)</li>
      <li>
        <span class="mb-2">Binary numbers are shown in groups of 4 bits for readability:</span>
        <ul class="list-none mt-2 space-y-1 font-mono">
          <li class="mb-2">• Reading left to right: <span class="text-emerald-400">0000 0000 0000 0000 0000 0000 0000 0000</span></li>
          <li>• Most significant bits (MSB) are on the left</li>
          <li>• Least significant bits (LSB) are on the right</li>
          <li>• Position numbers increase right-to-left (0-31)</li>
        </ul>
      </li>
      <li>
        Each card's <strong class="text-emerald-400">suit</strong> is encoded in the rightmost (least significant) 4 bits:
        <div class="mt-2 font-mono">
          <div class="text-gray-500 text-xs mb-2" style="letter-spacing: 0.5em">Bit position (31-0):</div>
          <div class="text-gray-500 text-xs mb-2" style="letter-spacing: 0.5em">31 30 29 28  27 26 25 24  23 22 21 20  19 18 17 16  15 14 13 12  11 10 09 08  07 06 05 04  03 02 01 00</div>
          <div class="flex flex-col space-y-2">
            <div class="flex items-center">
              <span class="w-24">♠ Spades = 1</span>
              <span class="text-emerald-400" style="letter-spacing: 0.5em">0000      0000      0000      0000      0000      0000      0000      <span class="bg-amber-900/80 px-1">000<span class="text-amber-400">1</span></span></span>
            </div>
            <div class="flex items-center">
              <span class="w-24">♣ Clubs = 2</span>
              <span class="text-emerald-400" style="letter-spacing: 0.5em">0000      0000      0000      0000      0000      0000      0000      <span class="bg-amber-900/80 px-1">00<span class="text-amber-400">1</span>0</span></span>
            </div>
            <div class="flex items-center text-red-600">
              <span class="w-24">♥ Hearts = 4</span>
              <span class="text-emerald-400" style="letter-spacing: 0.5em">0000      0000      0000      0000      0000      0000      0000      <span class="bg-amber-900/80 px-1">0<span class="text-amber-400">1</span>00</span></span>
            </div>
            <div class="flex items-center text-red-600">
              <span class="w-24">♦ Diamonds = 8</span>
              <span class="text-emerald-400" style="letter-spacing: 0.5em">0000      0000      0000      0000      0000      0000      0000      <span class="bg-amber-900/80 px-1"><span class="text-amber-400">1</span>000</span></span>
            </div>
          </div>
        </div>
      </li>
      <li class="mt-4">
        <strong>Detailed Example: Ace of Hearts (A♥)</strong>
        <div class="mt-2 space-y-4 bg-gray-800 p-4 rounded-lg">
          <div>
            <div class="text-sm text-gray-400 mb-1">1. The Ace (rank 14) sets its bit:</div>
            <div class="font-mono">
              <div class="text-gray-500 text-xs mb-1" style="letter-spacing: 0.5em">Bit position (31-0):</div>
              <div class="text-gray-500 text-xs mb-2" style="letter-spacing: 0.5em">31 30 29 28  27 26 25 24  23 22 21 20  19 18 17 16  15 14 13 12  11 10 09 08  07 06 05 04  03 02 01 00</div>
              <div class="text-emerald-400" style="letter-spacing: 0.5em">0000      0000      0000      0000      <span class="bg-blue-900 px-1">0<span class="text-amber-400">1</span>00</span>      0000      0000      0000</div>
              <div class="text-gray-400 text-sm mt-1">Bit 14 set to 1 for Ace (highlighted in blue)</div>
            </div>
          </div>

          <div>
            <div class="text-sm text-gray-400 mb-1">2. The Hearts suit (value 4) sets its bit:</div>
            <div class="font-mono">
              <div class="text-gray-500 text-xs mb-1" style="letter-spacing: 0.5em">Bit position (31-0):</div>
              <div class="text-gray-500 text-xs mb-2" style="letter-spacing: 0.5em">31 30 29 28  27 26 25 24  23 22 21 20  19 18 17 16  15 14 13 12  11 10 09 08  07 06 05 04  03 02 01 00</div>
              <div class="text-emerald-400" style="letter-spacing: 0.5em">0000      0000      0000      0000      0000      0000      0000      <span class="bg-amber-900 px-1">0<span class="text-amber-400">1</span>00</span></div>
              <div class="text-gray-400 text-sm mt-1">Bit 2 set to 1 for Hearts (highlighted in amber)</div>
            </div>
          </div>

          <div>
            <div class="text-sm text-gray-400 mb-1">3. Combined representation (both rank and suit):</div>
            <div class="font-mono">
              <div class="text-gray-500 text-xs mb-1" style="letter-spacing: 0.5em">Bit position (31-0):</div>
              <div class="text-gray-500 text-xs mb-2" style="letter-spacing: 0.5em">31 30 29 28  27 26 25 24  23 22 21 20  19 18 17 16  15 14 13 12  11 10 09 08  07 06 05 04  03 02 01 00</div>
              <div class="text-emerald-400" style="letter-spacing: 0.5em">0000      0000      0000      0000      <span class="bg-blue-900 px-1">0<span class="text-amber-400">1</span>00</span>      0000      0000      <span class="bg-amber-900 px-1">0<span class="text-amber-400">1</span>00</span></div>
              <div class="text-gray-400 text-sm mt-1">Ace (blue highlight) and Hearts (amber highlight) bits set to 1</div>
            </div>
          </div>

          <div class="text-sm text-gray-300 mt-4">
            <strong>What this means:</strong>
            <ul class="list-disc ml-4 mt-2 space-y-2">
              <li>The Ace is represented by setting bit 14 to 1 (counting from right, position 14)</li>
              <li>Hearts is represented by setting bit 2 to 1 (in the rightmost 4 bits)</li>
              <li>All other bits remain 0</li>
              <li>This creates a unique pattern that identifies an Ace of Hearts</li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  `;
  tabContainer.appendChild(explanationDiv);

  // Create tables for each suit
  Object.entries(suitConfigs).forEach(([suit, config]) => {
    console.log(`Generating table for ${suit}...`);

    // Create table container if it doesn't exist
    let tableContainer = document.getElementById(config.id);
    if (!tableContainer) {
      tableContainer = document.createElement("div");
      tableContainer.id = config.id;
      tableContainer.className = "table-container";
      tabContainer.appendChild(tableContainer);
    }

    // Create table structure
    const table = document.createElement("table");
    table.className = "bit-reference-table w-full";

    // Add table header
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Card</th>
        <th>Binary Pattern</th>
        <th>Hex</th>
      </tr>
    `;
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");
    ranks.forEach((rank) => {
      const rankBit = 1n << BigInt(rank.value);
      const suitBit = BigInt(config.bitValue);
      const combinedValue = rankBit | suitBit;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="card-display ${config.isRed ? "red" : ""}">${rank.name}${
        config.symbol
      }</td>
        <td class="binary-bits">${formatBinaryWithHighlight(combinedValue, 32, [
          rank.value,
          Math.log2(config.bitValue),
        ])}</td>
        <td>0x${combinedValue.toString(16).toUpperCase().padStart(4, "0")}</td>
      `;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
  });

  console.log("Bit reference tables generation complete");
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
  const tabButtons = document.querySelectorAll('[role="tab"]');

  if (tabButtons.length === 0) {
    console.error("No tab buttons found");
    return;
  }

  // Add click handlers to buttons
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Tab button clicked:", button.id);
      switchTab(button);
    });
  });

  // Set initial active tab (spades)
  const spadesTab = document.getElementById("tab-spades");
  if (spadesTab) {
    console.log("Setting initial active tab to Spades");
    switchTab(spadesTab);
  } else {
    console.log("Spades tab not found, defaulting to first tab");
    switchTab(tabButtons[0]);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing application...");

  // Initialize tabs
  initializeTabs();

  // Generate bit reference tables
  generateBitReferenceTables();

  // Add deal button handler
  const dealButton = document.getElementById("dealButton");
  if (dealButton) {
    dealButton.addEventListener("click", dealHand);
  }

  // Ensure step analysis is hidden initially
  const stepAnalysis = document.getElementById("stepAnalysis");
  if (stepAnalysis) {
    stepAnalysis.classList.add("hidden");
  }

  console.log("Application initialization complete");
});

// Function to format binary number into groups of 4 bits with highlighting
function formatBinary(num, size = 32) {
  return formatBinaryWithHighlight(num, size, []);
}

// Function to format a single bit position with highlighting
function formatSingleBitField(position) {
  const value = 1n << BigInt(position);
  return formatBinaryWithHighlight(value, 32, [position]);
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

  const isStraight = normalizedPattern === 31n || combinedValue === 0x403cn;
  const isFlush = hand.cards.every((card) => card.suit === hand.cards[0].suit);

  stepAnalysis.classList.remove("hidden");

  // Update the step analysis with table structure
  stepAnalysis.innerHTML = `
    <div class="step-card">
      <h3 class="text-xl font-semibold mb-4">Step-by-Step Analysis</h3>
      
      <div class="calculation-step">
        <div class="font-semibold mb-2">Step 1: Individual Card Patterns</div>
        <table class="w-full text-left">
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
                  <td class="font-mono">${formatBinaryWithHighlight(
                    cardPattern,
                    32,
                    [
                      card.rankValue,
                      card.suit < 4 ? card.suit : 2, // Adjust suit bit position
                    ]
                  )}</td>
                </tr>
              `;
            })
            .join("")}
        </table>
      </div>

      <div class="calculation-step">
        <div class="font-semibold mb-2">Step 2: Combined Pattern</div>
        <table class="w-full text-left">
          <tr>
            <th class="w-32 pr-4">Pattern</th>
            <th>Binary Value</th>
          </tr>
          <tr>
            <td class="pr-4">Combined</td>
            <td class="font-mono">${formatBinaryWithHighlight(
              combinedValue,
              32,
              allSetPositions
            )}</td>
          </tr>
        </table>
      </div>

      <div class="calculation-step">
        <div class="font-semibold mb-2">Step 3: Pattern Analysis</div>
        <table class="w-full text-left">
          <tr>
            <th class="w-32 pr-4">Check</th>
            <th>Result</th>
          </tr>
          <tr>
            <td class="pr-4">Normalized</td>
            <td class="font-mono">${formatBinaryWithHighlight(
              normalizedPattern,
              32,
              allSetPositions
            )}</td>
          </tr>
          <tr>
            <td class="pr-4">Straight</td>
            <td class="font-mono ${
              isStraight ? "text-emerald-400" : "text-red-500"
            }">${
    isStraight
      ? `✓ Straight detected${combinedValue === 0x403cn ? " (Ace-low)" : ""}`
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
        </table>
      </div>

      <div class="calculation-step">
        <div class="font-semibold mb-2">Final Result</div>
        <table class="w-full text-left">
          <tr>
            <th class="w-32 pr-4">Value</th>
            <th>Pattern</th>
          </tr>
          <tr>
            <td class="pr-4">Combined</td>
            <td class="font-mono">${formatBinaryWithHighlight(
              combinedValue,
              32,
              allSetPositions
            )}</td>
          </tr>
          <tr>
            <td class="pr-4">Normalized</td>
            <td class="font-mono">${formatBinaryWithHighlight(
              normalizedPattern,
              32,
              allSetPositions
            )}</td>
          </tr>
          <tr>
            <td class="pr-4">Hex Value</td>
            <td class="font-mono">0x${combinedValue
              .toString(16)
              .padStart(8, "0")}</td>
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

  // Clear previous hand and hide step analysis
  handDisplay.innerHTML = "";
  stepAnalysis.classList.add("hidden");

  // Display new cards
  hand.forEach((card) => {
    const cardDiv = document.createElement("div");
    const rankDisplay = rankMap[card.rank];
    const suitSymbolDisplay = suitSymbols[card.suit];
    const isRed = suitColors[card.suit] === "red";

    cardDiv.className = "card";
    cardDiv.setAttribute("role", "img");
    cardDiv.setAttribute(
      "aria-label",
      `${rankDisplay} of ${suitSymbolDisplay}`
    );
    cardDiv.innerHTML = `
      <span class="rank ${isRed ? "red" : "black"}">${rankDisplay}</span>
      <span class="suit ${isRed ? "red" : "black"}">${suitSymbolDisplay}</span>
    `;
    handDisplay.appendChild(cardDiv);
  });

  try {
    const result = rankPokerHand(cardRanksInput, cardSuitsInput);
    resultDisplay.textContent = `Result: ${result.handName}${
      result.isAceLowStraight ? " (Ace low)" : ""
    }`;
    resultDisplay.className =
      "text-center font-semibold text-xl text-emerald-400";

    // Update the step analysis with the hand and results
    updateStepAnalysis({
      cards: hand.map((card) => ({ ...card, rankValue: card.rank })),
    });
  } catch (error) {
    console.error("Error analyzing hand:", error);
    resultDisplay.textContent = "Error analyzing hand. Check console.";
    resultDisplay.className = "text-center font-semibold text-xl text-red-500";
    stepAnalysis.classList.add("hidden");
  }
}
