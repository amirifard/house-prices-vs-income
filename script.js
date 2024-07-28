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

    const countries = Object.keys(dataRHPI[0]).filter(
      (key) => key !== "Quarter"
    );
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(countries);

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
  const margin = { top: 20, right: 30, bottom: 40, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().range([0, width]);

  const y = d3.scaleBand().range([0, height]).padding(0.1);

  const timeline = d3
    .select("#scene1")
    .append("input")
    .attr("type", "range")
    .attr("min", 0)
    .attr("max", data.length - 1)
    .attr("value", 0)
    .attr("disabled", true)
    .style("width", "80%")
    .style("margin", "20px");

  const quarters = data.map((d) => d[0].quarter);

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
      .duration(100)
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
  }, 500);
}

function initializeScene2(data, colorScale) {
  const svg = d3
    .select("#scene2")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600);
  const margin = { top: 20, right: 30, bottom: 40, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const timeline = d3
    .select("#scene2")
    .append("input")
    .attr("type", "range")
    .attr("min", 0)
    .attr("max", data.length - 1)
    .attr("value", 0)
    .attr("disabled", true)
    .style("width", "80%")
    .style("margin", "20px");

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`);

  g.append("g").attr("class", "y axis");

  d3.select("#next2").on("click", () => showScene("#scene3"));
}

function initializeScene2Transition(data, colorScale) {
  const svg = d3.select("#scene2 svg");
  const margin = { top: 20, right: 30, bottom: 40, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const g = svg.select("g");

  const timeline = d3.select("#scene2 input[type='range']");

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
      .duration(100)
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
  }, 500);
}

function initializeScene3(rhpiData, rpdiData, colorScale) {
  const svg = d3
    .select("#scene3")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600);
  const margin = { top: 20, right: 30, bottom: 40, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const timeline = d3
    .select("#scene3")
    .append("input")
    .attr("type", "range")
    .attr("min", 0)
    .attr("max", rhpiData.length - 1)
    .attr("value", rhpiData.length - 1)
    .attr("disabled", true)
    .style("width", "80%")
    .style("margin", "20px");

  const data = rhpiData.map((d, i) => ({
    country: d.country,
    RHPI: d.value,
    RPDI: rpdiData[i].value,
    quarter: d.quarter,
  }));

  const x = d3.scaleLinear().range([0, width]);

  const y = d3.scaleLinear().range([height, 0]);

  const updateScatterPlot = (index) => {
    const currentData = data.filter(
      (d) => d.quarter === rhpiData[index][0].quarter
    );

    x.domain([0, d3.max(currentData, (d) => d.RHPI)]);
    y.domain([0, d3.max(currentData, (d) => d.RPDI)]);

    circles = g.selectAll(".circle").data(currentData, (d) => d.country);
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
      .duration(100)
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

  let index = rhpiData.length - 1;
  const interval = setInterval(() => {
    if (index >= 0) {
      updateScatterPlot(index);
      index--;
    } else {
      clearInterval(interval);
    }
  }, 100);

  d3.select("#start-over").on("click", () => showScene("#scene1"));
}

function showScene(sceneId, callback) {
  d3.selectAll(".scene").classed("active", false);
  d3.select(sceneId).classed("active", true);
  if (callback) callback();
}