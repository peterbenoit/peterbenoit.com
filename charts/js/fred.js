class HousingMarket {
    constructor(config) {
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
        this.series = config.series;
        this.apiCacheDir = 'API'; // Directory for caching API results
    }

    // Method to build the FRED API URL
    buildUrl(seriesId) {
        return `${this.baseUrl}?series_id=${seriesId}&api_key=${this.apiKey}&file_type=json`;
    }

    // Method to get the cache file path
    getCacheFilePath(seriesId) {
        return `${this.apiCacheDir}/${seriesId}.json`;
    }

    // Method to fetch data from local cache
    async fetchLocalData(seriesId) {
        try {
            const response = await fetch(this.getCacheFilePath(seriesId));
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching local data:', error);
        }
        return null;
    }

    // Method to save data to local cache
    async saveToLocalCache(seriesId, data) {
        try {
            const response = await fetch(`/save-cache?seriesId=${seriesId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response.ok;
        } catch (error) {
            console.error('Error saving to local cache:', error);
        }
    }

    // Method to fetch data from FRED API, with a fallback to local cache
    async fetchData(seriesId) {
        const url = this.buildUrl(seriesId);
        try {
            // Attempt to fetch data from the API first
            const response = await fetch(url);
            const data = await response.json();
            if (data.observations) {
                // Save the fetched data to local cache
                this.saveToLocalCache(seriesId, data);
                return data.observations;
            }
        } catch (error) {
            console.error('Error fetching data from FRED API:', error);

            // If the API request fails, try fetching from the local cache
            const localData = await this.fetchLocalData(seriesId);
            if (localData) {
                console.warn('Using cached data due to API failure.');
                return localData.observations;
            }
        }

        return null; // Return null if both API and local cache fail
    }

    // Method to process the data for Chart.js
    processData(data) {
        const last12Months = new Date();
        last12Months.setMonth(last12Months.getMonth() - 12);

        const filteredData = data.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= last12Months;
        });

        const labels = filteredData.map(entry => entry.date);
        const values = filteredData.map(entry => parseFloat(entry.value));

        return { labels, values };
    }

    // Method to create and append a canvas element along with a description
    createCanvasElement(series) {
        const container = document.getElementById('chart-container'); // Ensure you have a container in your HTML
        const section = document.createElement('section');
        
        const heading = document.createElement('h2');
        heading.textContent = series.name;

        const description = document.createElement('p');
        description.textContent = series.description;

        const canvas = document.createElement('canvas');
        canvas.id = series.canvasId;
        canvas.width = 400;
        canvas.height = 200;

        section.appendChild(heading);
        section.appendChild(description);
        section.appendChild(canvas);
        container.appendChild(section);
    }

    // Method to render a chart using Chart.js
    renderChart(data, series) {
        const { labels, values } = this.processData(data);

        const ctx = document.getElementById(series.canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: series.name,
                    data: values,
                    backgroundColor: series.color,
                    borderColor: series.color.replace('0.2', '1'),  // Adjust border color to be opaque
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // Method to initialize the data fetching, chart creation, and chart rendering
    async init() {
        for (const series of this.series) {
            this.createCanvasElement(series); // Dynamically add the canvas element
            const data = await this.fetchData(series.id);
            if (data) {
                this.renderChart(data, series);
            }
        }
    }
}

// Load the configuration and initialize the HousingMarket class
fetch('config/florida.json')
    .then(response => response.json())
    .then(config => {
        const housingMarket = new HousingMarket(config);
        housingMarket.init();
    })
    .catch(error => console.error('Error loading config:', error));
