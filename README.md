# Mechapuzzle

Mechapuzzle is a web-based tool for analyzing crossword puzzle files. It provides insights into grid structure, letter distribution, clue lengths, and potential theme elements.

## Features

- **File Support:** Supports `.puz`, `.xml`, `.jpz`, `.ipuz`, and other common crossword formats.
- **Interactive Grid:** Visualize the puzzle grid with hover tooltips for clues and the ability to highlight specific letters.
- **Statistical Analysis:**
    - **Letter Frequency:** Compare the puzzle's letter distribution against a standard English crossword distribution.
    - **Clue Lengths:** Statistics on word counts in clues.
    - **Entry Lengths:** distribution of answer lengths.
- **Theme Analysis:** Identifies potential theme entries based on length, starred clues, and common substrings.
- **Modern Interface:** Clean, tabbed interface with drag-and-drop file support.

## Technologies Used

- **Chart.js:** For interactive data visualization.
- **JSCrossword:** For parsing various crossword file formats.
- **Vanilla JavaScript & CSS:** No heavy frameworks, ensuring fast load times.

## How to Use

1.  Open `index.html` in a modern web browser.
2.  Drag and drop a crossword file onto the upload zone, or click the "Select File" button.
3.  Navigate through the tabs (Grid, Theme, Clues, Entries, Rawdata) to explore the analysis.

## Development

The project is structured with a clear separation of concerns:
- `js/grid.js`: Grid rendering and letter frequency logic.
- `js/clues.js`: Clue analysis and listing.
- `js/entries.js`: Answer/entry length statistics.
- `js/theme.js`: Heuristics for theme detection.
- `css/styles.css`: Modernized styling using CSS variables.

---
*Mechapuzzle - A tool for crossword enthusiasts and constructors.*
