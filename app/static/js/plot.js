document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('salary-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var minSalary = document.getElementById('min-salary').value;
        var maxSalary = document.getElementById('max-salary').value;
        fetch(`/data?min_salary=${minSalary}&max_salary=${maxSalary}`)
            .then(response => response.json())
            .then(data => {
                var trace = {
                    x: data.salary_range,
                    y: data.pdf,
                    type: 'scatter',
                    fill: 'tozeroy',
                    name: 'Salary Distribution',
                    hovertemplate: 'Salary: %{x}k<br>Probability Density: %{y:.4f}<br>Percentile: %{customdata:.2f}%<extra></extra>',
                    customdata: data.percentiles
                };

                var layout = {
                    title: `Salary Distribution within the Range ${minSalary}k to ${maxSalary}k`,
                    xaxis: {title: 'Salary (k)'},
                    yaxis: {title: 'Probability Density'},
                    shapes: [
                        {
                            type: 'line',
                            x0: data.mean,
                            y0: 0,
                            x1: data.mean,
                            y1: Math.max(...data.pdf),
                            line: {color: 'orange', dash: 'dash'},
                            name: 'Mean'
                        },
                        {
                            type: 'line',
                            x0: data.seventy_fifth_percentile,
                            y0: 0,
                            x1: data.seventy_fifth_percentile,
                            y1: Math.max(...data.pdf),
                            line: {color: 'green', dash: 'dash'},
                            name: '75th Percentile'
                        },
                        {
                            type: 'line',
                            x0: minSalary,
                            y0: 0,
                            x1: minSalary,
                            y1: Math.max(...data.pdf),
                            line: {color: 'red', dash: 'dash'},
                            name: 'Lower Bound'
                        },
                        {
                            type: 'line',
                            x0: maxSalary,
                            y0: 0,
                            x1: maxSalary,
                            y1: Math.max(...data.pdf),
                            line: {color: 'red', dash: 'dash'},
                            name: 'Upper Bound'
                        }
                    ],
                    annotations: [
                        {
                            x: data.mean,
                            y: Math.max(...data.pdf),
                            xref: 'x',
                            yref: 'y',
                            text: 'Mean',
                            showarrow: true,
                            arrowhead: 7,
                            ax: 0,
                            ay: -40,
                            arrowcolor: 'orange',
                            font: { color: 'orange' }
                        },
                        {
                            x: data.seventy_fifth_percentile,
                            y: Math.max(...data.pdf),
                            xref: 'x',
                            yref: 'y',
                            text: '75th Percentile',
                            showarrow: true,
                            arrowhead: 7,
                            ax: 0,
                            ay: -40,
                            arrowcolor: 'green',
                            font: { color: 'green' }
                        },
                        {
                            x: minSalary,
                            y: Math.max(...data.pdf),
                            xref: 'x',
                            yref: 'y',
                            text: 'Lower Bound',
                            showarrow: true,
                            arrowhead: 7,
                            ax: 0,
                            ay: -40,
                            arrowcolor: 'red',
                            font: { color: 'red' }
                        },
                        {
                            x: maxSalary,
                            y: Math.max(...data.pdf),
                            xref: 'x',
                            yref: 'y',
                            text: 'Upper Bound',
                            showarrow: true,
                            arrowhead: 7,
                            ax: 0,
                            ay: -40,
                            arrowcolor: 'red',
                            font: { color: 'red' }
                        }
                    ],
                    hovermode: 'closest'
                };

                Plotly.newPlot('plot', [trace], layout);

                // Update the table with percentile values
                var table = document.getElementById('percentile-table');
                table.innerHTML = '<tr><th>Percentile</th><th>Salary (k)</th></tr>';
                for (var p in data.salary_percentiles) {
                    var label;
                    switch (p) {
                        case '50':
                            label = 'Top 50%';
                            break;
                        case '70':
                            label = 'Top 30%';
                            break;
                        case '75':
                            label = 'Top 25%';
                            break;
                        case '80':
                            label = 'Top 20%';
                            break;
                        case '85':
                            label = 'Top 15%';
                            break;
                        case '90':
                            label = 'Top 10%';
                            break;
                        case '95':
                            label = 'Top 5%';
                            break;
                        case '99':
                            label = 'Top 1%';
                            break;
                        default:
                            label = `${p}th Percentile`;
                    }
                    var row = `<tr><td>${label}</td><td>$${data.salary_percentiles[p].toFixed(2)}k</td></tr>`;
                    table.innerHTML += row;
                }
            });
    });

    // Initial plot
    fetch('/data?min_salary=35&max_salary=40')
        .then(response => response.json())
        .then(data => {
            var trace = {
                x: data.salary_range,
                y: data.pdf,
                type: 'scatter',
                fill: 'tozeroy',
                name: 'Salary Distribution',
                hovertemplate: 'Salary: %{x}k<br>Probability Density: %{y:.4f}<br>Percentile: %{customdata:.2f}%<extra></extra>',
                customdata: data.percentiles
            };

            var layout = {
                title: 'Salary Distribution within the Range 35k to 40k',
                xaxis: {title: 'Salary (k)'},
                yaxis: {title: 'Probability Density'},
                shapes: [
                    {
                        type: 'line',
                        x0: data.mean,
                        y0: 0,
                        x1: data.mean,
                        y1: Math.max(...data.pdf),
                        line: {color: 'orange', dash: 'dash'},
                        name: 'Mean'
                    },
                    {
                        type: 'line',
                        x0: data.seventy_fifth_percentile,
                        y0: 0,
                        x1: data.seventy_fifth_percentile,
                        y1: Math.max(...data.pdf),
                        line: {color: 'green', dash: 'dash'},
                        name: '75th Percentile'
                    },
                    {
                        type: 'line',
                        x0: 35,
                        y0: 0,
                        x1: 35,
                        y1: Math.max(...data.pdf),
                        line: {color: 'red', dash: 'dash'},
                        name: 'Lower Bound'
                    },
                    {
                        type: 'line',
                        x0: 40,
                        y0: 0,
                        x1: 40,
                        y1: Math.max(...data.pdf),
                        line: {color: 'red', dash: 'dash'},
                        name: 'Upper Bound'
                    }
                ],
                annotations: [
                    {
                        x: data.mean,
                        y: Math.max(...data.pdf),
                        xref: 'x',
                        yref: 'y',
                        text: 'Mean',
                        showarrow: true,
                        arrowhead: 7,
                        ax: 0,
                        ay: -40,
                        arrowcolor: 'orange',
                        font: { color: 'orange' }
                    },
                    {
                        x: data.seventy_fifth_percentile,
                        y: Math.max(...data.pdf),
                        xref: 'x',
                        yref: 'y',
                        text: '75th Percentile',
                        showarrow: true,
                        arrowhead: 7,
                        ax: 0,
                        ay: -40,
                        arrowcolor: 'green',
                        font: { color: 'green' }
                    },
                    {
                        x: 35,
                        y: Math.max(...data.pdf),
                        xref: 'x',
                        yref: 'y',
                        text: 'Lower Bound',
                        showarrow: true,
                        arrowhead: 7,
                        ax: 0,
                        ay: -40,
                        arrowcolor: 'red',
                        font: { color: 'red' }
                    },
                    {
                        x: 40,
                        y: Math.max(...data.pdf),
                        xref: 'x',
                        yref: 'y',
                        text: 'Upper Bound',
                        showarrow: true,
                        arrowhead: 7,
                        ax: 0,
                        ay: -40,
                        arrowcolor: 'red',
                        font: { color: 'red' }
                    }
                ],
                hovermode: 'closest'
            };

            Plotly.newPlot('plot', [trace], layout);

            // Populate the table with initial percentile values
            var table = document.getElementById('percentile-table');
            table.innerHTML = '<tr><th>Percentile</th><th>Salary (k)</th></tr>';
            for (var p in data.salary_percentiles) {
                var label;
                switch (p) {
                    case '50':
                        label = 'Top 50%';
                        break;
                    case '70':
                        label = 'Top 30%';
                        break;
                    case '75':
                        label = 'Top 25%';
                        break;
                    case '80':
                        label = 'Top 20%';
                        break;
                    case '85':
                        label = 'Top 15%';
                        break;
                    case '90':
                        label = 'Top 10%';
                        break;
                    case '95':
                        label = 'Top 5%';
                        break;
                    case '99':
                        label = 'Top 1%';
                        break;
                    default:
                        label = `${p}th`;
                }
                var row = `<tr><td>${label}</td><td>$${data.salary_percentiles[p].toFixed(2)}k</td></tr>`;
                table.innerHTML += row;
            }
        }
    );
}
);


