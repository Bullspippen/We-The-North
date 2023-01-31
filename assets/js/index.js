/* Landing page notes 

Search bar functionality:
- When the user enters a city name, the city name is saved to local storage
- The event listener will be a click on the search button
- When the user enters a city name, the city name is used to get the stats from the balldontlie API
- The city name the user input will be used to get the team ID from the balldontlie API
- Use the Get Teams endpoint, query string of search=city name

*/
function getBallStats() {
    
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
            console.log(teamsObject);
            for (let i = 0; i < teamsObject.length; i++) {
                if (teamsObject[i].city === "Toronto") {
                    // Get the team ID from the object
                    let teamID = teamsObject[i].id;
                    console.log(teamID);
                    // Break out of the loop
                    break;
                }
            }

            // Once the city is retrieved, run the API call to get the season stats
            // getSeasonStats(teamID);
        })
}

getBallStats();
/*

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


Calendar page notes

*/