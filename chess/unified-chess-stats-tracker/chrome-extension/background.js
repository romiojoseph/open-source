chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request:", request);
  
    if (request.action === 'fetchStats') {
        const { sameUser, chessComUsername, lichessUsername } = request;
  
        // Fetch new data directly without caching
        if (sameUser === 'yes') {
            fetchChessComStats(chessComUsername).then(chessComStats => {
                fetchLichessStats(chessComUsername).then(lichessStats => {
                    const combinedData = {
                        chessCom: chessComStats,
                        lichess: lichessStats
                    };
  
                    console.log("Combined Data:", combinedData); // Log combined data before sending
                    sendResponse({ tableData: combinedData });
                }).catch(error => {
                    console.error("Error fetching Lichess stats:", error);
                    sendResponse({ tableData: null });
                });
            }).catch(error => {
                console.error("Error fetching Chess.com stats:", error);
                sendResponse({ tableData: null });
            });
        } else {
            Promise.all([
                fetchChessComStats(chessComUsername),
                fetchLichessStats(lichessUsername)
            ]).then(([chessComStats, lichessStats]) => {
                const combinedData = {
                    chessCom: chessComStats,
                    lichess: lichessStats
                };
  
                console.log("Combined Data:", combinedData); // Log combined data before sending
                sendResponse({ tableData: combinedData });
            }).catch(error => {
                console.error("Error fetching stats for different usernames:", error);
                sendResponse({ tableData: null });
            });
        }
  
        return true; // Keep the message channel open until sendResponse is called
    }
  });
  
  // Function to fetch Chess.com statistics
  async function fetchChessComStats(username) {
    const url = `https://api.chess.com/pub/player/${username}/stats`;
    const response = await fetch(url);
  
    if (response.ok) {
        const rawData = await response.json();
        console.log("Raw Chess.com response:", rawData); // Log the entire response
  
        const chessComData = [];
        let totalWins = 0;
        let totalLosses = 0;
        let totalDraws = 0;
  
        for (const gameMode of ['chess_rapid', 'chess_blitz', 'chess_bullet']) { 
            if (rawData[gameMode]) {
                const data = rawData[gameMode].record;
                const wins = data.win;
                const losses = data.loss;
                const draws = data.draw;
                const totalGames = wins + losses + draws;
  
                // Format GameMode to sentence case
                const formattedGameMode = toSentenceCase(gameMode.replace('chess_', '').replace('_', ' '));
                console.log("Formatted Game Mode:", formattedGameMode); // Log formatted game mode
  
                chessComData.push({
                    GameMode: formattedGameMode,
                    Rating: rawData[gameMode].last.rating || 'N/A',
                    Wins: wins,
                    Losses: losses,
                    Draws: draws,
                    TotalGames: totalGames
                });
  
                totalWins += wins;
                totalLosses += losses;
                totalDraws += draws;
            }
        }
  
        // Add total row
        chessComData.push({
            GameMode: "Total",
            Rating: "",
            Wins: totalWins,
            Losses: totalLosses,
            Draws: totalDraws,
            TotalGames: totalWins + totalLosses + totalDraws
        });
  
        return chessComData;
    } else {
        console.error(`Error fetching Chess.com stats for ${username}: ${response.status} - ${response.statusText}`);
        throw new Error(`Error fetching Chess.com stats: ${response.status} - ${response.statusText}`);
    }
  }
  
  // Function to fetch Lichess statistics for specific performance types
  async function fetchLichessStats(username) {
    const performanceTypes = ["rapid", "blitz", "bullet"]; 
    const lichessData = [];
    let totalWins = 0;
    let totalLosses = 0;
    let totalDraws = 0;
  
    for (const perf of performanceTypes) {
        const url = `https://lichess.org/api/user/${username}/perf/${perf}`;
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            const wins = data.stat.count.win || 0;
            const losses = data.stat.count.loss || 0;
            const draws = data.stat.count.draw || 0;
            const totalGames = data.stat.count.all || 0;
            const rating = data.perf.glicko.rating || 'N/A';
  
            // Format GameMode to sentence case
            const formattedPerf = toSentenceCase(perf);
            console.log("Formatted Lichess Performance Type:", formattedPerf); // Log formatted performance type
  
            lichessData.push({
                GameMode: formattedPerf,
                Rating: rating,
                Wins: wins,
                Losses: losses,
                Draws: draws,
                TotalGames: totalGames
            });
  
            // Accumulate totals for Lichess
            totalWins += wins;
            totalLosses += losses;
            totalDraws += draws;
        } else {
            console.error(`Error fetching Lichess stats for ${username} in ${perf}: ${response.status} - ${response.statusText}`);
        }
    }
  
    // Add total row
    lichessData.push({
        GameMode: "Total",
        Rating: "",
        Wins: totalWins,
        Losses: totalLosses,
        Draws: totalDraws,
        TotalGames: totalWins + totalLosses + totalDraws
    });
  
    return lichessData;
  }
  
  // Helper function to convert strings to sentence case
  function toSentenceCase(str) {
      return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }