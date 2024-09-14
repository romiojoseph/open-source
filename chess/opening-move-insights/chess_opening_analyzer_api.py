import requests
import chess.pgn
from tabulate import tabulate
from collections import defaultdict
import textwrap
import io

def analyze_chess_games():
    # Description of the script
    print("=== Chess opening analyzer ===")
    print()
    print("It will analyze chess games from Lichess to extract and display statistics about the openings and terminations of chess games.")
    print()

    # Prompt user to enter a Lichess username
    username = input("Enter a Lichess username: ")

    # Make API call to retrieve chess games
    url = f"https://lichess.org/api/games/user/{username}?tags=true&clocks=false&evals=false&opening=true"
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Error retrieving chess games for user {username}. Exiting...")
        return

    # Initialize dictionary to store results (using opening name as key)
    openings = defaultdict(lambda: {'won': 0, 'loss': 0, 'draw': 0, 'terminations': defaultdict(int)})
    results = {'total_games': 0, 'won': 0, 'loss': 0, 'draw': 0}

    # Analyze chess games
    pgn = io.StringIO(response.text)
    while True:
        game = chess.pgn.read_game(pgn)
        if game is None:
            break
        results['total_games'] += 1

        # Get opening name
        opening_name = game.headers.get('Opening', 'Unknown Opening')

        # Get termination reason
        termination = game.headers.get('Termination', 'Unknown Termination')

        # Get game result
        result = game.headers['Result']
        if game.headers['White'] == username:
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
    print(f"Chess openings analyzed from Lichess games played by {username}")
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
    analyze_chess_games()