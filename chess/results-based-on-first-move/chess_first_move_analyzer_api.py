import chess.pgn
import io
import requests

def analyze_games(username):
    white_openings = {}
    black_openings = {}
    stats = {
        'total': 0,
        'wins': {'white': 0, 'black': 0},
        'losses': {'white': 0, 'black': 0},
        'draws': {'white': 0, 'black': 0}
    }

    url = f"https://lichess.org/api/games/user/{username}?tags=true&clocks=false&evals=false&opening=true"
    response = requests.get(url)
    pgn_content = response.text

    pgn_io = io.StringIO(pgn_content)

    while True:
        game = chess.pgn.read_game(pgn_io)
        if game is None:
            break

        stats['total'] += 1

        # Check if username exists in either White or Black headers
        if username in game.headers.get("White", "") or username in game.headers.get("Black", ""):
            player_color = 'white' if game.headers["White"] == username else 'black'

            # Check if the game's variations list is not empty
            if game.variations:
                first_move = game.variations[0].move
                move_str = game.board().san(first_move)

                if player_color == "white":
                    if move_str not in white_openings:
                        white_openings[move_str] = {'total_games': 0, 'wins': 0, 'losses': 0, 'draws': 0}
                    white_openings[move_str]['total_games'] += 1
                else:
                    if move_str not in black_openings:
                        black_openings[move_str] = {'total_games': 0, 'wins': 0, 'losses': 0, 'draws': 0}
                    black_openings[move_str]['total_games'] += 1

                result = game.headers["Result"]
                if result == "1-0":
                    if player_color == "white":
                        stats['wins']['white'] += 1
                        if move_str in white_openings:
                            white_openings[move_str]['wins'] += 1
                    else:
                        stats['losses']['black'] += 1
                        if move_str in black_openings:
                            black_openings[move_str]['losses'] += 1
                elif result == "0-1":
                    if player_color == "black":
                        stats['wins']['black'] += 1
                        if move_str in black_openings:
                            black_openings[move_str]['wins'] += 1
                    else:
                        stats['losses']['white'] += 1
                        if move_str in white_openings:
                            white_openings[move_str]['losses'] += 1
                else:  # Draw
                    stats['draws'][player_color] += 1
                    if player_color == "white" and move_str in white_openings:
                        white_openings[move_str]['draws'] += 1
                    elif player_color == "black" and move_str in black_openings:
                        black_openings[move_str]['draws'] += 1
            else:
                print(f"Warning: Game has no variations. Skipping this game.")
        else:
            print(f"Warning: Username '{username}' not found in game headers. Skipping this game.")

    opening_results = {}
    for move in set(white_openings.keys()) | set(black_openings.keys()):
        white_stats = white_openings.get(move, {'total_games': 0, 'wins': 0, 'losses': 0, 'draws': 0})
        black_stats = black_openings.get(move, {'total_games': 0, 'wins': 0, 'losses': 0, 'draws': 0})

        opening_results[move] = {
            'total_games': white_stats['total_games'] + black_stats['total_games'],
            'wins': white_stats['wins'] + black_stats['wins'],
            'losses': white_stats['losses'] + black_stats['losses'],
            'draws': white_stats['draws'] + black_stats['draws']
        }

    return white_openings, black_openings, stats  # Return white_openings and black_openings separately

def print_results(white_openings, black_openings, game_stats):  # Pass white_openings and black_openings separately
    print("\n=== Chess Game Analyzer ===")
    print()
    print("\n#1.0 Overall Performance")
    print()
    total_games = game_stats['total']
    wins = game_stats['wins']['white'] + game_stats['wins']['black']
    wins_black = game_stats['wins']['black']
    wins_white = game_stats['wins']['white']
    losses = game_stats['losses']['white'] + game_stats['losses']['black']
    losses_black = game_stats['losses']['black']
    losses_white = game_stats['losses']['white']
    draws = game_stats['draws']['white'] + game_stats['draws']['black']
    draws_black = game_stats['draws']['black']
    draws_white = game_stats['draws']['white']

    print(f"Total games played: {total_games}")
    print()
    print(f"{' ':<10}{'Total':<10}{'Black':<10}{'White':<10}")
    print("-" * 40)
    print(f"{'Wins':<10}{wins:<10}{wins_black:<10}{wins_white:<10}")
    print(f"{'Losses':<10}{losses:<10}{losses_black:<10}{losses_white:<10}")
    print(f"{'Draws':<10}{draws:<10}{draws_black:<10}{draws_white:<10}")
    print()
    print()
    print("\n#2.1 Opening Statistics as White")
    print()
    print(f"{'Opening':<12}{'Games':<12}{'Wins':<8}{'Losses':<8}{'Draws':<8}")
    print("-" * 52)
    for move, stats in white_openings.items():  # Iterate through white_openings
        print(f"{move:<12}{stats['total_games']:<12}{stats['wins']:<8}{stats['losses']:<8}{stats['draws']:<8}")

    print()

    print("\n#2.2 Opening Statistics as Black")
    print("NB: This table shows how you perform against White's openings, not your own openings as Black.")
    print()
    print(f"{'Opening':<12}{'Games':<12}{'Wins':<8}{'Losses':<8}{'Draws':<8}")
    print("-" * 52)
    for move, stats in black_openings.items():  # Iterate through black_openings
        print(f"{move:<12}{stats['total_games']:<12}{stats['wins']:<8}{stats['losses']:<8}{stats['draws']:<8}")

# Prompt the user for their Lichess username
username = input("Enter your Lichess username: ")

# Analyze the games and print the results
white_openings, black_openings, game_stats = analyze_games(username)
print_results(white_openings, black_openings, game_stats)

input("Press Enter to exit...")