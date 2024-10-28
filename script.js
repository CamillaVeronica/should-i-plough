const apiKey = 'patFX2dgEEplG46qD.16a78faf369b72898a47099e9d31a456f5e905ec58e6bb83125e03e7abdf65e4';
const baseId = 'appgj5Mf0NuwaNBgn';

// Determines the condition key based on dropdown selections, only for standard mode
function determineConditionKey(soil-type, weather-today, recent-rainfall) {
    if (soil-type === 'clay') {
        if (weather-today === 'Wet') return 'wet_clay';
        if (weather-today === 'Windy') return 'windy_clay';
        if (weather-today === 'Sunny' && (recent-rainfall === 'None' || recent-rainfall === 'Light')) return 'dry_clay';
        if ((weather-today === 'Sunny' && recent-rainfall === 'Moderate') || weather-today === 'Ideal') return 'ideal_clay';
        if (weather-today === 'Frozen') return 'frozen_clay';
        if (weather-today === 'Ideal' && (recent-rainfall === 'Moderate' || recent-rainfall === 'Heavy')) return 'rain_today_clay';
    } else if (soil-type === 'sandy') {
        if (weather-today === 'Wet') return 'wet_sandy';
        if (weather-today === 'Windy') return 'windy_sandy';
        if (weather-today === 'Sunny' && recent-rainfall === 'None') return 'dry_sandy';
        if ((weather-today === 'Sunny' && (recent-rainfall === 'Light' || recent-rainfall === 'Moderate')) || weather-today === 'Ideal') return 'ideal_sandy';
        if (weather-today === 'Frozen') return 'frozen_sandy';
        if (weather-today === 'Ideal' && (recent-rainfall === 'Moderate' || recent-rainfall === 'Heavy')) return 'rain_today_sandy';
    } else if (soil-type === 'loam') {
        if (weather-today === 'Wet') return 'wet_loam';
        if (weather-today === 'Windy') return 'windy_loam';
        if (weather-today === 'Sunny' && (recent-rainfall === 'None' || recent-rainfall === 'Light')) return 'dry_loam';
        if ((weather-today === 'Sunny' && recent-rainfall === 'Moderate') || weather-today === 'Ideal') return 'ideal_loam';
        if (weather-today === 'Frozen') return 'frozen_loam';
        if (weather-today === 'Ideal' && (recent-rainfall === 'Moderate' || recent-rainfall === 'Heavy')) return 'rain_today_loam';
    }
    return null; // Default if no condition matches
}

function determineMode() {
    return document.getElementById('regen-toggle').checked ? 'regen' : 'standard';
}

// Fetches responses from Airtable; uses a generic query if regen mode is on
async function getResponses(conditionKey, mode) {
    const filterFormula = mode === 'regen' 
        ? `{Mode}='regen'` 
        : `AND({Condition+Key}='${conditionKey}', {Mode}='standard')`;
    
    const url = `https://api.airtable.com/v0/${baseId}/Responses?filterByFormula=${encodeURIComponent(filterFormula)}`;
    
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` }
    });
    const data = await response.json();
    return data.records.map(record => ({
        text: record.fields["Text Response"],
        gif: record.fields["GIF URL"]
    }));
}

function selectRandomResponse(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

// Checks plough conditions and displays the appropriate response
async function checkPloughConditions() {
    const soil-type = document.getElementById('soil-type').value;
    const weather-today = document.getElementById('weather-today').value;
    const recentRain = document.getElementById('recent-rain').value;
    const mode = determineMode();

    // Only determine conditionKey if in standard mode
    const conditionKey = mode === 'regen' ? null : determineConditionKey(soil-type, weather-today, recentRain);
    
    const responses = await getResponses(conditionKey, mode);

    if (responses.length > 0) {
        const response = selectRandomResponse(responses);
        document.getElementById('result-text').innerText = response.text;
        document.getElementById('result-gif').src = response.gif;
        document.getElementById('result-gif').style.display = 'block';
    } else {
        document.getElementById('result-text').innerText = "No response available.";
        document.getElementById('result-gif').style.display = 'none';
    }
}

// Run error logging
async function getResponses(conditionKey, mode) {
    const filterFormula = mode === 'regen' 
        ? `{Mode}='regen'` 
        : `AND({Condition Key}='${conditionKey}', {Mode}='standard')`;
    
    const url = `https://api.airtable.com/v0/${baseId}/Responses?filterByFormula=${encodeURIComponent(filterFormula)}`;
    
    try {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            const errorData = await response.json();
            console.error("Error details:", errorData);
            return [];
        }
        
        const data = await response.json();
        return data.records.map(record => ({
            text: record.fields["Text Response"],
            gif: record.fields["GIF URL"]
        }));
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}

// Console log
async function getResponses(conditionKey, mode) {
    const filterFormula = mode === 'regen' 
        ? `{Mode}='regen'` 
        : `AND({Condition Key}='${conditionKey}', {Mode}='standard')`;
    
    const url = `https://api.airtable.com/v0/${baseId}/Responses?filterByFormula=${encodeURIComponent(filterFormula)}`;
    
    try {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return [];
        }
        
        const data = await response.json();
        
        // Log data to check if records are being returned
        console.log("Data from Airtable:", data);

        return data.records.map(record => ({
            text: record.fields["Text Response"],
            gif: record.fields["GIF URL"]
        }));
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}

async function checkPloughConditions() {
    const soil-type = document.getElementById('soil-type').value;
    const weather-today = document.getElementById('weather-today').value;
    const recentRain = document.getElementById('recent-rain').value;
    const mode = determineMode();

    // Log the values to check if they are what you expect
    const conditionKey = mode === 'regen' ? null : determineConditionKey(soil-type, weather-today, recentRain);
    console.log("Condition Key:", conditionKey, "Mode:", mode);
    
    const responses = await getResponses(conditionKey, mode);

    if (responses.length > 0) {
        const response = selectRandomResponse(responses);
        document.getElementById('result-text').innerText = response.text;
        document.getElementById('result-gif').src = response.gif;
        document.getElementById('result-gif').style.display = 'block';
    } else {
        document.getElementById('result-text').innerText = "No response available.";
        document.getElementById('result-gif').style.display = 'none';
    }
}


