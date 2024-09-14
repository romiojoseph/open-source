import os
import chess.pgn
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

# Function to format numbers for the heatmap
def format_number(x):
    if x >= 1000000:
        return f'{x/1000000:.1f}m'  # Format numbers in millions
    elif x >= 1000:
        return f'{x/1000:.1f}k'  # Format numbers in thousands
    return str(int(x))  # Return as integer if less than 1000

# Get the current working directory (where the script is located)
current_directory = os.path.dirname(os.path.abspath(__file__))

# List all .pgn files in the current directory
pgn_files = [f for f in os.listdir(current_directory) if f.endswith('.pgn')]

# Check if any PGN files were found
if not pgn_files:
    print("No PGN files found in the current directory.")
    exit()

# Display the list of PGN files
print("Select a PGN file to analyze:")
for i, file in enumerate(pgn_files):
    print(f"{i + 1}: {file}")

# Prompt the user to select a file
while True:
    try:
        choice = int(input("Enter the number corresponding to the PGN file: "))
        if 1 <= choice <= len(pgn_files):
            selected_file = pgn_files[choice - 1]
            username = selected_file[:-4]  # Remove the '.pgn' extension to get the username
            break
        else:
            print(f"Please enter a number between 1 and {len(pgn_files)}.")
    except ValueError:
        print("Invalid input. Please enter a number.")

# Initialize 8x8 matrices for counting piece activity for each piece type and color
piece_activity = {
    'P': {'white': np.zeros((8, 8)), 'black': np.zeros((8, 8))},  # Pawns
    'N': {'white': np.zeros((8, 8)), 'black': np.zeros((8, 8))},  # Knights
    'B': {'white': np.zeros((8, 8)), 'black': np.zeros((8, 8))},  # Bishops
    'R': {'white': np.zeros((8, 8)), 'black': np.zeros((8, 8))},  # Rooks
    'Q': {'white': np.zeros((8, 8)), 'black': np.zeros((8, 8))},  # Queens
    'K': {'white': np.zeros((8, 8)), 'black': np.zeros((8, 8))},  # Kings
}

# Initialize game statistics
total_games = 0
wins = 0
losses = 0
draws = 0

# Open the selected PGN file
with open(os.path.join(current_directory, selected_file)) as pgn:
    while True:
        game = chess.pgn.read_game(pgn)
        if game is None:  # Check for the end of the PGN file
            break

        total_games += 1
        result = game.headers.get("Result", "1/2-1/2")  # Default to draw if no result is found
        white_player = game.headers.get("White", "Unknown")
        black_player = game.headers.get("Black", "Unknown")

        # Check if the username is the white or black player
        if username == white_player:
            if result == "1-0":
                wins += 1
            elif result == "0-1":
                losses += 1
            elif result == "1/2-1/2":
                draws += 1
        elif username == black_player:
            if result == "0-1":
                wins += 1
            elif result == "1-0":
                losses += 1
            elif result == "1/2-1/2":
                draws += 1

        # Initialize the chessboard
        board = game.board()

        # Go through each move in the game
        for move in game.mainline_moves():
            board.push(move)
            for square in chess.SQUARES:
                piece = board.piece_at(square)
                if piece:
                    # Convert square to row, column index for heatmap
                    row, col = divmod(square, 8)

                    # Determine the piece's color based on the current turn
                    piece_color = 'white' if board.turn else 'black'

                    piece_activity[piece.symbol().upper()][piece_color][row, col] += 1

# Display game statistics
print(f"Total Games Played by {username}: {total_games}")
print(f"Wins: {wins}")
print(f"Losses: {losses}")
print(f"Draws: {draws}")

# Generate heatmaps for each piece type and color using seaborn
for piece, activity in piece_activity.items():
    fig, axes = plt.subplots(1, 2, figsize=(12, 6), sharex=True, sharey=True)

    for i, (color, data) in enumerate(activity.items()):
        ax = axes[i]
        sns.heatmap(data, annot=True, fmt='', cmap="YlGnBu", cbar=True,
                    annot_kws={"size": 10},
                    linewidths=.5,
                    linecolor='black',
                    cbar_kws={"format": '%.0f'},
                    ax=ax,
                    square=True)  # Set the aspect parameter to 'equal'

        # Format annotations with the custom function
        for text in ax.texts:
            text.set_text(format_number(float(text.get_text())))

        ax.set_title(f"Heatmap of {color} {piece} Activity (All Games)")

    plt.suptitle(f"{selected_file}")

    # Display the heatmaps
    plt.show(block=False)  # Show the heatmaps without blocking

    # Display the piece name in the prompt
    if piece == 'P':
        piece_name = "Pawns"
    elif piece == 'N':
        piece_name = "Knights"
    elif piece == 'B':
        piece_name = "Bishops"
    elif piece == 'R':
        piece_name = "Rooks"
    elif piece == 'Q':
        piece_name = "Queens"
    else:
        piece_name = "Kings"

    input(f"Press Enter to see the heatmaps for {piece_name}...")  # Prompt to continue

    plt.close()  # Close the heatmaps after the input

# Keep the script running after generating the heatmaps
input("Press Enter to exit...")