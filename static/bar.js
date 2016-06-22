var mData;
document.getElementById('renderButton').disabled = false;
document.getElementById('humidButton').disabled = true;
document.getElementById('tempButton').disabled = true;

yAxisLabel = ""
function drawLineGraph(isTemperature) {
    if(isTemperature)
        yAxisLabel = "Temperature (in F)";
    else
        yAxisLabel = "Humidity (in cm)";
    var data = JSON.parse(mData),
        array = []
    data = data.events;
    var device_type = {}, device_id = {}, event_type = {};
    var timestamp_array = [], counter_array = [], humid_array = [], tempearature_array = [];
    for(var i=0; i< data.length; ++i){
        obj = {};
        obj.device_type = data[i].device_type;
        obj.device_id = data[i].device_id;
        obj.evt_type = data[i].evt_type;
        obj.timestamp = data[i].timestamp["$date"];
        event = data[i].evt;
        obj.counter = event.counter;
        obj.Humid = event["Humid%"];
        obj.TempC = event.TempC;
        obj.TempF = event.TempF;
        device_type[obj.device_type] = obj;
        device_type[obj.device_id] = obj;
        device_type[obj.evt_type] = obj;
        obj1 = {};
        obj1.date = obj.timestamp;
        if(isTemperature) {
            obj1.value= obj.TempC;
        } else {
            obj1.value= obj.Humid;
        }
        array.push(obj1);
    }
    draw(array);
}

function draw(data) {
    d3.select("#container").remove();
    var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var fmt = d3.time.format("%Y%m%dT%H%M%S%Z")

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.value); });

    var svg = d3.select("#chart").append("svg")
        .attr('id', 'container')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

      var domain = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {date: d.date, value: +d[name]};
          })
        };
      });

      x.domain(d3.extent(data, function(d) { return d.date; }));

      y.domain([
        d3.min(domain, function(c) { return d3.min(c.values, function(v) { return v.value; }); }) - 10,
        d3.max(domain, function(c) { return d3.max(c.values, function(v) { return v.value; }); }) + 10
      ]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(yAxisLabel);

      var lines = svg.selectAll(".lines")
          .data(domain)
        .enter().append("g")
          .attr("class", "path");

      lines.append("path")
          .attr("class", "line")
          .attr("d", function(d) {
            return line(d.values);
          })
          .style("stroke", function(d) {
            return color(d.name);
          })
          .on('mouse');

      lines.append("text")
          .datum(function(d) {
            return {name: d.name, value: d.values[d.values.length - 1]};
          })
          .attr("transform", function(d) {
            return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")";
          })
          .attr("x", 3)
          .attr("dy", ".35em")
          .text(function(d) {
            return d.name;
      });
}

function mapSelect() {
    var dropdown = document.getElementById("map");
    var selectedValue = dropdown.options[dropdown.selectedIndex].value;
    if(selectedValue == -1) {
        // Do nothing
    } else if(selectedValue == "RENDER") {
        get_map();
    }
    d3.select('#scree').remove();
}

function get_map() {
    url = 'http://localhost:5555/render';
	$.ajax({
	  type: 'GET',
	  url: url,
      contentType: 'application/json; charset=utf-8',
	  xhrFields: {
		withCredentials: false
	  },
	  headers: {

	  },
	  success: function(result) {
        mData = result
        document.getElementById('renderButton').disabled = true;
        document.getElementById('humidButton').disabled = false;
        document.getElementById('tempButton').disabled = false;
	  },
	  error: function(result) {
		console.log(result);
	  }
	});
}