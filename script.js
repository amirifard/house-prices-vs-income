d3.csv('RHPI.csv').then(dataRHPI => {
    d3.csv('RPDI.csv').then(dataRPDI => {
        initializeScene1(dataRHPI);
        initializeScene2(dataRPDI);
        initializeScene3(dataRHPI, dataRPDI);
    });
});

function initializeScene1(data) {
    const svg = d3.select("#scene1").append("svg").attr("width", 800).attr("height", 600);
    // Sort data by RHPI
    data.sort((a, b) => a.RHPI - b.RHPI);
    // Create bars
    // Animate timeline
    let index = 0;
    const interval = setInterval(() => {
        if (index < data.length) {
            const d = data[index];
            svg.append("rect")
                .attr("x", 100)
                .attr("y", index * 20)
                .attr("width", d.RHPI * 10)
                .attr("height", 15)
                .attr("fill", "steelblue");
            svg.append("text")
                .attr("x", 10)
                .attr("y", index * 20 + 12)
                .text(d.Country);
            index++;
        } else {
            clearInterval(interval);
            d3.select("#scene1").append("button").text("Next").on("click", () => showScene("#scene2"));
        }
    }, 500);
}

function initializeScene2(data) {
    const svg = d3.select("#scene2").append("svg").attr("width", 800).attr("height", 600);
    // Sort data by RPDI
    data.sort((a, b) => b.RPDI - a.RPDI);
    // Create bars
    // Animate timeline
    let index = 0;
    const interval = setInterval(() => {
        if (index < data.length) {
            const d = data[index];
            svg.append("rect")
                .attr("x", 100)
                .attr("y", index * 20)
                .attr("width", d.RPDI * 10)
                .attr("height", 15)
                .attr("fill", "orange");
            svg.append("text")
                .attr("x", 10)
                .attr("y", index * 20 + 12)
                .text(d.Country);
            index++;
        } else {
            clearInterval(interval);
            d3.select("#scene2").append("button").text("Next").on("click", () => showScene("#scene3"));
        }
    }, 500);
}

function initializeScene3(dataRHPI, dataRPDI) {
    const svg = d3.select("#scene3").append("svg").attr("width", 800).attr("height", 600);
    // Create scatter plot
    const data = dataRHPI.map((d, i) => ({
        Country: d.Country,
        RHPI: +d.RHPI,
        RPDI: +dataRPDI[i].RPDI
    }));

    const xScale = d3.scaleLinear().domain([0, d3.max(data, d => d.RHPI)]).range([100, 700]);
    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.RPDI)]).range([500, 100]);

    svg.append("g").attr("transform", "translate(0,500)").call(d3.axisBottom(xScale));
    svg.append("g").attr("transform", "translate(100,0)").call(d3.axisLeft(yScale));

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.RHPI))
        .attr("cy", d => yScale(d.RPDI))
        .attr("r", 5)
        .attr("fill", "green");

    svg.selectAll("text.label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.RHPI))
        .attr("y", d => yScale(d.RPDI))
        .attr("dx", 7)
        .attr("dy", -7)
        .attr("font-size", "10px")
        .text(d => d.Country);
}

function showScene(sceneId) {
    d3.selectAll(".scene").classed("active", false);
    d3.select(sceneId).classed("active", true);
}