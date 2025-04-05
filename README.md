# Poker Hand Analyzer

An interactive web application that demonstrates poker hand analysis using bit manipulation. This implementation is based on the brilliant bit manipulation technique described in [this CodeProject article](https://www.codeproject.com/Articles/569271/A-Poker-hand-analyzer-in-JavaScript-using-bit-math) by subskybox.

## Original Implementation

The core algorithm that inspired this interactive visualization is remarkably concise:

```javascript
hands = [
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
var A = 14,
  K = 13,
  Q = 12,
  J = 11,
  _ = { "♠": 1, "♣": 2, "♥": 4, "♦": 8 };

function rankPokerHand(cs, ss) {
  var v,
    i,
    o,
    s =
      (1 << cs[0]) | (1 << cs[1]) | (1 << cs[2]) | (1 << cs[3]) | (1 << cs[4]);
  for (i = -1, v = o = 0; i < 5; i++, o = Math.pow(2, cs[i] * 4)) {
    v += o * (((v / o) & 15) + 1);
  }
  v = (v % 15) - (s / (s & -s) == 31 || s == 0x403c ? 3 : 1);
  v -= (ss[0] == (ss[1] | ss[2] | ss[3] | ss[4])) * (s == 0x7c00 ? -5 : 1);
  return hands[v];
}
```

Source: [@CodeProject](https://www.codeproject.com/Articles/569271/A-Poker-hand-analyzer-in-JavaScript-using-bit-math)

## Features

- Interactive card dealing and hand analysis
- Step-by-step visualization of the bit manipulation process
- Detailed explanations of how each poker hand is detected
- Comprehensive validation and error checking
- Debug logging for analysis verification

## Debug & Validation

The analyzer includes extensive debug logging and validation:

### Debug Logging

- Input validation and preprocessing
- Rank bit field generation
- Step-by-step hand value calculation
- Straight and flush detection
- Final hand value computation

### Validation Checks

- Card count validation (must be exactly 5 cards)
- Rank validation (2-14, where 14 is Ace)
- Suit validation (♠=1, ♣=2, ♥=4, ♦=8)
- Input array validation
- Bit field consistency checks

### Console Output

Example debug output for a Royal Flush:

```javascript
Input: { cards: [14, 13, 12, 11, 10], suits: [1, 1, 1, 1, 1] }
Rank bit field: 00000000000001111100000000000000
Step 1: { cardRank: "init", offset: 0, prevValue: 0, newValue: 0, groupCount: 0 }
...
Final value: 7
```

To view debug information:

1. Open browser developer tools (F12)
2. Go to Console tab
3. Deal a new hand or analyze existing hand
4. Review the step-by-step analysis

## Building and Running

### 1. Building

This is a static web application that needs to be built before serving:

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

### 2. Serving

You have several options for serving the built application:

#### Option 1: Using Node.js

```bash
# Using http-server (Node.js)
npm install -g http-server
http-server ./dist

# Or using serve (Node.js)
npm install -g serve
serve ./dist
```

#### Option 2: Using Python

```bash
# Using Python 3's built-in server
python3 -m http.server --directory ./dist

# Or using Python 2
python -m SimpleHTTPServer
```

#### Option 3: Using PHP

```bash
# Using PHP's built-in server
php -S localhost:8000 -t ./dist
```

The application will be available at `http://localhost:8000` (or whatever port your chosen server uses).

## How It Works

The application visualizes a poker hand analyzer that uses clever bit manipulation to determine poker hands. Here's how it works:

1. **Card Representation**

   - Each card's rank is represented as a bit position (2-14, where 14 is Ace)
   - Suits are represented as bit flags (1=♠, 2=♣, 4=♥, 8=♦)

2. **Pattern Detection**

   - Straights are detected by checking for 5 consecutive set bits
   - Flushes are detected by comparing suit flags
   - Pairs/Three-of-a-kind/Four-of-a-kind are detected using bit counting

3. **Visualization**
   - Each step of the analysis is shown with binary representations
   - Set bits are highlighted to show which positions matter
   - Explanations are provided for each operation

## Technical Details

The analyzer uses several bit manipulation techniques:

- Bit fields to track card ranks
- Normalization using `s/(s&-s)` to detect straights
- Parallel counting using modulo with Mersenne numbers
- Special case handling for Ace-low straights

## License

This project is licensed under the MIT License - see the LICENSE file for details.

The original poker hand analysis algorithm is from [CodeProject](https://www.codeproject.com/Articles/569271/A-Poker-hand-analyzer-in-JavaScript-using-bit-math) and is licensed under the Code Project Open License (CPOL).
