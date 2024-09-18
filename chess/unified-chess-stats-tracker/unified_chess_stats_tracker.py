import requests
import json
from tabulate import tabulate

def fetch_chess_com_stats(username):
    url = f"https://api.chess.com/pub/player/{username}/stats"
    headers = {'User-Agent': 'Chess Stats Fetcher'}
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Error: Unable to fetch statistics for {username} on Chess.com. Status code: {response.status_code}")
        return None

def fetch_lichess_perf_stats(username, perf):
    url = f"https://lichess.org/api/user/{username}/perf/{perf}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Error: Unable to fetch statistics for {username} in {perf}. Status code: {response.status_code}")
        return None

def main():
    print("\nUnified Chess Stats Tracker")
    print("-------------------------------")
    print("Track your wins, losses, draws, and total games across Chess.com and Lichess.org in rapid, blitz and bullet formats with real-time combined statistics.")

    while True:
        same_user = input("\nDo you have the same username on Chess.com and Lichess? (y/n): ").strip().lower()
        if same_user in ['y', 'n']:
            break
        else:
            print("Please enter 'y' for Yes or 'n' for No.")

    if same_user == "y":
        print()
        username = input("Enter your username: ")
        chess_com_stats = fetch_chess_com_stats(username)
    else:
        print()
        chess_com_username = input("Enter your Chess.com username: ")
        username = input("Enter your Lichess username: ")
        chess_com_stats = fetch_chess_com_stats(chess_com_username)

    performance_types = ["bullet", "blitz", "rapid"]
    lichess_data = []

    total_wins_lichess = 0
    total_losses_lichess = 0
    total_draws_lichess = 0
    total_games_lichess = 0

    for perf in performance_types:
        lichess_stats = fetch_lichess_perf_stats(username, perf)

        if lichess_stats:
            wins = lichess_stats['stat']['count'].get('win', 0)
            losses = lichess_stats['stat']['count'].get('loss', 0)
            draws = lichess_stats['stat']['count'].get('draw', 0)
            rating = lichess_stats['perf']['glicko']['rating'] if 'glicko' in lichess_stats['perf'] else 'N/A'
            total_games = lichess_stats['stat']['count'].get('all', 0)

            lichess_data.append([perf.capitalize(), rating, wins, losses, draws, total_games])

            total_wins_lichess += wins
            total_losses_lichess += losses
            total_draws_lichess += draws
            total_games_lichess += total_games

    if chess_com_stats:
        chess_com_data = []

        total_wins_chess_com = 0
        total_losses_chess_com = 0
        total_draws_chess_com = 0
        total_games_chess_com = 0

        for game_mode, data in chess_com_stats.items():
            if game_mode.startswith("chess_"):
                game_mode = game_mode[6:]
                wins = data['record']['win']
                losses = data['record']['loss']
                draws = data['record']['draw']
                total_games = wins + losses + draws

                chess_com_data.append([game_mode.capitalize(), data['last']['rating'], wins, losses, draws, total_games])

                total_wins_chess_com += wins
                total_losses_chess_com += losses
                total_draws_chess_com += draws
                total_games_chess_com += total_games

        overall_total_games_played = total_games_lichess + total_games_chess_com
        overall_total_wins = total_wins_lichess + total_wins_chess_com
        overall_total_losses = total_losses_lichess + total_losses_chess_com
        overall_total_draws = total_draws_lichess + total_draws_chess_com

        win_percentage = (overall_total_wins / overall_total_games_played * 100) if overall_total_games_played > 0 else 0
        loss_percentage = (overall_total_losses / overall_total_games_played * 100) if overall_total_games_played > 0 else 0
        draw_percentage = (overall_total_draws / overall_total_games_played * 100) if overall_total_games_played > 0 else 0

        desired_order = ['Rapid', 'Blitz', 'Bullet']

        # Filter out unwanted game modes
        chess_com_data_filtered = [x for x in chess_com_data[:-1] if x[0] in desired_order]

        # Sort the filtered data
        chess_com_data_sorted = sorted(chess_com_data_filtered, key=lambda x: desired_order.index(x[0]))
        chess_com_data_sorted.append(chess_com_data[-1])

        lichess_data.append(["Total", "", total_wins_lichess, total_losses_lichess, total_draws_lichess, total_games_lichess])
        lichess_data_sorted = sorted(lichess_data[:-1], key=lambda x: desired_order.index(x[0]))
        lichess_data_sorted.append(lichess_data[-1])

        chess_com_headers = ["Game Mode", "Rating", "Wins", "Losses", "Draws", "Total"]
        lichess_headers = ["Game Mode", "Rating", "Wins", "Losses", "Draws", "Total"]

        print("\nTotal summary across both platforms")
        print("-------------------------------------")
        print(f"Total games played: {overall_total_games_played}")
        print(f"Total wins: {overall_total_wins} ({win_percentage:.1f}%)")
        print(f"Total losses: {overall_total_losses} ({loss_percentage:.1f}%)")
        print(f"Total draws: {overall_total_draws} ({draw_percentage:.1f}%)")

        print("\nChess.com statistics")
        print("---------------------")
        print(tabulate(chess_com_data_sorted, chess_com_headers, tablefmt="grid"))

        print("\nLichess statistics")
        print("-------------------")
        print(tabulate(lichess_data_sorted, lichess_headers, tablefmt="grid"))

    while True:
        user_input = input("\nPress any key to continue or 'q' to quit: ").strip().lower()

        if user_input == 'q':
            print("Exiting the program...")
            break

        main()

if __name__ == "__main__":
    main()