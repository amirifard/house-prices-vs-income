d3.csv('RHPI.csv').then(dataRHPI => {
    d3.csv('RPDI.csv').then(dataRPDI => {
        // Process data into arrays of objects with country and value for each quarter
        const rhpiData = dataRHPI.map(row => {
            return Object.keys(row).filter(key => key !== 'Quarter').map(country => ({
                quarter: row.Quarter,
                country: country,
                value: +row[country]
            }));
        });

        const rpdiData = dataRPDI.map(row => {
            return Object.keys(row).filter(key => key !== 'Quarter').map(country => ({
                quarter: row.Quarter,
                country: country,
                value: +row[country]
            }));
        });

        initializeScene1(rhpiData);
        initializeScene2(rpdiData);
        initializeScene3(rhpiData[rhpiData.length - 1], rpdiData[rpdiData.length - 1]); // Use latest quarter for the scatter plot
    });
});

function initializeScene1(data) {
    const svg = d3.select("#scene1").append("svg")
                  .attr("width", 800)
                  .attr("height", 600);
    const margin = {top: 20, right: 30, bottom: 40, left: 90},
          width = 800 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const g = svg.append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
                .range([0, width]);

    const y = d3.scaleBand()
                .range([0, height])
                .padding(0.1);

    const updateChart = (quarterData) => {
        quarterData.sort((a, b) => a.value - b.value);

        x.domain([0, d3.max(quarterData, d => d.value)]);
        y.domain(quarterData.map(d => d.country));

        const bars = g.selectAll(".bar")
                      .data(quarterData, d => d.country);

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", x(0))
            .attr("y", d => y(d.country))
            .attr("width", d => x(d.value))
            .attr("height", y.bandwidth())
            .attr("fill", "steelblue")
            .merge(bars)
            .transition()
            .duration(100)
            .attr("x", x(0))
            .attr("y", d => y(d.country))
            .attr("width", d => x(d.value))
            .attr("height", y.bandwidth())
            .attr("fill", "steelblue");

        bars.exit().remove();

        g.select(".x.axis").call(d3.axisBottom(x));
        g.select(".y.axis").call(d3.axisLeft(y));
    };

    g.append("g")
     .attr("class", "x axis")
     .attr("transform", `translate(0,${height})`);

    g.append("g")
     .attr("class", "y axis");

    let index = 0;
    const interval = setInterval(() => {
        if (index < data.length) {
            updateChart(data[index]);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 100);

    d3.select("#next1").on("click", () => showScene("#scene2"));
}

function initializeScene2(data) {
    const svg = d3.select("#scene2").append("svg")
                  .attr("width", 800)
                  .attr("height", 600);
    const margin = {top: 20, right: 30, bottom: 40, left: 90},
          width = 800 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const g = svg.append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`);

    data.sort((a, b) => b.value - a.value);

    const x = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range([0, width]);

    const y = d3.scaleBand()
                .domain(data.map(d => d.country))
                .range([0, height])
                .padding(0.1);

    g.append("g")
     .attr("class", "x axis")
     .attr("transform", `translate(0,${height})`)
     .call(d3.axisBottom(x));

    g.append("g")
     .attr("class", "y axis")
     .call(d3.axisLeft(y));

    let index = 0;
    const interval = setInterval(() => {
        if (index < data.length) {
            const d = data[index];
            g.append("rect")
             .attr("x", x(0))
             .attr("y", y(d.country))
             .attr("width", x(d.value))
             .attr("height", y.bandwidth())
             .attr("fill", "orange");
            index++;
        } else {
            clearInterval(interval);
        }
    }, 500);

    d3.select("#next2").on("click", () => showScene("#scene3"));
}

function initializeScene3(rhpiData, rpdiData) {
    const svg = d3.select("#scene3").append("svg")
                  .attr("width", 800)
                  .attr("height", 600);
    const margin = {top: 20, right: 30, bottom: 40, left: 90},
          width = 800 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const g = svg.append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = rhpiData.map((d, i) => ({
        country: d.country,
        RHPI: d.value,
        RPDI: rpdiData[i].value
    }));

    const x = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.RHPI)])
                .range([0, width]);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.RPDI)])
                .range([height, 0]);

    g.append("g")
     .attr("class", "x axis")
     .attr("transform", `translate(0,${height})`)
     .call(d3.axisBottom(x));

    g.append("g")
     .attr("class", "y axis")
     .call(d3.axisLeft(y));

    g.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", d => x(d.RHPI))
     .attr("cy", d => y(d.RPDI))
     .attr("r", 5)
     .attr("fill", "green");

    g.selectAll("text.label")
     .data(data)
     .enter()
     .append("text")
     .attr("x", d => x(d.RHPI))
     .attr("y", d => y(d.RPDI))
     .attr("dx", 7)
     .attr("dy", -7)
     .attr("font-size", "10px")
     .text(d => d.country);

    d3.select("#start-over").on("click", () => showScene("#scene1"));
}

function showScene(sceneId) {
    d3.selectAll(".scene").classed("active", false);
    d3.select(sceneId).classed("active", true);
}