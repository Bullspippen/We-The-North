// Define the global variables.
let upcomingGamesElement = $("#upcoming-games");
let selectedTeam = $(".dropdown-menu li");
let playerStatsElement = $("#player-stats");
let recentGamesElement = $("#recent-stats");
let selectButton = $("#dropdownMenuButton1");
const clientID = "MzE3MTIzMTB8MTY3NTE4OTk3My4zMjk3Nw";
const clientAppSecret = "dd20d1dc80a7a92527e18689f8e60bce450670b200b5f20c21ab540c556a433b";

let teamHist0BtnElement = $("#prevTeam0");
let teamHist1BtnElement = $("#prevTeam1");
let teamHist2BtnElement = $("#prevTeam2");
var teamHistoryArray = ["Toronto Raptors", "Los Angeles Lakers", "New York Knicks"];
    

var players = {
    "Luka Doncic": 132,
    "Nikola Jokic": 246,
    "Joel Embiid": 145,
    // "Giannis Antetokounmpo": 15,
    // "LeBron James": 237,
}

var images = {
    "Luka Doncic": "https://www.basketball-reference.com/req/202106291/images/players/doncilu01.jpg",
    "Nikola Jokic": "https://www.basketball-reference.com/req/202106291/images/players/jokicni01.jpg",
    "Joel Embiid": "https://www.basketball-reference.com/req/202106291/images/players/embiijo01.jpg",
    // "Giannis Antetokounmpo": "https://www.basketball-reference.com/req/202106291/images/players/antetgi01.jpg",
    // "LeBron James": "https://www.basketball-reference.com/req/202106291/images/players/jamesle01.jpg"
};

// Gets a team ID from the balldontlie teams endpoint
// The team ID is used to get a list of games with the team ID from the games endpoint.
function getTeamID(teamName) {
    selectButton.text(teamName);
    let queryURL = "https://www.balldontlie.io/api/v1/teams";
    fetch(queryURL)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function(data) {
            let teamsObject = data['data'];
            for (let i = 0; i < teamsObject.length; i++) {
                if (teamsObject[i].full_name === teamName) {
                    // Get the team ID from the object
                    let bdlTeamID = teamsObject[i].id;
                    getGameStats(bdlTeamID, teamName);
                    return;
                }
            }
        })
}

// Function to get the top player stats displayed in the aside element (sidebar)
function getPlayerStats() {
    indexPlayers = Object.keys(players);
    indeximages = Object.keys(images)

    for (var i=0; i < indexPlayers.length; i++) {
        (function(i) {
          // Define the query URL
          let avgstatsQueryURL = "https://www.balldontlie.io/api/v1/season_averages?player_ids[]=" + players[indexPlayers[i]] +  "&per_page=100";
      
          fetch(avgstatsQueryURL)
              .then(function(response) {
                  if (!response.ok) {
                      throw response.json();
                  }
                  return response.json();
              })
              .then(function(data) {
                let playerStats = data['data'];
                let playerStatsTitle = $('<h3>').text("Top 3 Season Leaders");
                let cardContainer = $('<div>').addClass("card col-lg-12 col-md-4 col-sm-4 col-xs-4");
                let cardHeader = $('<h5>').text(indexPlayers[i]);
                let cardBody = $('<p>').text("Points:\n " + playerStats[0].pts + "\nRebounds: \n" + playerStats[0].reb + "\nAssists: \n" + playerStats[0].ast);
                let image = $("<img>").attr("src", images[indeximages[i]])
                  
                // Append the card container to the player stats element
                playerStatsElement.append(cardContainer);

                // Append the card elements to the card
                cardContainer.append(cardHeader, cardBody);

                // Append the images into the paragraph
                cardBody.append(image);

                if (i == 0) {
                    cardContainer.id("last-container");
                }
              });
        })(i);
    }
    // Append the title of the card containers to the player stats element
    let playerStatsTitle = $('<h3>').text("Top 3 Season Leaders");
    playerStatsElement.append(playerStatsTitle); 
}

// Function to get the recent game stats and display them in a table.
function getGameStats(teamID, teamName) {
    // Get the dates to use in balldontlie API query. Yesterday and 30 days ago.
    var today = dayjs();
    let yesterday = dayjs().subtract(1, 'day');
    var thirtyDaysAgo = dayjs().subtract(30, 'day');
    let yesterdayFormatted = yesterday.format('YYYY-MM-DD');    
    var thirtyDaysAgoFormatted = thirtyDaysAgo.format('YYYY-MM-DD');


    // Get the games from the balldontlie games endpoint
    let queryURL = "https://www.balldontlie.io/api/v1/games?team_ids[]=" + teamID + "&start_date=" + thirtyDaysAgoFormatted + "&end_date=" + yesterdayFormatted+ "&per_page=100";
    
    fetch(queryURL)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function(data) {
            // Get the games from the JSON object
            let gamesObject = data['data'];

            // Get the abbreviation of the selected team. Used in table heading
            if (teamName === gamesObject[0].home_team.full_name) {
                shortName = gamesObject[0].home_team.abbreviation;
            } else {
                shortName = gamesObject[0].visitor_team.abbreviation;
            }
           
            // Sort the games by date - desc. Create a custom function to sort the dates of the game
            function custom_sort(a, b) {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            }    
            gamesObject.sort( custom_sort ); //returns the array sorted by date in decending order (newest to oldest)
            
            // Reset the recent games element
            recentGamesElement.empty();

            // Create and append a header to the table
            let tableHeader = $('<h3>').text( teamName + " Last 10 Games");
            recentGamesElement.append(tableHeader);


            // Create the table            
            let table = $('<table>');
            let tableBody = $('<tbody>');
            let tableHead = $('<thead>');
            let rowHead = $('<tr>');
            let cellDate = $('<th>').text("Date");
            let cellWinner =$('<th>').text("Winner");
            let cellTeam1 = $('<th>').text(shortName + " Final Score");
            let cellTeam2Name = $('<th>').text("Opposing Team");
            let cellTeam2Score = $('<th>').text("Opp. Team Score");
            let cellLocation = $('<th>').text("Venue");

            // Reset the table and append it to the page
            recentGamesElement.append( table );
            table.append(tableHead);
            tableHead.append(rowHead);
            rowHead.append(cellDate, cellWinner, cellTeam1, cellTeam2Name, cellTeam2Score, cellLocation);
            table.append( tableBody );

            // Loop through the games and add them to the table
            for (let game = 0; game < 10; game++) {
                // Create the table cells and append them to the table row
                let gameDate = gamesObject[game].date;
                let formattedGameDate = dayjs(gameDate).format("ddd, MMM D");
                let location = gamesObject[game]['home_team'].city;
                let rowDataDate = $('<td>').text(formattedGameDate);
                let rowDataLocation = $('<td>').text(location);

                // Create the table row and append it to the table body
                let rowData = $('<tr>').attr("class", "row" + game);
                tableBody.append(rowData);

                // Check for if the selected team is the home/away team and if they won.

                // If the selected team is the home team
                if (gamesObject[game]['home_team'].full_name == teamName) {
                    // Define the team names and scores
                    let team1Score = gamesObject[game].home_team_score;
                    let team2Name = gamesObject[game]['visitor_team'].full_name;
                    let team2Score = gamesObject[game].visitor_team_score;

                    // Check if the selected team (home team) won or lost the game. Update the winner column accordingly
                    if (team1Score > team2Score) {
                        let rowDataTeam1 = $('<td>').text(team1Score).attr("class", "win");
                        let rowDataTeam2Name = $('<td>').text(team2Name);
                        let rowDataTeam2Score = $('<td>').text(team2Score);
                        let winner = teamName;
                        let rowWinner = $('<td>').text(winner);
                        rowData.append(rowDataDate, rowWinner, rowDataTeam1, rowDataTeam2Name, rowDataTeam2Score, rowDataLocation);
                    }
                    else {
                        let rowDataTeam1 = $('<td>').text(team1Score).attr("class", "loss");
                        let rowDataTeam2Name = $('<td>').text(team2Name);
                        let rowDataTeam2Score = $('<td>').text(team2Score);
                        let winner = team2Name;
                        let rowWinner = $('<td>').text(winner);
                        rowData.append(rowDataDate, rowWinner, rowDataTeam1, rowDataTeam2Name, rowDataTeam2Score, rowDataLocation);
                    }
                } else {
                    // The selected team is the away team. Define the team names and scores
                    let team1Score = gamesObject[game].visitor_team_score;
                    let team2Name = gamesObject[game]['home_team'].full_name;
                    let team2Score = gamesObject[game].home_team_score;

                    // Check if the selected team (away team) won or lost the game. Update the winner column accordingly
                    if (team1Score > team2Score) {
                        let rowDataTeam1 = $('<td>').text(team1Score).attr("class", "win");
                        let rowDataTeam2Name = $('<td>').text(team2Name);
                        let rowDataTeam2Score = $('<td>').text(team2Score);
                        let winner = teamName;
                        let rowWinner = $('<td>').text(winner);
                        rowData.append(rowDataDate, rowWinner, rowDataTeam1, rowDataTeam2Name, rowDataTeam2Score, rowDataLocation);
                    } else {
                        let rowDataTeam1 = $('<td>').text(team1Score).attr("class", "loss");
                        let rowDataTeam2Name = $('<td>').text(team2Name);
                        let rowDataTeam2Score = $('<td>').text(team2Score);
                        let winner = team2Name;
                        let rowWinner = $('<td>').text(winner);
                        rowData.append(rowDataDate, rowWinner, rowDataTeam1, rowDataTeam2Name, rowDataTeam2Score, rowDataLocation);
                    }
                }
            }
        })
}

// Get the upcoming games from the seat geek API and display them in a table.
function getUpcomingGames(teamName) {
    // Format the query string inputs and define the URL in the call
    let teamSGFormat = teamName.toLowerCase().replaceAll(" ", "-");
    let queryURL = "https://api.seatgeek.com/2/events/?performers.slug=" + teamSGFormat + "&per_page=30&client_id=" + clientID + "&client_secret=" + clientAppSecret;
    fetch(queryURL)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function(data) {
            // Get the upcoming games from the JSON object
            let nbaGames = data['events'];

            // Empty the table and create the table elements
            upcomingGamesElement.empty();
            let table = $('<table>');
            let tableBody = $('<tbody>');
            let tableHead = $('<thead>');
            let rowHead = $('<tr>');
            let cellGameDateTime = $('<th>').text("Date");
            let cellTitle = $('<th>').text("Games");
            let cellVenueLocation = $('<th>').text("Venue");
            let cellBuyTickets = $('<th>').text("Tickets");
            
            // Append the table to the page
            upcomingGamesElement.append( table );
            table.append(tableHead);
            tableHead.append(rowHead);
            rowHead.append(cellGameDateTime, cellTitle, cellVenueLocation, cellBuyTickets);
            table.append( tableBody );

            // Loop through the games and add them to the table
            for (let game = 0; game < nbaGames.length; game++) {
                let gameDate = nbaGames[game].datetime_local;
                let formattedGameDate = dayjs(gameDate).format("MMM D");
                let formattedGameTime = dayjs(gameDate).format("ddd h:mm A");
                let title = nbaGames[game].title;
                let venue = nbaGames[game].venue.name;
                let location = nbaGames[game].venue.address;
                let minPrice = nbaGames[game].stats.lowest_price;
                let ticketURL = nbaGames[game].url;

                let rowData = $('<tr>').attr("class", "row" + game);
                tableBody.append(rowData);

                let rowDataGameDateTime = $('<td>').text(formattedGameDate + " " + formattedGameTime);
                let rowDataTitle = $('<td>').text(title);
                let rowDataVenueLocation = $('<td>').text(venue + " " + location);
                let rowDataBuyTickets = $('<td>').html("<a href=" + ticketURL + " target='_blank'><button>Starting at $"+ minPrice + "</button></a>");

                rowData.append(rowDataGameDateTime, rowDataTitle, rowDataVenueLocation, rowDataBuyTickets);
                }
        })
}

function retrieveLocalSavedTeams() {
    teamHistoryArray = JSON.parse(localStorage.getItem("localSavedTeams"));
    document.querySelector('#prevTeam0').textContent = teamHistoryArray[0];
    document.querySelector('#prevTeam1').textContent = teamHistoryArray[1];
    document.querySelector('#prevTeam2').textContent = teamHistoryArray[2];
}
retrieveLocalSavedTeams();

function init() {
    // Display the raptors as the default team
    getPlayerStats();

    // Enter the team ID for the Toronto Raptors to display there recent game stats
    getGameStats(28, "Toronto Raptors");

    // Call the getUpcomingGames function for the Toronto Raptors
    getUpcomingGames("Toronto Raptors");

    // Display the raptors as the default team
    selectButton.text("Toronto Raptors");
}
init();

selectedTeam.click(function(event) {
    // Get the team name from the selected element. Format is correct for balldontlie API.
    let teamName = event.target.text; // Toronto Raptors 

    // Team Viewing History builder for array
    teamHistoryArray.unshift(teamName); // Unshift to add 'event' team name from the li of the dropdown menu. Saves name to beginning of array.
    teamHistoryArray.pop(); // Pop will stop the array from infinitely building. Add (unshift) +1 at [0], remove -1 at end [2]
    
    localStorage.setItem("localSavedTeams", JSON.stringify(teamHistoryArray));
    
    document.querySelector('#prevTeam0').textContent = teamHistoryArray[0];
    document.querySelector('#prevTeam1').textContent = teamHistoryArray[1];
    document.querySelector('#prevTeam2').textContent = teamHistoryArray[2];

    //Call the getTeamID function for the selected team to start the API calls for the season stats
    getTeamID(teamName);

    // Convert the team name to the SeatGeek query sting format
    let teamSGFormat = teamName.toLowerCase().replaceAll(" ", "-"); // toronto-raptors

    // Call the getUpcomingGames function for the selected team
    getUpcomingGames(teamSGFormat);
})

// Event listeners for Group of Buttons for Team History
teamHist0BtnElement.click(function(event){
    let teamName = teamHistoryArray[0]; // Retrieves the first team saved in the array

    //Call the getTeamID function for the selected team to start the API calls for the season stats
    getTeamID(teamName);
    
    // Convert the team name to the SeatGeek query sting format
    let teamSGFormat = teamName.toLowerCase().replaceAll(" ", "-"); // e.g. toronto-raptors
    
    // Call the getUpcomingGames function for the selected team
    getUpcomingGames(teamSGFormat);
})

teamHist1BtnElement.click(function(event){
    let teamName = teamHistoryArray[1]; // Retrieves the second team saved in the array

    //Call the getTeamID function for the selected team to start the API calls for the season stats
    getTeamID(teamName);
    
    // Convert the team name to the SeatGeek query sting format
    let teamSGFormat = teamName.toLowerCase().replaceAll(" ", "-"); // e.g. toronto-raptors
    
    // Call the getUpcomingGames function for the selected team
    getUpcomingGames(teamSGFormat);
})

teamHist2BtnElement.click(function(event){
    let teamName = teamHistoryArray[2]; // Retrieves the third team saved in the array

    //Call the getTeamID function for the selected team to start the API calls for the season stats
    getTeamID(teamName);
    
    // Convert the team name to the SeatGeek query sting format
    let teamSGFormat = teamName.toLowerCase().replaceAll(" ", "-"); // e.g. toronto-raptors
    
    // Call the getUpcomingGames function for the selected team
    getUpcomingGames(teamSGFormat);
})