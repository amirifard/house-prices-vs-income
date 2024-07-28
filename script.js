d3.csv("RHPI.csv").then((dataRHPI) => {
  d3.csv("RPDI.csv").then((dataRPDI) => {
    // Process data into arrays of objects with country and value for each quarter
    const rhpiData = dataRHPI.map((row) => {
      return Object.keys(row)
        .filter((key) => key !== "Quarter")
        .map((country) => ({
          quarter: row.Quarter,
          country: country,
          value: +row[country],
        }));
    });

    const rpdiData = dataRPDI.map((row) => {
      return Object.keys(row)
        .filter((key) => key !== "Quarter")
        .map((country) => ({
          quarter: row.Quarter,
          country: country,
          value: +row[country],
        }));
    });

    const continents = {
      Australia: "Oceania",
      Belgium: "Europe",
      Canada: "North America",
      Switzerland: "Europe",
      Germany: "Europe",
      Denmark: "Europe",
      Spain: "Europe",
      Finland: "Europe",
      France: "Europe",
      UK: "Europe",
      Greece: "Europe",
      Ireland: "Europe",
      Italy: "Europe",
      Japan: "Asia",
      Korea: "Asia",
      Netherlands: "Europe",
      Norway: "Europe",
      "New Zealand": "Oceania",
      Sweden: "Europe",
      US: "North America",
      "S. Africa": "Africa",
      Croatia: "Europe",
      Israel: "Asia",
      Slovenia: "Europe",
      Colombia: "South America",
      Portugal: "Europe",
    };

    const continentColors = {
      Europe: d3.schemeCategory10[0],
      Asia: d3.schemeCategory10[1],
      "North America": d3.schemeCategory10[2],
      "South America": d3.schemeCategory10[3],
      Oceania: d3.schemeCategory10[4],
      Africa: d3.schemeCategory10[5],
    };

    const countries = Object.keys(dataRHPI[0]).filter(
      (key) => key !== "Quarter"
    );
    const colorScale = d3
      .scaleOrdinal()
      .domain(countries)
      .range(
        countries.map((country) => {
          const continent = continents[country];
          return d3.interpolateRgb(
            continentColors[continent],
            "#000"
          )(Math.random() * 0.6 + 0.2);
        })
      );

    initializeScene1(rhpiData, colorScale);
    initializeScene2(rpdiData, colorScale);
    initializeScene3(rhpiData, rpdiData, colorScale);
  });
});

function initializeScene1(data, colorScale) {
  const svg = d3
    .select("#scene1")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600);
  const margin = { top: 20, right: 30, bottom: 70, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().range([0, width]);

  const y = d3.scaleBand().range([0, height]).padding(0.1);

  const timeline = d3
    .select("#timeline1")
    .attr("max", data.length - 1)
    .attr("disabled", true);

  const quarters = data.map((d) => d[0].quarter);

  // Add labels to the timeline
  const labelContainer = d3
    .select("#labels1")
    .selectAll(".timeline-label")
    .data(quarters)
    .enter()
    .append("div")
    .attr("class", "timeline-label")
    .style("left", (d, i) => `${(i / (quarters.length - 1)) * 100}%`)
    .text((d) => d);

  const updateChart = (quarterData, index) => {
    quarterData.sort((a, b) => a.value - b.value);

    x.domain([0, d3.max(quarterData, (d) => d.value)]);
    y.domain(quarterData.map((d) => d.country));

    const bars = g.selectAll(".bar").data(quarterData, (d) => d.country);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", x(0))
      .attr("y", (d) => y(d.country))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.country))
      .merge(bars)
      .transition()
      .duration(1000)
      .attr("x", x(0))
      .attr("y", (d) => y(d.country))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.country));

    bars.exit().remove();

    g.select(".x.axis").call(d3.axisBottom(x));
    g.select(".y.axis").call(d3.axisLeft(y));

    timeline.property("value", index);
  };

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`);

  g.append("g").attr("class", "y axis");

  let index = 0;
  const interval = setInterval(() => {
    if (index < data.length) {
      updateChart(data[index], index);
      index++;
    } else {
      clearInterval(interval);
      d3.select("#next1").on("click", () =>
        showScene("#scene2", () => initializeScene2Transition(data, colorScale))
      );
    }
  }, 1000);
}

function initializeScene2(data, colorScale) {
  const svg = d3
    .select("#scene2")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600);
  const margin = { top: 20, right: 30, bottom: 70, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const timeline = d3
    .select("#timeline2")
    .attr("max", data.length - 1)
    .attr("disabled", true);

  const quarters = data.map((d) => d[0].quarter);

  // Add labels to the timeline
  const labelContainer = d3
    .select("#labels2")
    .selectAll(".timeline-label")
    .data(quarters)
    .enter()
    .append("div")
    .attr("class", "timeline-label")
    .style("left", (d, i) => `${(i / (quarters.length - 1)) * 100}%`)
    .text((d) => d);

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`);

  g.append("g").attr("class", "y axis");

  d3.select("#next2").on("click", () => showScene("#scene3"));
}

function initializeScene2Transition(data, colorScale) {
  const svg = d3.select("#scene2 svg");
  const margin = { top: 20, right: 30, bottom: 70, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const g = svg.select("g");

  const timeline = d3.select("#timeline2");

  const x = d3.scaleLinear().range([0, width]);

  const y = d3.scaleBand().range([0, height]).padding(0.1);

  const updateChart = (quarterData, index) => {
    quarterData.sort((a, b) => b.value - a.value);

    x.domain([0, d3.max(quarterData, (d) => d.value)]);
    y.domain(quarterData.map((d) => d.country));

    const bars = g.selectAll(".bar").data(quarterData, (d) => d.country);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", x(0))
      .attr("y", (d) => y(d.country))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.country))
      .merge(bars)
      .transition()
      .duration(1000)
      .attr("x", x(0))
      .attr("y", (d) => y(d.country))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.country));

    bars.exit().remove();

    g.select(".x.axis").call(d3.axisBottom(x));
    g.select(".y.axis").call(d3.axisLeft(y));
    timeline.property("value", index);
  };

  let index = 0;
  const interval = setInterval(() => {
    if (index < data.length) {
      updateChart(data[index], index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

function initializeScene3(rhpiData, rpdiData, colorScale) {
  const svg = d3
    .select("#scene3")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600);
  const margin = { top: 20, right: 30, bottom: 70, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const timeline = d3
    .select("#timeline3")
    .attr("max", rhpiData.length - 1)
    .style("margin", "20px");

  const quarters = rhpiData.map((d) => d[0].quarter);

  // Add labels to the timeline
  const labelContainer = d3
    .select("#labels3")
    .selectAll(".timeline-label")
    .data(quarters)
    .enter()
    .append("div")
    .attr("class", "timeline-label")
    .style("left", (d, i) => `${(i / (quarters.length - 1)) * 100}%`)
    .text((d) => d);

  const data = rhpiData.map((d, i) => ({
    country: d.country,
    RHPI: d.value,
    RPDI: rpdiData[i].value,
    quarter: d.quarter,
  }));

  const x = d3.scaleLinear().range([0, width]);

  const y = d3.scaleLinear().range([height, 0]);

  const updateScatterPlot = (index) => {
    const currentData = data.filter((d) => d.quarter === quarters[index]);

    x.domain([0, d3.max(currentData, (d) => d.RHPI)]);
    y.domain([0, d3.max(currentData, (d) => d.RPDI)]);

    const circles = g.selectAll(".circle").data(currentData, (d) => d.country);

    circles
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", (d) => x(d.RHPI))
      .attr("cy", (d) => y(d.RPDI))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(d.country))
      .merge(circles)
      .transition()
      .duration(1000)
      .attr("cx", (d) => x(d.RHPI))
      .attr("cy", (d) => y(d.RPDI))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(d.country));

    circles.exit().remove();

    g.select(".x.axis").call(d3.axisBottom(x));
    g.select(".y.axis").call(d3.axisLeft(y));

    timeline.property("value", index);
  };

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`);

  g.append("g").attr("class", "y axis");

  timeline.on("input", function () {
    updateScatterPlot(this.value);
  });

  updateScatterPlot(rhpiData.length - 1);

  d3.select("#start-over").on("click", () => showScene("#scene1"));
}

function showScene(sceneId, callback) {
  d3.selectAll(".scene").classed("active", false);
  d3.select(sceneId).classed("active", true);
  if (callback) callback();
}