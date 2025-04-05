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

// Function to format binary with highlighted bits for both rank and suit
function formatBinaryWithHighlight(rank, suitValue) {
  // Create 32-bit binary string with leading zeros for rank (MSB to LSB)
  const rankBinary = (1n << BigInt(rank)).toString(2).padStart(32, "0");

  // Create 4-bit binary string for suit value (rightmost 4 bits)
  const suitBinary = suitValue.toString(2).padStart(4, "0");

  // Split into groups of 4 for readability (left to right)
  const groups = rankBinary.match(/.{1,4}/g);

  // Highlight both the rank bit and suit bits
  return groups
    .map((group, i) => {
      if (i === groups.length - 1) {
        // Last group (rightmost 4 bits) - show suit bits
        return group
          .split("")
          .map((bit, pos) => {
            // Check if this is a set suit bit (in positions 0-3)
            const isSuitBit = pos < 4 && suitBinary[pos] === "1";
            return isSuitBit
              ? `<span class="text-amber-400">${bit}</span>`
              : bit;
          })
          .join("");
      } else if (group.includes("1")) {
        // Group containing rank bit (positions 2-14)
        const pos = group.indexOf("1");
        return (
          group.slice(0, pos) +
          `<span class="text-amber-400">${group[pos]}</span>` +
          group.slice(pos + 1)
        );
      }
      return group;
    })
    .join(" ");
}

// Function to generate bit reference tables
function generateBitReferenceTables() {
  console.log("Generating bit reference tables...");

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
  const tabContainer = document.querySelector(".tab-container");
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
  tabContainer.insertBefore(explanationDiv, tabContainer.firstChild);

  Object.entries(suitConfigs).forEach(([suit, config]) => {
    console.log(`Generating table for ${suit}...`);
    const tableBody = document.querySelector(`#${config.id} tbody`);

    if (!tableBody) {
      console.warn(`Table body not found for ${suit}`);
      return;
    }

    const rows = ranks.map((rank) => {
      const binaryDisplay = formatBinaryWithHighlight(
        rank.value,
        config.bitValue
      );
      const combinedValue =
        (1n << BigInt(rank.value)) | BigInt(config.bitValue);
      const hexValue = combinedValue.toString(16).toUpperCase();
      const cardDisplay = `<span class="card-display ${
        config.isRed ? "red" : ""
      }">${rank.name}${config.symbol}</span>`;

      return `
        <tr>
          <td class="py-2 px-4">${cardDisplay}</td>
          <td class="py-2 px-4 binary-bits">${binaryDisplay}</td>
          <td class="py-2 px-4">0x${hexValue}</td>
        </tr>
      `;
    });

    console.log(`Setting table content for ${suit}`);
    tableBody.innerHTML = rows.join("");
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

  console.log("Application initialization complete");
});

// Function to format binary number into groups of 4 bits
function formatBinary(num, size = 32) {
  // Convert to binary string, pad to size bits (MSB to LSB)
  return BigInt(num)
    .toString(2)
    .padStart(size, "0")
    .match(/.{1,4}/g) // Group into sets of 4 bits
    .join(" ");
}

// Function to format a single bit position
function formatSingleBitField(position) {
  // Shift 1 left by position bits (counting from right, LSB = 0)
  const value = 1n << BigInt(position);
  return formatBinary(value);
}

// Function to update the step-by-step analysis
function updateStepAnalysis(hand, s, v, s_normalized, resultIndex) {
  const stepAnalysis = document.getElementById("stepAnalysis");
  stepAnalysis.classList.remove("hidden");

  // Step 1: Initial Hand
  const handDetails = document.querySelector("#step1 .hand-details");
  handDetails.innerHTML = hand
    .map((card) => {
      const rankStr = rankMap[card.rank];
      const suitStr = suitSymbols[card.suit];
      return `
      <div class="card-detail mb-2">
        <span class="font-mono">${rankStr}${suitStr}</span>
        <span class="text-gray-400 ml-4">Rank: ${card.rank}</span>
        <div class="mt-1 font-mono text-sm">
          Bit ${card.rank} (1 << ${card.rank}) = ${formatSingleBitField(
        card.rank
      )}
        </div>
      </div>
    `;
    })
    .join("");

  // Step 2: Bit Field Construction
  const bitField = document.querySelector("#step2 .bit-field");
  const bitExplanation = document.querySelector("#step2 .bit-explanation");

  // Show the combined bit field
  bitField.innerHTML = `
    <div class="mb-2">Combined Bit Field (s):</div>
    <div class="font-mono mb-2 text-emerald-400">${formatBinary(s)}</div>
    <div class="text-gray-400">Hex: 0x${s.toString(16).toUpperCase()}</div>
  `;

  // Show how each card contributes to the field
  bitExplanation.innerHTML = `
    <div class="mb-2">How each card's rank sets its bit:</div>
    ${hand
      .map(
        (card) => `
      <div class="ml-4 mt-2 font-mono text-sm">
        ${rankMap[card.rank]}${suitSymbols[card.suit]}: Bit ${card.rank}
        <div class="mt-1 text-emerald-400">${formatSingleBitField(
          card.rank
        )}</div>
      </div>
    `
      )
      .join("")}
  `;

  // Step 3: Rank Pattern Analysis
  const patternDetails = document.querySelector("#step3 .pattern-details");
  const straightCheck = document.querySelector("#step3 .straight-check");
  const flushCheck = document.querySelector("#step3 .flush-check");

  // Check for straight
  const isStraight = s_normalized === 31 || s === 0x403c;
  const isAceLow = s === 0x403c;

  // Check for flush
  const isFlush = hand.every((card) => card.suit === hand[0].suit);

  // Calculate nibble values for each rank
  const nibbleValues = hand.reduce((acc, card) => {
    acc[card.rank] = (acc[card.rank] || 0) + 1;
    return acc;
  }, {});

  patternDetails.innerHTML = `
    <div class="mb-2">1. Normalized Pattern:</div>
    <div class="font-mono mb-2 text-emerald-400">${formatBinary(
      s_normalized
    )}</div>
    <div class="text-gray-400 mb-4">This is the bit pattern shifted right to its lowest set bit.</div>

    <div class="mb-2">2. Value (v) Calculation:</div>
    <div class="font-mono text-sm space-y-2">
      ${Object.entries(nibbleValues)
        .map(([rank, count]) => {
          const offset = BigInt(2) ** BigInt(rank * 4);
          return `
            <div class="mb-2 bg-gray-800/50 p-2 rounded">
              <div>Rank ${rank} (${
            rankMap[rank]
          }) appears ${count} time(s):</div>
              <div class="ml-4">• Position: ${rank} * 4 = ${rank * 4} bits</div>
              <div class="ml-4">• Offset: 2^${
                rank * 4
              } = ${offset.toString()}</div>
              <div class="ml-4">• Nibble value: ${count}</div>
            </div>
          `;
        })
        .join("")}
    </div>

    <div class="mt-4 mb-2">3. Final Value Calculation:</div>
    <div class="text-gray-400 space-y-2">
      <div>• Raw v = ${v.toLocaleString()}</div>
      <div>• Modulo 15 = ${v % 15}</div>
      <div class="mt-2 text-sm">The value v is built by accumulating 4-bit nibbles for each rank,
      where each nibble stores the count of cards of that rank. The modulo 15 operation then
      maps this to a unique index for each hand type.</div>
    </div>
  `;

  straightCheck.innerHTML = `
    <div class="mb-2">Straight Detection:</div>
    <div class="font-mono mb-2">${
      isStraight
        ? `<span class="text-emerald-400">✓ Straight detected${
            isAceLow ? " (Ace-low)" : ""
          }</span>`
        : `<span class="text-red-500">✗ Not a straight - bits not consecutive</span>`
    }</div>
    ${
      isAceLow
        ? `<div class="font-mono text-sm">Special case: 0x403c = <span class="text-emerald-400">${formatBinary(
            0x403c
          )}</span></div>`
        : ""
    }
    <div class="text-sm text-gray-400 mt-2">
      A straight is detected in two ways:
      <div class="ml-4 mt-1">1. Five consecutive bits (s/lowest_bit = 31)</div>
      <div class="ml-4">2. Special case for A,2,3,4,5 (s = 0x403c)</div>
    </div>
  `;

  flushCheck.innerHTML = `
    <div class="mb-2">Flush Detection:</div>
    <div class="font-mono mb-2">${
      isFlush
        ? `<span class="text-emerald-400">✓ Flush detected - all suits match (${
            suitSymbols[hand[0].suit]
          })</span>`
        : `<span class="text-red-500">✗ Not a flush - suits don't match</span>`
    }</div>
    <div class="text-sm text-gray-400 mt-2">
      Flush check compares first suit with OR of others:
      <div class="ml-4 mt-1">• First suit: ${hand[0].suit} (${
    suitSymbols[hand[0].suit]
  })</div>
      <div class="ml-4">• Other suits: ${hand
        .slice(1)
        .map((c) => suitSymbols[c.suit])
        .join(", ")}</div>
    </div>
  `;

  // Step 4: Final Calculation
  const calcDetails = document.querySelector("#step4 .calculation-details");
  const finalResult = document.querySelector("#step4 .final-result");

  calcDetails.innerHTML = `
    <div class="space-y-2">
      <div class="mb-2">Base Value: ${v % 15}</div>
      <div class="mb-2">Straight Adjustment: ${isStraight ? "-3" : "-1"}</div>
      <div class="mb-2">Flush Adjustment: ${isFlush ? "-1" : "0"}</div>
      <div class="mt-4 font-mono">Final Index: ${resultIndex}</div>
    </div>
  `;

  finalResult.textContent = `Final Hand Rank: ${hands[resultIndex]}`;
}

function rankPokerHand(cs, ss) {
  var v,
    i,
    o,
    s =
      (1 << cs[0]) | (1 << cs[1]) | (1 << cs[2]) | (1 << cs[3]) | (1 << cs[4]);

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

  const cardRanksInput = hand.map((card) => card.rank);
  const cardSuitsInput = hand.map((card) => card.suit);

  const handDisplay = document.getElementById("handDisplay");
  const resultDisplay = document.getElementById("resultDisplay");

  handDisplay.innerHTML = "";
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
    updateStepAnalysis(
      hand,
      result.s,
      result.v,
      result.s_normalized,
      result.resultIndex
    );
  } catch (error) {
    console.error("Error analyzing hand:", error);
    resultDisplay.textContent = "Error analyzing hand. Check console.";
    resultDisplay.className = "text-center font-semibold text-xl text-red-500";
  }
}
