_Script created using Google AI Studio and Mistral AI._

# Lichess PGN Analyzer

This script analyzes a PGN (Portable Game Notation) file containing chess games and generates CSV files with detailed game information. It also displays and saves various statistics about the games. I created this script to cross check [a project](https://romiojoseph.github.io/lichess-pgn-analyzer) I was working on.

## Features

- Generates CSV files for total games, games played as white, and games played as black.
- Displays and saves statistics including:
    - Total games played
    - Total wins, losses, and draws
    - Total times the user and opponent resigned
    - Total times the user and opponent timed out
    - Statistics for games played as white and black
    - Event-specific statistics
    - Time control-specific statistics
    - Opponent level-specific statistics
## Requirements

- Python 3.x
- `chess` library (install via `pip install python-chess`)

## Usage

1. Ensure the PGN file is named in the format `username_games.pgn`.
2. Open a terminal where the script is saved and run the script and provide the path to the PGN file when prompted.

`python analyze_pgn.py`

## Output

- CSV files: `total_games.csv`, `white_games.csv`, `black_games.csv`
- Statistics displayed in the terminal
- Statistics saved to `results.json`

*If you find any irregularities or errors, please let me know.*