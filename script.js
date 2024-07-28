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
    const colorScale = d3
      .scaleOrdinal([
        "#f57a7a",
        "#7af5be",
        "#7abcf5",
        "#7af5be",
        "#7af5be",
        "#7af5be",
        "#7af5be",
        "#7af5be",
        "#7af5be",
        "#7af5be",
        "#7af5be",
        "#7af5be",
        "#d07af5",
        "#d07af5",
        "#7af5be",
        "#7af5be",
        "#7af5be",
        "#f57a7a",
        "#7af5be",
        "#7abcf5",
        "#f5c67a",
        "#7af5be",
        "#f5c67a",
        "#7af5be",
        "#7abcf5",
        "#7af5be",
      ])
      .domain(countries);
    //console.log(d3.schemeCategory10, countries, colorScale)

    initializeScene1(rhpiData, colorScale, rpdiData);
    initializeScene2(rpdiData, colorScale);
    initializeScene3(rhpiData, rpdiData, colorScale);
  });
});

function initializeScene1(data, colorScale, data2) {
  const svg = d3
    .select("#scene1")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600);
  const margin = { top: 20, right: 30, bottom: 60, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleBand().range([0, height]).padding(0.1);
  const quarters = data.map((d) => d[0].quarter);

  const updateChart = (quarterData, index) => {
    quarterData.sort((a, b) => a.value - b.value);

    x.domain([0, d3.max(data.flat(), (d) => d.value)]);
    y.domain(d3.range(1, quarterData.length + 1));

    const bars = g.selectAll(".bar").data(quarterData, (d) => d.country);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", x(0))
      .attr("y", (d, i) => y(i + 1))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.country))
      .merge(bars)
      .transition()
      .duration(250)
      .attr("x", x(0))
      .attr("y", (d, i) => y(i + 1))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.country));

    bars.exit().remove();

    const labels = g.selectAll(".label").data(quarterData, (d) => d.country);

    labels
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.value) + 5)
      .attr("y", (d, i) => y(i + 1) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .text((d) => d.country)
      .merge(labels)
      .transition()
      .duration(250)
      .attr("x", (d) => x(d.value) + 5)
      .attr("y", (d, i) => y(i + 1) + y.bandwidth() / 2)
      .text((d) => d.country);

    labels.exit().remove();

    g.select(".x.axis").call(d3.axisBottom(x));
    g.select(".y.axis").call(d3.axisLeft(y).tickFormat((d) => `${d}`));
    d3.select("#quarter1").text(`${quarters[index]}`);
  };

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`);

  g.append("g").attr("class", "y axis");

  g.append("text")
    .attr("id", "quarter1")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "16px");

  let index = 0;
  const interval = setInterval(() => {
    if (index < data.length) {
      updateChart(data[index], index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 250);

  d3.select("#next1").on("click", () =>
    showScene("#scene2", () => {
      //initializeScene2(data2, colorScale);
      initializeScene2Transition(data2, colorScale);
    })
  );
}

function initializeScene2(data, colorScale) {
  const svg = d3
    .select("#scene2")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600);
  const margin = { top: 20, right: 30, bottom: 60, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleBand().range([0, height]).padding(0.1);
  const quarters = data.map((d) => d[0].quarter);

  const updateChart = (quarterData, index) => {
    quarterData.sort((a, b) => b.value - a.value);

    x.domain([0, d3.max(data.flat(), (d) => d.value)]);
    y.domain(d3.range(1, quarterData.length + 1));

    const bars = g.selectAll(".bar").data(quarterData, (d) => d.country);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", x(0))
      .attr("y", (d, i) => y(i + 1))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.country))
      .merge(bars)
      .transition()
      .duration(250)
      .attr("x", x(0))
      .attr("y", (d, i) => y(i + 1))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.country));

    bars.exit().remove();

    const labels = g.selectAll(".label").data(quarterData, (d) => d.country);

    labels
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.value) + 5)
      .attr("y", (d, i) => y(i + 1) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .text((d) => d.country)
      .merge(labels)
      .transition()
      .duration(250)
      .attr("x", (d) => x(d.value) + 5)
      .attr("y", (d, i) => y(i + 1) + y.bandwidth() / 2)
      .text((d) => d.country);

    labels.exit().remove();

    g.select(".x.axis").call(d3.axisBottom(x));
    g.select(".y.axis").call(d3.axisLeft(y).tickFormat((d) => `${d}`));

    d3.select("#quarter2").text(`${quarters[index]}`);
  };

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`);

  g.append("g").attr("class", "y axis");

  g.append("text")
    .attr("id", "quarter2")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "16px");

  let index = 0;
  const interval = setInterval(() => {
    if (index < data.length) {
      updateChart(data[index], index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 250);

  d3.select("#next2").on("click", () => showScene("#scene3"));
}

function initializeScene2Transition(data, colorScale) {
  //console.log("scene2 trans", data)
  const svg = d3.select("#scene2 svg");
  const margin = { top: 20, right: 30, bottom: 60, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const g = svg.select("g");

  const x = d3.scaleLinear().range([0, width]);

  const y = d3.scaleBand().range([0, height]).padding(0.1);

  const updateChart = (quarterData, index) => {
    quarterData.sort((a, b) => b.value - a.value);

    x.domain([0, d3.max(data.flat(), (d) => d.value)]);
    y.domain(d3.range(1, quarterData.length + 1));

    const bars = g.selectAll(".bar").data(quarterData, (d) => d.country);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", x(0))
      .attr("y", (d, i) => y(i + 1))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.country))
      .merge(bars)
      .transition()
      .duration(250)
      .attr("x", x(0))
      .attr("y", (d, i) => y(i + 1))
      .attr("width", (d) => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.country));

    bars.exit().remove();

    const labels = g.selectAll(".label").data(quarterData, (d) => d.country);

    labels
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.value) + 5)
      .attr("y", (d, i) => y(i + 1) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .text((d) => d.country)
      .merge(labels)
      .transition()
      .duration(250)
      .attr("x", (d) => x(d.value) + 5)
      .attr("y", (d, i) => y(i + 1) + y.bandwidth() / 2)
      .text((d) => d.country);

    labels.exit().remove();

    g.select(".x.axis").call(d3.axisBottom(x));
    g.select(".y.axis").call(d3.axisLeft(y).tickFormat((d) => `${d}`));

    d3.select("#quarter2").text(`${data[index][0].quarter}`);
  };

  let index = 0;
  const interval = setInterval(() => {
    if (index < data.length) {
      updateChart(data[index], index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 250);

  d3.select("#next2").on("click", () => showScene("#scene3"));
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

  d3.select("#scene3 .slider-container").remove();

  const sliderContainer = d3
    .select("#scene3")
    .append("div")
    .attr("class", "slider-container")
    .style("position", "relative")
    .style("width", "80%")
    .style("margin", "20px auto");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const quarterLabel = sliderContainer
    .append("div")
    .style("text-align", "center")
    .style("font-size", "16px")
    .text(`Quarter: ${rhpiData[rhpiData.length - 1][0].quarter}`);

  const timeline = sliderContainer
    .append("input")
    .attr("type", "range")
    .attr("min", 0)
    .attr("max", rhpiData.length - 1)
    .attr("value", rhpiData.length - 1)
    .style("width", "100%")
    .on("input", function () {
      updateScatterPlot(+this.value);
      quarterLabel.text(`Quarter: ${rhpiData[+this.value][0].quarter}`);
    });

  const data = rhpiData.map((d, i) => ({
    quarter: d[0].quarter,
    values: d.map((countryData, j) => ({
      country: countryData.country,
      RHPI: countryData.value,
      RPDI: rpdiData[i][j].value,
    })),
  }));

  const maxRHPI = d3.max(
    data.flatMap((d) => d.values),
    (d) => d.RHPI
  );
  const maxRPDI = d3.max(
    data.flatMap((d) => d.values),
    (d) => d.RPDI
  );

  const x = d3.scaleLinear().range([0, width]).domain([0, maxRHPI]);
  const y = d3.scaleLinear().range([height, 0]).domain([0, maxRPDI]);

  const updateScatterPlot = (index) => {
    const currentData = data[index].values;
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
      .duration(250)
      .attr("cx", (d) => x(d.RHPI))
      .attr("cy", (d) => y(d.RPDI))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(d.country));

    circles.exit().remove();

    g.select(".x.axis").call(d3.axisBottom(x));
    g.select(".y.axis").call(d3.axisLeft(y));
  };

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`);

  g.append("g").attr("class", "y axis");

  updateScatterPlot(rhpiData.length - 1);

  d3.select("#start-over").on("click", () => {
    d3.selectAll("svg").remove();
    d3.selectAll(".timeline-container").remove();
    showScene("#scene1", () => {
      initializeScene1(rhpiData, colorScale, rpdiData);
      initializeScene2(rpdiData, colorScale);
      initializeScene3(rhpiData, rpdiData, colorScale);
    });
  });
}

function showScene(sceneId, callback) {
  d3.selectAll(".scene").classed("active", false);
  d3.select(sceneId).classed("active", true);
  if (callback) callback();
}
