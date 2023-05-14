import React, { useState } from 'react';
import { Chart } from 'chart.js/auto';
import _ from 'lodash';
import Papa from "papaparse";

function App() {
    const [histogramData, setHistogramData] = useState([]);

    const fetchHistogramData = async () => {
        const response = await fetch('https://www.terriblytinytales.com/test.txt');
        const text = await response.text();
        const words = text.toLowerCase().match(/\b\w+\b/g);
        const wordCount = _.countBy(words);
        const sortedWordCount = _.orderBy(Object.entries(wordCount), ['1'], ['desc']);
        const top20 = sortedWordCount.slice(0, 20);
        setHistogramData(top20);
        renderHistogramChart(top20);
        console.log('fhd')
    };

    const renderHistogramChart = (data) => {
        console.log("rhd")
        const ctx = document.getElementById('histogramChart');
        // ctx.size()
        ctx.height = 150;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(([word, count]) => word),
                datasets: [
                    {
                        label: 'Word Frequency',
                        data: data.map(([word, count]) => count),
                        backgroundColor: '#007bff',
                        borderWidth: 1,
                    },
                ],
            },
        });
    };
    const exportHistogramData = () => {
        const csv = Papa.unparse(histogramData);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    );
    downloadLink.setAttribute("download", "histogram.csv");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };


    

    return (
        <div>
            <button onClick={fetchHistogramData}>Submit</button>
            <canvas id="histogramChart" />
            {histogramData.length > 0 && (
                <button onClick={exportHistogramData}>Export</button>
            )}
        </div>
    );
}

export default App;