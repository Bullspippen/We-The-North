/* Landing page notes 
Search bar functionality:
- When the user enters a city name, the city name is saved to local storage
- The event listener will be a click on the search button
- When the user enters a city name, the city name is used to get the stats from the balldontlie API
- The city name the user input will be used to get the team ID from the balldontlie API
- Use the Get Teams endpoint, query string of search=city name

Season stats section:
- The season stats section will be populated with the stats from the current season
- The stats will be pulled from the balldontlie API, specifically use the Get All Games endpoint
- The URL request should include the seasons=2023 and teams/<ID> query strings
- The stats will be pulled from the games array to populate the season stats section
- Include the following stats: games played, wins, losses, win percentage, points per game, rebounds per game, assists per game, steals per game, blocks per game, turnovers per game, field goal percentage, three point percentage, free throw percentage

Most recent games section:
- The most recent games section should be populated with the stats from the games played in the previous 7 days
- The stats will be pulled from the balldontlie API, specifically use the Get All Games endpoint
- The URL request should include the teams/<ID>, start_date and end_date query strings (dates will depend on current day)  
- The stats will be pulled from the games array to populate the most recent games section
- Include the following stats: date, opponent, result, points, rebounds, assists, steals, blocks

MVP section:
- The MVP section will be populated with the stats from the 3 player with the most points in the games played last week
- The stats can be retrieved from the same JSON object returned in the most recent games section
- The stats will be pulled from the games array to populate the MVP section

Calendar Button
- When the user clicks the calendar button, the user will be taken to the calendar page
*/

let upcomingGamesElement = $("#upcoming-games");
let selectedTeam = $(".dropdown-menu li");
let playerStatsElement = $("#player-stats");
const clientID = "MzE3MTIzMTB8MTY3NTE4OTk3My4zMjk3Nw";
const clientAppSecret = "dd20d1dc80a7a92527e18689f8e60bce450670b200b5f20c21ab540c556a433b";

// Show/Hide Button Element for Upcoming Games Calendar + Element calls for the two cards to be 'hidden'
var upcomingGamesBtnEl = document.querySelector("#viewUpcoming");
var seasonStatsCardEl = document.querySelector("#season-card");
var recentStatsCardEl = $("#recent-stats").css('display', 'block');

// Season Avg Card Elements
var seasonPlNameEl = $("#playerName");
var seasonPPGEl = $("#ppg");
var seasonAPGEl = $("#apg");
var seasonRPGEl = $("#rpg");
var season3PerEl = $("#tpperc");
var seasonBlocksEl = $("#bpg");
var seasonStealsEl = $("#stpg");
var seasonOrebEl = $("#oreb");
var seasonDrebEl = $("#dreb");
var seasonTPmEl = $("#tpm");
var seasonTPaEl = $("#tpa");



var seasonIconEl = $("#iconPicture");

var players = {
    "Luka Doncic": 132,
    "Nikola Jokic": 246,
    "Joel Embiid": 145,
    "Giannis Antetokounmpo": 15,
    "LeBron James": 237,
}
console.log (players.length);

// Gets a team ID from the balldontlie teams endpoint
// Used to get a list of games with the team ID from the games endpoint
function getTeamID(teamName) {
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
                    getGameStats(bdlTeamID);
                    return;
                }
            }

            // Once the city is retrieved, run the API call to get the season stats
            // getSeasonStats(teamID);
        })
}

function getPlayerID() {
    queryURL = "https://www.balldontlie.io/api/v1/players?search=LeBron";

    fetch(queryURL)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        })
}   
// getPlayerID();

// Function to get the upcoming games from the seat geek API
function getPlayerStats() {
    indexPlayers = Object.keys(players);

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
                console.log(data)
                  let playerStats = data['data'];
                  let cardHeader = $('<h5>').text(indexPlayers[i]);
                  let cardBody = $('<p>').text("Points: " + playerStats[0].pts + "\nRebounds: " + playerStats[0].reb + "\nAssists: " + playerStats[0].ast);
                  playerStatsElement.append(cardHeader, cardBody);

                // Dynamically Updating Player Info for Season Avg Card
                seasonPlNameEl.text(indexPlayers[i]);
                seasonPPGEl.text(playerStats[0].pts);
                seasonAPGEl.text(playerStats[0].ast);
                seasonRPGEl.text(playerStats[0].reb);
                season3PerEl.text((playerStats[0].fg3_pct) + "%");
                seasonBlocksEl.text(playerStats[0].blk);
                seasonStealsEl.text(playerStats[0].stl);
                seasonOrebEl.text(playerStats[0].oreb);
                seasonDrebEl.text(playerStats[0].dreb);
                seasonTPmEl.text(playerStats[0].fg3m);
                seasonTPaEl.text(playerStats[0].fg3a);
              });
        })(i); 
    } 
}
getPlayerStats();

// Hides the element so the next page can show up on a clear screen
function hide(element) {
}

// Shows the next page with whatever is in the brackets of show('page-name')
function show(element) {
    element.style.display = "block";
}

// Function to get the recent game stats from the game endpoint of balldontlie API.
function getGameStats(teamID) {
    let queryURL = "https://www.balldontlie.io/api/v1/games?team_ids[]=" + teamID + "&start_date=2023-01-01&end_date=2023-01-31&per_page=100";
    fetch(queryURL)
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function(data) {
            let gamesObject = data['data'];
            
            // Function to sort the dates of the game
            function custom_sort(a, b) {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            }    

            // Sort the games by date
            gamesObject.sort( custom_sort ); //returns the array sorted by date in ascendingorder (oldest --> newest game)
            console.log(gamesObject)
        })
}

// Test of Seat Geek API -- gets the team information.
function authenticateCredentials() {
    let team = "toronto-raptors"
    
    let queryURL = "https://api.seatgeek.com/2/performers/?slug=" + team + "&client_id=" + clientID + "&client_secret=" + clientAppSecret;
    fetch(queryURL) 
        .then(function(response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            // let teamID = data['performers'][0].id;
            // console.log(teamID);

            // Call the getTeamEvents function
            getTeamEvents(team);
        })
  }
// authenticateCredentials();

// Get the upcoming games from the seat geek API and display them in a table.
function getUpcomingGames(teamName) {
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
            upcomingGamesElement.empty();
            let nbaGames = data['events'];

            let table = $('<table>');
            let tableBody = $('<tbody>');
            let tableHead = $('<thead>');
            let rowHead = $('<tr>');
            let cellGameDateTime = $('<td>').text("Date");
            let cellTitle = $('<td>').text("Games");
            let cellVenueLocation = $('<td>').text("Venue");
            let cellBuyTickets = $('<td>').text("Tickets");

            upcomingGamesElement.append( table );
            table.append(tableHead);
            tableHead.append(rowHead);
            rowHead.append(cellGameDateTime, cellTitle, cellVenueLocation, cellBuyTickets);
            table.append( tableBody );

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



selectedTeam.click(function(event) {
    // Get the team name from the selected element. Format is correct for balldontlie API.
    let teamName = event.target.text;

    //Call the getTeamID function for the selected team to start the API calls for the season stats
    getTeamID(teamName);

    // Convert the team name to the SeatGeek query sting format
    let teamSGFormat = teamName.toLowerCase().replaceAll(" ", "-");

    // Call the getUpcomingGames function for the selected team
    getUpcomingGames(teamSGFormat);
})


// View Upcoming Games / Calendar Page Button

var showhomeCheck = true;
upcomingGamesBtnEl.addEventListener("click", function () {
    // if (showhomeCheck === true) {
        seasonStatsCardEl.style.display = "none";
        showhomeCheck = false;
    // }
    // else {
    //     seasonStatsCardEl.style.display = "flex";
    // }
});