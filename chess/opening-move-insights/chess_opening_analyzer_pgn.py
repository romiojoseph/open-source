import os
import chess.pgn
from tabulate import tabulate
from collections import defaultdict
import textwrap

def analyze_pgn_files():
    # Description of the script
    print("=== Chess opening analyzer ===")
    print()
    print("It will analyze PGN files to extract and display statistics about the openings and terminations of chess games.")
    print("Note: This script works best with PGN files exported from Lichess.")
    print()

    # Get list of PGN files in directory
    pgn_files = [f for f in os.listdir() if f.endswith('.pgn')]

    if not pgn_files:
        print("No PGN files found in the current directory.")
        return

    # Prompt user to select a PGN file
    print("Select a PGN file to analyze:")
    for i, f in enumerate(pgn_files):
        print(f"{i+1}. {f}")
    choice = int(input("Enter the number of your choice: "))

    if choice < 1 or choice > len(pgn_files):
        print("Invalid choice. Exiting...")
        return

    pgn_file = pgn_files[choice - 1]

    # Extract username from PGN file name
    username = os.path.splitext(pgn_file)[0]

    # Initialize dictionary to store results (using opening name as key)
    openings = defaultdict(lambda: {'won': 0, 'loss': 0, 'draw': 0, 'terminations': defaultdict(int)})
    results = {'total_games': 0, 'won': 0, 'loss': 0, 'draw': 0}

    # Analyze PGN file
    try:
        with open(pgn_file, 'r') as f:
            while True:
                pgn = chess.pgn.read_game(f)
                if pgn is None:
                    break
                results['total_games'] += 1

                # Get opening name (assuming it's in the PGN headers)
                opening_name = pgn.headers.get('Opening', 'Unknown Opening')

                # Get termination reason
                termination = pgn.headers.get('Termination', 'Unknown Termination')

                # Get game result
                result = pgn.headers['Result']
                if pgn.headers['White'] == username:
                    if result == '1-0':
                        openings[opening_name]['won'] += 1
                        results['won'] += 1
                    elif result == '0-1':
                        openings[opening_name]['loss'] += 1
                        results['loss'] += 1
                    elif result == '1/2-1/2':
                        openings[opening_name]['draw'] += 1
                        results['draw'] += 1
                else:
                    if result == '0-1':
                        openings[opening_name]['won'] += 1
                        results['won'] += 1
                    elif result == '1-0':
                        openings[opening_name]['loss'] += 1
                        results['loss'] += 1
                    elif result == '1/2-1/2':
                        openings[opening_name]['draw'] += 1
                        results['draw'] += 1

                # Update termination counts
                openings[opening_name]['terminations'][termination] += 1

    except Exception as e:
        print(f"Error reading PGN file: {e}")
        return

    # Prepare data for tabulate
    table_data = []
    max_width = 40  # Maximum width for opening name column
    for opening_name, stats in sorted(openings.items(), key=lambda x: x[0]):
        total_games = stats['won'] + stats['loss'] + stats['draw']
        won = stats['won']
        loss = stats['loss']
        draw = stats['draw']
        terminations = ', '.join([f"{term} ({count})" for term, count in stats['terminations'].items()])
        # Wrap opening name if it exceeds maximum width
        wrapped_opening_name = '\n'.join(textwrap.wrap(opening_name, width=max_width))
        table_data.append([wrapped_opening_name, won, loss, draw, terminations, total_games])

    # Add numbering column
    table_data = [[i] + row for i, row in enumerate(table_data, start=1)]

    # Print results
    print()
    print("Openings as per Lichess PGN files")
    print()
    print(f"Total games played: {results['total_games']}")
    print(f"Total won: {results['won']}")
    print(f"Total loss: {results['loss']}")
    print(f"Total draw: {results['draw']}")
    print()
    print(tabulate(table_data, headers=['#', 'Opening', 'Won', 'Loss', 'Draw', 'Termination', 'Total Games']))

    # Wait for user input before closing
    input("Press Enter to exit...")

if __name__ == '__main__':
    analyze_pgn_files()