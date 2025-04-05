# JavaScript Poker Hand Analyzer

This project visualizes how binary bit manipulation can analyze a 5-card poker hand with surprising efficiency.

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

## How It Works

The analyzer uses bitwise operations to identify poker hands through four simple steps:

1. **Card Encoding**: Each card is represented as a 32-bit binary number where:

   - One bit is set for rank (positions 2-14)
   - One bit is set for suit (positions 0-3)

2. **Pattern Merging**: All 5 cards are combined using bitwise OR, creating a 32-bit pattern showing all ranks and suits present in the hand.

3. **Straight Detection**: The algorithm checks if set rank bits are consecutive by:

   - Finding the lowest set bit
   - Dividing the pattern by this value
   - Checking if the result equals 31 (binary: 11111)
   - Special case for A-2-3-4-5 straight

4. **Pattern Analysis**: Additional calculations detect other hand patterns (pairs, three of a kind, etc.) using clever grouping of bits.

## Interactive Demo

Try the [live demo](https://poker-analyzer.netlify.app/) to see the analyzer in action!

## Features

- Interactive card dealing and hand analysis
- Step-by-step visualization of the bit manipulation process
- Detailed explanations of how each poker hand is detected
- Comprehensive validation and error checking
- Debug logging for analysis verification
- Smart tooltips for technical terms with clear explanations
- Full 32-bit binary representation with color-coded bits for ranks and suits
- Visual indicators for detected patterns (straights, flushes, pairs, etc.)

## Related Resources

If you're interested in learning more about the binary and bitwise concepts used in this project:

- [JavaScript Bitwise Operations Guide](https://js-bitwise.netlify.app/) - A comprehensive tutorial on bitwise operators in JavaScript
- [Binary Number Cheat Sheet](https://binary-cheat.netlify.app/) - A reference guide for understanding binary representation and number systems

## Demo

https://poker-analyzer.netlify.app/

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

## Recent Enhancements

- Added comprehensive tooltips for technical terms throughout the application
- Improved binary representation with full 32-bit display and no truncation
- Enhanced UI with responsive design and better mobile support
- Added links to related resources for learning more about binary and bitwise operations
- Improved visual feedback for different poker hand patterns

## Building and Running

### 1. Building

This is a static web application that needs to be built before serving. You can use any of the following package managers:

#### Using NPM

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

#### Using Yarn

```bash
# Install dependencies
yarn install

# Build the application
yarn build
```

#### Using PNPM

```bash
# Install PNPM if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install

# Build the application
pnpm build
```

### 2. Serving

You have several options for serving the built application:

#### Option 1: Using Development Server

```bash
# NPM
npm run dev

# Yarn
yarn dev

# PNPM
pnpm dev
```

#### Option 2: Using Node.js Static Servers

```bash
# Using http-server (Node.js)
npm install -g http-server
http-server ./dist

# Or using serve (Node.js)
npm install -g serve
serve ./dist
```

#### Option 3: Using Python

```bash
# Using Python 3's built-in server
python3 -m http.server --directory ./dist

# Or using Python 2
python -m SimpleHTTPServer
```

#### Option 4: Using PHP

```bash
# Using PHP's built-in server
php -S localhost:8000 -t ./dist
```

The application will be available at `http://localhost:8000` (or whatever port your chosen server uses).

### Development Requirements

- Node.js 16.x or higher
- NPM 7.x or higher, Yarn 1.22.x or higher, or PNPM 6.x or higher

## Technical Details

The analyzer uses several bit manipulation techniques:

- Bit fields to track card ranks
- Normalization using `s/(s&-s)` to detect straights
- Parallel counting using modulo with Mersenne numbers
- Special case handling for Ace-low straights

### Understanding Bit Shifts

When you see code like `s = 1<<cs[0]|1<<cs[1]`, here's what it means in plain English:

1. **Left Shift (`1<<cs[0]`)**:

   - Start with the number 1 (binary: 00000001)
   - Shift it left by cs[0] positions
   - This creates a binary number with a single 1 at position cs[0]
   - Example: If cs[0] is 5, you get 00100000 (decimal 32)

2. **Combining with OR (`|`)**:
   - The `|` symbol combines binary numbers, setting a bit to 1 if it's 1 in either number
   - In `1<<cs[0]|1<<cs[1]`, we're creating a binary number with 1s at positions cs[0] and cs[1]
   - Example: If cs[0]=5 and cs[1]=7, you get 10100000 (1s at positions 5 and 7)

In the poker context, this efficiently creates a "fingerprint" of card ranks. The line:

```javascript
s = (1 << cs[0]) | (1 << cs[1]) | (1 << cs[2]) | (1 << cs[3]) | (1 << cs[4]);
```

Creates a single 32-bit integer where each 1 represents a card rank present in the hand.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

The original poker hand analysis algorithm is from [CodeProject](https://www.codeproject.com/Articles/569271/A-Poker-hand-analyzer-in-JavaScript-using-bit-math) and is licensed under the Code Project Open License (CPOL).
