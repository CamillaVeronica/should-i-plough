const apiKey = 'patFX2dgEEplG46qD.16a78faf369b72898a47099e9d31a456f5e905ec58e6bb83125e03e7abdf65e4';
const baseId = 'appgj5Mf0NuwaNBgn';

// Determines the condition key based on dropdown selections, only for standard mode
function determineConditionKey(soilType, weatherToday, recentRainfall) {
    if (soilType === 'clay') {
        if (weatherToday === 'Wet') return 'wet_clay';
        if (weatherToday === 'Windy') return 'windy_clay';
        if (weatherToday === 'Sunny' && (recentRainfall === 'None' || recentRainfall === 'Light')) return 'dry_clay';
        if ((weatherToday === 'Sunny' && recentRainfall === 'Moderate') || weatherToday === 'Ideal') return 'ideal_clay';
        if (weatherToday === 'Frozen') return 'frozen_clay';
        if (weatherToday === 'Ideal' && (recentRainfall === 'Moderate' || recentRainfall === 'Heavy')) return 'rain_today_clay';
    } else if (soilType === 'sandy') {
        if (weatherToday === 'Wet') return 'wet_sandy';
        if (weatherToday === 'Windy') return 'windy_sandy';
        if (weatherToday === 'Sunny' && recentRainfall === 'None') return 'dry_sandy';
        if ((weatherToday === 'Sunny' && (recentRainfall === 'Light' || recentRainfall === 'Moderate')) || weatherToday === 'Ideal') return 'ideal_sandy';
        if (weatherToday === 'Frozen') return 'frozen_sandy';
        if (weatherToday === 'Ideal' && (recentRainfall === 'Moderate' || recentRainfall === 'Heavy')) return 'rain_today_sandy';
    } else if (soilType === 'loam') {
        if (weatherToday === 'Wet') return 'wet_loam';
        if (weatherToday === 'Windy') return 'windy_loam';
        if (weatherToday === 'Sunny' && (recentRainfall === 'None' || recentRainfall === 'Light')) return 'dry_loam';
        if ((weatherToday === 'Sunny' && recentRainfall === 'Moderate') || weatherToday === 'Ideal') return 'ideal_loam';
        if (weatherToday === 'Frozen') return 'frozen_loam';
        if (weatherToday === 'Ideal' && (recentRainfall === 'Moderate' || recentRainfall === 'Heavy')) return 'rain_today_loam';
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
    const soilType = document.getElementById('soil-type').value;
    const weatherToday = document.getElementById('weather-today').value;
    const recentRain = document.getElementById('recent-rain').value;
    const mode = determineMode();

    // Only determine conditionKey if in standard mode
    const conditionKey = mode === 'regen' ? null : determineConditionKey(soilType, weatherToday, recentRain);
    
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
