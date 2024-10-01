document.addEventListener('DOMContentLoaded', function() {
    const sameUserRadios = document.querySelectorAll('input[name="sameUser"]');
    const usernameFields = document.getElementById('usernameFields');
    const differentUsernameFields = document.getElementById('differentUsernameFields');
  
    function toggleInputFields() {
        if (document.querySelector('input[name="sameUser"]:checked').value === 'yes') {
            usernameFields.style.display = 'block';
            differentUsernameFields.style.display = 'none';
        } else {
            usernameFields.style.display = 'none';
            differentUsernameFields.style.display = 'block';
        }
    }
  
    toggleInputFields();
  
    sameUserRadios.forEach(radio => {
        radio.addEventListener('change', toggleInputFields);
    });
  
    const statsForm = document.getElementById('statsForm');
    statsForm.addEventListener('submit', function(event) {
        event.preventDefault();
  
        const formData = new FormData(statsForm);
        const sameUser = formData.get('sameUser');
        let username, chessComUsername, lichessUsername;
  
        if (sameUser === 'yes') {
            username = formData.get('username');
            chessComUsername = username; // Same username for both
        } else {
            chessComUsername = formData.get('chessComUsername');
            lichessUsername = formData.get('lichessUsername');
        }
  
        // Fetch data directly without caching (no background script in web version)
        if (sameUser === 'yes') {
            fetchChessComStats(chessComUsername).then(chessComStats => {
                fetchLichessStats(chessComUsername).then(lichessStats => {
                    const combinedData = {
                        chessCom: chessComStats,
                        lichess: lichessStats
                    };
  
                    console.log("Combined Data:", combinedData); // Log combined data before displaying
                    displaySummary(combinedData);
                    displayChessComStats(combinedData.chessCom);
                    displayLichessStats(combinedData.lichess);
                }).catch(error => {
                    console.error("Error fetching Lichess stats:", error);
                    document.getElementById('stats').innerText = "Error fetching Lichess data.";
                });
            }).catch(error => {
                console.error("Error fetching Chess.com stats:", error);
                document.getElementById('stats').innerText = "Error fetching Chess.com data.";
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
  
                console.log("Combined Data:", combinedData); // Log combined data before displaying
                displaySummary(combinedData);
                displayChessComStats(combinedData.chessCom);
                displayLichessStats(combinedData.lichess);
            }).catch(error => {
                console.error("Error fetching stats for different usernames:", error);
                document.getElementById('stats').innerText = "Error fetching data.";
            });
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
  
    // Function to display overall summary
    function displaySummary(data) {
        const statsDiv = document.getElementById('stats');
  
        // Clear previous content before displaying new results
        statsDiv.innerHTML = '';
  
        const chessComTotal = data.chessCom[data.chessCom.length - 1];
        const lichessTotal = data.lichess[data.lichess.length - 1];
  
        const overallTotalGamesPlayed = chessComTotal.TotalGames + lichessTotal.TotalGames;
        const overallTotalWins = chessComTotal.Wins + lichessTotal.Wins;
        const overallTotalLosses = chessComTotal.Losses + lichessTotal.Losses;
        const overallTotalDraws = chessComTotal.Draws + lichessTotal.Draws;
  
        const winPercentage = (overallTotalWins / overallTotalGamesPlayed * 100).toFixed(1);
        const lossPercentage = (overallTotalLosses / overallTotalGamesPlayed * 100).toFixed(1);
        const drawPercentage = (overallTotalDraws / overallTotalGamesPlayed * 100).toFixed(1);
  
        // Display overall summary
        statsDiv.innerHTML += `
          <h3>Total summary across both platforms</h3>
          <p>Total games played: ${overallTotalGamesPlayed}</p>
          <p>Total wins: ${overallTotalWins} (${winPercentage}%)</p>
          <p>Total losses: ${overallTotalLosses} (${lossPercentage}%)</p>
          <p>Total draws: ${overallTotalDraws} (${drawPercentage}%)</p>
        `;
    }
  
    // Function to display Chess.com statistics in a table format
    function displayChessComStats(chessComStats) {
        const statsDiv = document.getElementById('stats');
  
        statsDiv.innerHTML += `<h3>Chess.com statistics</h3>`;
        let tableHTML = `<table><tr><th>Game mode</th><th>Rating</th><th>Wins</th><th>Losses</th><th>Draws</th><th>Total games</th></tr>`;
  
        chessComStats.forEach(stat => {
            tableHTML += `
                <tr>
                    <td>${stat.GameMode}</td>
                    <td>${stat.Rating}</td>
                    <td>${stat.Wins}</td>
                    <td>${stat.Losses}</td>
                    <td>${stat.Draws}</td>
                    <td>${stat.TotalGames}</td>
                </tr>`;
        });
  
        tableHTML += `</table>`;
        statsDiv.innerHTML += tableHTML;
    }
  
    // Function to display Lichess statistics in a table format
    function displayLichessStats(lichessStats) {
        const statsDiv = document.getElementById('stats');
  
        statsDiv.innerHTML += `<h3>Lichess statistics</h3>`;
        let tableHTML = `<table><tr><th>Game mode</th><th>Rating</th><th>Wins</th><th>Losses</th><th>Draws</th><th>Total games</th></tr>`;
  
        lichessStats.forEach(stat => {
            tableHTML += `
                <tr>
                    <td>${stat.GameMode}</td>
                    <td>${stat.Rating}</td>
                    <td>${stat.Wins}</td>
                    <td>${stat.Losses}</td>
                    <td>${stat.Draws}</td>
                    <td>${stat.TotalGames}</td>
                </tr>`;
        });
  
        tableHTML += `</table>`;
        statsDiv.innerHTML += tableHTML;
    }
});