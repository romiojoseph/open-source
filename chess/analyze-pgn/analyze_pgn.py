import chess.pgn
import os
import csv
import json
from collections import defaultdict

def extract_username(file_path):
    base_name = os.path.basename(file_path)
    parts = base_name.split('_')
    if len(parts) >= 2:
        return parts[1]
    return None

def analyze_pgn(file_path):
    username = extract_username(file_path)
    if not username:
        print("Unable to extract username from file name.")
        return

    total_games = []
    white_games = []
    black_games = []

    stats = {
        "total_games": 0,
        "total_won": 0,
        "total_loss": 0,
        "total_draw": 0,
        "total_user_resigned": 0,
        "total_opponent_resigned": 0,
        "total_user_timeout": 0,
        "total_opponent_timeout": 0,
        "white_stats": defaultdict(int),
        "black_stats": defaultdict(int),
        "event_stats": defaultdict(lambda: defaultdict(int)),
        "time_control_stats": defaultdict(lambda: defaultdict(int)),
        "opponent_level_stats": defaultdict(lambda: defaultdict(int))
    }

    with open(file_path, 'r') as pgn_file:
        while True:
            game = chess.pgn.read_game(pgn_file)
            if game is None:
                break

            headers = game.headers
            result = headers["Result"]
            white = headers["White"]
            black = headers["Black"]

            try:
                white_elo = int(headers.get("WhiteElo"))
                black_elo = int(headers.get("BlackElo"))
            except (ValueError, TypeError):
                white_elo = None
                black_elo = None

            opponent_elo = black_elo if white == username else white_elo
            opponent_level = determine_opponent_level(opponent_elo)

            game_data = {
                "Event": headers.get("Event", ""),
                "Site": headers.get("Site", ""),
                "Date": headers.get("Date", ""),
                "White": white,
                "Black": black,
                "UserPlayedAs": "White" if white == username else "Black",
                "OpponentLevel": opponent_level,
                "OpponentElo": opponent_elo,
                "Result": result,
                "TimeControl": headers.get("TimeControl", ""),
                "Opening": headers.get("Opening", ""),
                "Termination": headers.get("Termination", ""),
                "Outcome": determine_outcome(username, white, black, result),
                "UserResigned": "No",
                "UserResignedComment": "",
                "OpponentResigned": "No",
                "OpponentResignedComment": "",
                "UserTimeout": "No",
                "UserTimeoutComment": "",
                "OpponentTimeout": "No",
                "OpponentTimeoutComment": ""
            }

            comments = []
            node = game
            while node.variations:
                node = node.variations[0]
                if node.comment:
                    comments.append(node.comment)

            game_data["UserResigned"], game_data["UserResignedComment"], game_data["OpponentResigned"], game_data["OpponentResignedComment"], game_data["UserTimeout"], game_data["UserTimeoutComment"], game_data["OpponentTimeout"], game_data["OpponentTimeoutComment"] = determine_conditions(username, white, black, comments)

            total_games.append(game_data)

            if white == username:
                white_games.append(game_data)
                stats["white_stats"]["Total Games"] += 1
                if game_data["Outcome"] == "Win":
                    stats["white_stats"]["Wins"] += 1
                elif game_data["Outcome"] == "Loss":
                    stats["white_stats"]["Losses"] += 1
                elif game_data["Outcome"] == "Draw":
                    stats["white_stats"]["Draws"] += 1
                if game_data["UserResigned"] == "Yes":
                    stats["white_stats"]["User Resigned"] += 1
                if game_data["OpponentResigned"] == "Yes":
                    stats["white_stats"]["Opponent Resigned"] += 1
                if game_data["UserTimeout"] == "Yes":
                    stats["white_stats"]["User Timeout"] += 1
                if game_data["OpponentTimeout"] == "Yes":
                    stats["white_stats"]["Opponent Timeout"] += 1
            elif black == username:
                black_games.append(game_data)
                stats["black_stats"]["Total Games"] += 1
                if game_data["Outcome"] == "Win":
                    stats["black_stats"]["Wins"] += 1
                elif game_data["Outcome"] == "Loss":
                    stats["black_stats"]["Losses"] += 1
                elif game_data["Outcome"] == "Draw":
                    stats["black_stats"]["Draws"] += 1
                if game_data["UserResigned"] == "Yes":
                    stats["black_stats"]["User Resigned"] += 1
                if game_data["OpponentResigned"] == "Yes":
                    stats["black_stats"]["Opponent Resigned"] += 1
                if game_data["UserTimeout"] == "Yes":
                    stats["black_stats"]["User Timeout"] += 1
                if game_data["OpponentTimeout"] == "Yes":
                    stats["black_stats"]["Opponent Timeout"] += 1

            # Update overall stats
            stats["total_games"] += 1
            if game_data["Outcome"] == "Win":
                stats["total_won"] += 1
            elif game_data["Outcome"] == "Loss":
                stats["total_loss"] += 1
            elif game_data["Outcome"] == "Draw":
                stats["total_draw"] += 1
            if game_data["UserResigned"] == "Yes":
                stats["total_user_resigned"] += 1
            if game_data["OpponentResigned"] == "Yes":
                stats["total_opponent_resigned"] += 1
            if game_data["UserTimeout"] == "Yes":
                stats["total_user_timeout"] += 1
            if game_data["OpponentTimeout"] == "Yes":
                stats["total_opponent_timeout"] += 1

            # Update event stats
            event = game_data["Event"]
            stats["event_stats"][event]["Total Games"] += 1
            if game_data["Outcome"] == "Win":
                stats["event_stats"][event]["Wins"] += 1
            elif game_data["Outcome"] == "Loss":
                stats["event_stats"][event]["Losses"] += 1
            elif game_data["Outcome"] == "Draw":
                stats["event_stats"][event]["Draws"] += 1
            if game_data["UserResigned"] == "Yes":
                stats["event_stats"][event]["User Resigned"] += 1
            if game_data["OpponentResigned"] == "Yes":
                stats["event_stats"][event]["Opponent Resigned"] += 1
            if game_data["UserTimeout"] == "Yes":
                stats["event_stats"][event]["User Timeout"] += 1
            if game_data["OpponentTimeout"] == "Yes":
                stats["event_stats"][event]["Opponent Timeout"] += 1

            # Update time control stats
            time_control = game_data["TimeControl"]
            stats["time_control_stats"][time_control]["Total Games"] += 1
            if game_data["Outcome"] == "Win":
                stats["time_control_stats"][time_control]["Wins"] += 1
            elif game_data["Outcome"] == "Loss":
                stats["time_control_stats"][time_control]["Losses"] += 1
            elif game_data["Outcome"] == "Draw":
                stats["time_control_stats"][time_control]["Draws"] += 1
            if game_data["UserResigned"] == "Yes":
                stats["time_control_stats"][time_control]["User Resigned"] += 1
            if game_data["OpponentResigned"] == "Yes":
                stats["time_control_stats"][time_control]["Opponent Resigned"] += 1
            if game_data["UserTimeout"] == "Yes":
                stats["time_control_stats"][time_control]["User Timeout"] += 1
            if game_data["OpponentTimeout"] == "Yes":
                stats["time_control_stats"][time_control]["Opponent Timeout"] += 1

            # Update opponent level stats
            opponent_level = game_data["OpponentLevel"]
            stats["opponent_level_stats"][opponent_level]["Total Games"] += 1
            if game_data["Outcome"] == "Win":
                stats["opponent_level_stats"][opponent_level]["Wins"] += 1
            elif game_data["Outcome"] == "Loss":
                stats["opponent_level_stats"][opponent_level]["Losses"] += 1
            elif game_data["Outcome"] == "Draw":
                stats["opponent_level_stats"][opponent_level]["Draws"] += 1
            if game_data["UserResigned"] == "Yes":
                stats["opponent_level_stats"][opponent_level]["User Resigned"] += 1
            if game_data["OpponentResigned"] == "Yes":
                stats["opponent_level_stats"][opponent_level]["Opponent Resigned"] += 1
            if game_data["UserTimeout"] == "Yes":
                stats["opponent_level_stats"][opponent_level]["User Timeout"] += 1
            if game_data["OpponentTimeout"] == "Yes":
                stats["opponent_level_stats"][opponent_level]["Opponent Timeout"] += 1

    write_to_csv("total_games.csv", total_games)
    write_to_csv("white_games.csv", white_games)
    write_to_csv("black_games.csv", black_games)

    display_stats(stats)
    save_stats_to_json(stats, "results.json")

def determine_outcome(username, white, black, result):
    if white == username:
        if result == "1-0":
            return "Win"
        elif result == "0-1":
            return "Loss"
        elif result == "1/2-1/2":
            return "Draw"
    elif black == username:
        if result == "0-1":
            return "Win"
        elif result == "1-0":
            return "Loss"
        elif result == "1/2-1/2":
            return "Draw"
    return "Unknown"

def determine_conditions(username, white, black, comments):
    user_resigned = "No"
    user_resigned_comment = ""
    opponent_resigned = "No"
    opponent_resigned_comment = ""
    user_timeout = "No"
    user_timeout_comment = ""
    opponent_timeout = "No"
    opponent_timeout_comment = ""

    for comment in comments:
        parts = comment.split(']')
        last_part = parts[-1].strip()

        if white == username:
            if "White resigns." in last_part:
                user_resigned = "Yes"
                user_resigned_comment = last_part
            elif "Black resigns." in last_part:
                opponent_resigned = "Yes"
                opponent_resigned_comment = last_part
            if "Black wins on time." in last_part:
                user_timeout = "Yes"
                user_timeout_comment = last_part
            elif "White wins on time." in last_part:
                opponent_timeout = "Yes"
                opponent_timeout_comment = last_part
        elif black == username:
            if "Black resigns." in last_part:
                user_resigned = "Yes"
                user_resigned_comment = last_part
            elif "White resigns." in last_part:
                opponent_resigned = "Yes"
                opponent_resigned_comment = last_part
            if "White wins on time." in last_part:
                user_timeout = "Yes"
                user_timeout_comment = last_part
            elif "Black wins on time." in last_part:
                opponent_timeout = "Yes"
                opponent_timeout_comment = last_part

    return user_resigned, user_resigned_comment, opponent_resigned, opponent_resigned_comment, user_timeout, user_timeout_comment, opponent_timeout, opponent_timeout_comment

def determine_opponent_level(elo):
    if elo is None:
        return "Unknown"
    elif elo < 1000:
        return "Beginner (Under 1000)"
    elif 1000 <= elo < 1200:
        return "Novice (1000-1200)"
    elif 1200 <= elo < 1400:
        return "Intermediate (1200-1400)"
    elif 1400 <= elo < 1600:
        return "Advanced (1400-1600)"
    elif 1600 <= elo < 1800:
        return "Club Player (1600-1800)"
    elif 1800 <= elo < 2000:
        return "Expert (1800-2000)"
    elif 2000 <= elo < 2200:
        return "Candidate Master (2000-2200)"
    elif 2200 <= elo < 2400:
        return "FIDE Master (2200-2400)"
    elif 2400 <= elo < 2500:
        return "International Master (2400-2500)"
    elif elo >= 2500:
        return "Grandmaster (2500+)"
    else:
        return "Unknown"

def write_to_csv(filename, games):
    keys = ["Event", "Site", "Date", "White", "Black", "UserPlayedAs", "OpponentLevel", "OpponentElo", "Result", "TimeControl", "Opening", "Termination", "Outcome",
            "UserResigned", "UserResignedComment", "OpponentResigned", "OpponentResignedComment",
            "UserTimeout", "UserTimeoutComment", "OpponentTimeout", "OpponentTimeoutComment"]
    with open(filename, 'w', newline='') as output_file:
        dict_writer = csv.DictWriter(output_file, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(games)

def display_stats(stats):
    print(f"Total games the user played: {stats['total_games']}")
    print(f"Total won: {stats['total_won']}")
    print(f"Total loss: {stats['total_loss']}")
    print(f"Total draw: {stats['total_draw']}")
    print(f"Total times the user resigned: {stats['total_user_resigned']}")
    print(f"Total times the opponent resigned: {stats['total_opponent_resigned']}")
    print(f"Total times the user timeout: {stats['total_user_timeout']}")
    print(f"Total times the opponent timeout: {stats['total_opponent_timeout']}")

    print("\nPlayed as White:")
    print(f"- Total Games: {stats['white_stats']['Total Games']}")
    print(f"- Wins: {stats['white_stats']['Wins']}")
    print(f"- Losses: {stats['white_stats']['Losses']}")
    print(f"- Draws: {stats['white_stats']['Draws']}")
    print(f"- User Resigned: {stats['white_stats']['User Resigned']}")
    print(f"- Opponent Resigned: {stats['white_stats']['Opponent Resigned']}")
    print(f"- User Timeout: {stats['white_stats']['User Timeout']}")
    print(f"- Opponent Timeout: {stats['white_stats']['Opponent Timeout']}")

    print("\nPlayed as Black:")
    print(f"- Total Games: {stats['black_stats']['Total Games']}")
    print(f"- Wins: {stats['black_stats']['Wins']}")
    print(f"- Losses: {stats['black_stats']['Losses']}")
    print(f"- Draws: {stats['black_stats']['Draws']}")
    print(f"- User Resigned: {stats['black_stats']['User Resigned']}")
    print(f"- Opponent Resigned: {stats['black_stats']['Opponent Resigned']}")
    print(f"- User Timeout: {stats['black_stats']['User Timeout']}")
    print(f"- Opponent Timeout: {stats['black_stats']['Opponent Timeout']}")

    print("\nEvent Statistics:")
    for event, event_stats in stats["event_stats"].items():
        print(f"\n{event}")
        print(f"- Total Games: {event_stats['Total Games']}")
        print(f"- Wins: {event_stats['Wins']}")
        print(f"- Losses: {event_stats['Losses']}")
        print(f"- Draws: {event_stats['Draws']}")
        print(f"- User Resigned: {event_stats['User Resigned']}")
        print(f"- Opponent Resigned: {event_stats['Opponent Resigned']}")
        print(f"- User Timeout: {event_stats['User Timeout']}")
        print(f"- Opponent Timeout: {event_stats['Opponent Timeout']}")

    print("\nTime Control Statistics:")
    for time_control, time_control_stats in stats["time_control_stats"].items():
        print(f"\n{time_control}")
        print(f"- Total Games: {time_control_stats['Total Games']}")
        print(f"- Wins: {time_control_stats['Wins']}")
        print(f"- Losses: {time_control_stats['Losses']}")
        print(f"- Draws: {time_control_stats['Draws']}")
        print(f"- User Resigned: {time_control_stats['User Resigned']}")
        print(f"- Opponent Resigned: {time_control_stats['Opponent Resigned']}")
        print(f"- User Timeout: {time_control_stats['User Timeout']}")
        print(f"- Opponent Timeout: {time_control_stats['Opponent Timeout']}")

    print("\nOpponent Level Statistics:")
    for opponent_level, opponent_level_stats in stats["opponent_level_stats"].items():
        print(f"\n{opponent_level}")
        print(f"- Total Games: {opponent_level_stats['Total Games']}")
        print(f"- Wins: {opponent_level_stats['Wins']}")
        print(f"- Losses: {opponent_level_stats['Losses']}")
        print(f"- Draws: {opponent_level_stats['Draws']}")
        print(f"- User Resigned: {opponent_level_stats['User Resigned']}")
        print(f"- Opponent Resigned: {opponent_level_stats['Opponent Resigned']}")
        print(f"- User Timeout: {opponent_level_stats['User Timeout']}")
        print(f"- Opponent Timeout: {opponent_level_stats['Opponent Timeout']}")

def save_stats_to_json(stats, filename):
    with open(filename, 'w') as json_file:
        json.dump(stats, json_file, indent=4)

if __name__ == "__main__":
    file_path = input("Enter the path to the PGN file: ")
    analyze_pgn(file_path)
