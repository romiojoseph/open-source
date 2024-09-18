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
  
        chrome.runtime.sendMessage({
            action: 'fetchStats',
            sameUser: sameUser,
            chessComUsername: chessComUsername,
            lichessUsername: lichessUsername
        }, function(response) {
            console.log("Received response from background script:", response);
  
            if (response && response.tableData) {
                displaySummary(response.tableData);
                displayChessComStats(response.tableData.chessCom);
                displayLichessStats(response.tableData.lichess);
  
              } else {
                  console.error("No data received or an error occurred.");
                  document.getElementById('stats').innerText = "Error fetching data.";
              }
          });
      });
  
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