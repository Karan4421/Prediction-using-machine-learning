const axios = require('axios');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Function to fetch and parse the HTML content of a webpage
const fetchAndParseHTML = async (url) => {
    try {
        // Fetch HTML content of the webpage
        const response = await axios.get(url);
        // Load HTML content into Cheerio
        const $ = cheerio.load(response.data);
        return $;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

// Function to scrape match summary links from a webpage and extract the year from the URL
const scrapeMatchSummaryLinks = async () => {
    try {
        const url = 'https://www.espncricinfo.com/records/tournament/team-match-results/icc-world-cup-2002-03-865';
        const $ = await fetchAndParseHTML(url);
        
        // Extracting the year from the URL
        const year = url.match(/\d{4}/)[0];

        // Array to store match summary links
        let links = [];

        // Selecting all rows from the target table
        const allRows = $('table.ds-w-full > tbody > tr');

        // Looping through each row and extracting link
        allRows.each((index, element) => {
            const tds = $(element).find('td');
            const href = $(tds[6]).find('a').attr('href');
            if (href) { // Check if href is not undefined or empty
                const rowURL = "https://www.espncricinfo.com" + href;
                links.push(rowURL);
            } else {
                // Optionally log or handle the absence of a valid URL
                console.log("Invalid URL found at row", index);
            }
        });

        return { links, year };
    } catch (error) {
        console.error('Error scraping match summary links:', error);
        return null;
    }
};

// Function to scrape batting summary data from a match summary page
const scrapeBattingSummary = async (url) => {
    try {
        const $ = await fetchAndParseHTML(url);

        var teamNames = [];
        $('span:contains("Innings")').each(function() {
            var text = $(this).text().replace(" Innings", "");
            if (text && !teamNames.includes(text)) { // Avoid duplicates
                teamNames.push(text);
            }
        });

        // Ensure at least two team names are found
        if (teamNames.length >= 2) {
            var team1 = teamNames[0];
            var team2 = teamNames[1];
            var matchInfo = team1 + ' Vs ' + team2;
        } else {
            console.log("Could not find enough team names.");
            return null;
        }

        var tables = $('div > table.ci-scorecard-table');
        var firstInningRows = $(tables.eq(0)).find('tbody > tr').filter(function(index, element){
            return $(this).find("td").length >= 8
        });

        var secondInningsRows = $(tables.eq(1)).find('tbody > tr').filter(function(index, element){
            return $(this).find("td").length >= 8
        });

        // Array to store batting summary data
        var battingSummary = [];

        // Extracting data for first innings
        firstInningRows.each((index, element) => {
            var tds = $(element).find('td');
            battingSummary.push({
                "match": matchInfo,
                "teamInnings": team1,
                "battingPos": index+1,
                "batsmanName": $(tds.eq(0)).find('a > span > span').text().replace(' ', ''),
                "dismissal": $(tds.eq(1)).find('span > span').text(),
                "runs": $(tds.eq(2)).find('strong').text(), 
                "balls": $(tds.eq(3)).text(),
                "4s": $(tds.eq(5)).text(),
                "6s": $(tds.eq(6)).text(),
                "SR": $(tds.eq(7)).text()
            });
        });

        // Extracting data for second innings
        secondInningsRows.each((index, element) => {
            var tds = $(element).find('td');
            battingSummary.push({
                "match": matchInfo,
                "teamInnings": team2,
                "battingPos": index+1,
                "batsmanName": $(tds.eq(0)).find('a > span > span').text().replace(' ', ''),
                "dismissal": $(tds.eq(1)).find('span > span').text(),
                "runs": $(tds.eq(2)).find('strong').text(), 
                "balls": $(tds.eq(3)).text(),
                "4s": $(tds.eq(5)).text(),
                "6s": $(tds.eq(6)).text(),
                "SR": $(tds.eq(7)).text()
            });
        });

        return battingSummary;
    } catch (error) {
        console.error('Error scraping batting summary:', error);
        return null;
    }
};

// Function to save data to CSV file
const saveToCSV = (data, year) => {
    const filename = `battingdata${year}.csv`;
    const csvWriter = createCsvWriter({
        path: filename,
        header: [
            {id: 'match', title: 'Match'},
            {id: 'teamInnings', title: 'Team Innings'},
            {id: 'battingPos', title: 'Batting Position'},
            {id: 'batsmanName', title: 'Batsman Name'},
            {id: 'dismissal', title: 'Dismissal'},
            {id: 'runs', title: 'Runs'},
            {id: 'balls', title: 'Balls'},
            {id: '4s', title: '4s'},
            {id: '6s', title: '6s'},
            {id: 'SR', title: 'Strike Rate'}
        ]
    });

    csvWriter.writeRecords(data)
        .then(() => {
            console.log('Data saved to CSV file:', filename);
        })
        .catch((error) => {
            console.error('Error saving data to CSV:', error);
        });
};

// Main function to orchestrate the scraping process
const main = async () => {
    try {
        // Scrape match summary links and extract the year
        const { links, year } = await scrapeMatchSummaryLinks();
        if (!links || links.length === 0 || !year) {
            console.log('No match summary links found or year missing.');
            return;
        }

        // Scrape and save batting summary for each match
        let allBattingSummary = [];
        for (let url of links) {
            const battingSummary = await scrapeBattingSummary(url);
            if (battingSummary) {
                allBattingSummary.push(...battingSummary);
            } else {
                console.log('Error scraping batting summary for:', url);
            }
        }

        // Save all batting summary data to CSV
        saveToCSV(allBattingSummary, year);
    } catch (error) {
        console.error('Main error:', error);
    }
};

// Execute the main function
main();
