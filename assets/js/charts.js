document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('[data-piechart]').forEach((v, i) => {
    pieChart(v);
  });

  document.querySelectorAll('[data-barchart]').forEach((v, i) => {
    barChart(v);
  });
});

function pieChart(v) {
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = 450 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;

  var radius = Math.min(width, height) / 2 - margin.top

  var svg = d3.select("#"+ v.dataset.piechart)
      .append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr('viewBox','0 0 '+ (width + margin.left + margin.right) +' '+ (height + margin.top + margin.bottom))
      .attr('preserveAspectRatio','xMinYMin')
      .append("g")
      .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

  var data = {wasser: v.querySelector('[data-water]').dataset.water,
              wind: v.querySelector('[data-wind]').dataset.wind,
              solar: v.querySelector('[data-solar]').dataset.solar};
  var colors = {wasser: '#009ee3',
                wind: '#ffffff',
                solar: '#ffff00'};

  var pie = d3.pie()
      .value(function(d) {return d.value; })
  var data_ready = pie(d3.entries(data))

  var arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)


  var Tooltip = d3.select("#"+ v.dataset.piechart)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "black")
      .style("color", "white")
      .style("padding", "10px")

  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1);
    d3.select(this)
    //.style("stroke", "white")
      .style("stroke-width", "1px")
      .style("opacity", 0.9);
  }
  var mousemove = function(d) {
    let str = d.data.key.split('');
    str = str[0].toUpperCase() + str.slice(1).join('');
    Tooltip
      .html(`${str} ${data[d.data.key]}%`)
      .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  });
    //.style("left", function(d) { return "" + arcGenerator.centroid(d) + "px";  })
    //.style("top", function(d) { return "" + arcGenerator.centroid(d) + "px";  })
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this)
    //.style("stroke", "lightgrey")
      .style("opacity", 1)
      .style("stroke-width", "0")
  }

  svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){
      return (colors[d.data.key])
    })
  //.attr("stroke", "#bfbfbf")
    .style("stroke-width", "0")
    .style("opacity", 1)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

}

function barChart(v) {
  function compare( a, b ) {
    if ( a.x < b.x ){
      return -1;
    }
    if ( a.x > b.x ){
      return 1;
    }
    return 0;
  }

  var colors = {wasser: '#009ee3',
                wind: '#ffffff',
                solar: '#ffff00'}

  var data = [
    {"x":"1944-01-01T01:16:11Z","y": 84, "type": "Wasser", "name": "Egglfing"},
    {"x":"1942-01-01T01:07:13Z","y": 72.5, "type": "Wasser", "name": "Ering"},
    {"x":"1965-01-01T01:07:13Z","y": 86.4, "type": "Wasser", "name": "Kraftwerk Passau-Ingling"},
    {"x":"1960-01-01T01:07:13Z","y": 9, "type": "Wasser", "name": "Landesbergen Wasser"},
    {"x":"1958-01-01T01:07:13Z","y": 10.6, "type": "Wasser", "name": "Langwedel"},
    {"x":"1982-01-01T01:07:13Z","y": 48.0, "type": "Wasser", "name": "Nußdorf"},
    {"x":"1977-01-01T01:07:13Z","y": 19.4, "type": "Wasser", "name": "Perach"},
    {"x":"1955-01-01T01:07:13Z","y": 23.2, "type": "Wasser", "name": "Stammham"},
    {"x":"1910-01-01T01:07:13Z","y": 0.3, "type": "Wasser", "name": "Wasserkraft Quinckeweg"},
    {"x":"2011-01-01T01:07:13Z","y": 2.7, "type": "Wind", "name": "Windpark Stöttener Berg"},
    {"x":"2017-01-01T01:07:13Z","y": 2.4, "type": "Wind", "name": "WP Herzebrock"}
  ];

  data.sort( compare );

  var margin = {top: 20, right: 20, bottom: 70, left: 40},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var	parseDate = d3.isoParse;

  var y = d3.scaleLinear().range([height, 0]);

  var x = d3.scaleLinear()
      .domain([1900, 2020])
      .range([margin.right, width - margin.right]);

  var scaleX = d3.scaleLinear()
      .domain([1900, 2020])
      .range([margin.right, width - margin.right]);


  var xAxis = d3.axisBottom()
      .scale(scaleX)
      .ticks(10, 20)
      .tickFormat((d) => d);

  var yAxis = d3.axisLeft()
      .scale(y)
      .ticks(10);

  var svg = d3.select("#"+ v.dataset.barchart).append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr('viewBox','0 0 '+ (width + margin.left + margin.right) +' '+ (height + margin.top + margin.bottom))
      .attr('preserveAspectRatio','xMinYMin')
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data.forEach(function(d) {
    d.date = parseDate(d.x);
    d.value = +d.y;
  });

  svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 2)
    .attr("refY", 7)
    .attr("markerWidth", 14)
    .attr("markerHeight", 14)
    .attr("orient", "left")
    .append("path")
    .attr("d", "M 1 1 9 5 1 9 Z");

  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height + 10) + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "middle")
    .attr("dy", "2em");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("y", 6)
    .style("text-anchor", "middle")
    .text("Value");

  var Tooltip = d3.select("#"+ v.dataset.barchart)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "black")
      .style("color", "white")
      .style("padding", "10px")

  var mouseover = function(d) {
    Tooltip
      .style("opacity", 1);
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1);
  }
  var mousemove = function(d) {
    Tooltip
      .html(`${d.type}kraftwerk ${d.name} <br> Erstinbetriebnahme ${d.date.getFullYear()} <br> Installierte Leistung ${d.value} MW`)
      .style("left", (d3.mouse(this)[0] + 70) + "px")
      .style("top", (d3.mouse(this)[1] + 10) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "lightgrey")
      .style("opacity", 0.8)
  }

  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Installierte Leistung in MW pro Jahr");

  svg.selectAll("bar")
    .data(data)
    .enter().append("rect")
    .style("fill", function(d){ return colors[d.type.toLowerCase()]; })
    .style("stroke-width",'1px')
    .style("stroke", 'lightgrey')
    .attr("x", function(d) { return scaleX(d.date.getFullYear()) -13; })
    .attr("width", 30)
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  /*
  svg.selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr("class","bar-label")
    .attr("x", function(d) { return scaleX(d.date.getFullYear()) - 15; } )
    .attr("y", function(d) { return y(d.value) - 10; })
    .attr("dy", ".75em")
    .text(function(d) { return d.value + ' MW'; });
*/

}
