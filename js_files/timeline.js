
 /*
let regObj = {};

const tempObj = Object.freeze({
    name: "Torino",
    values: [
        {date: "2005", tourists: "90"},
        {date: "2006", tourists: "10"},
        {date: "2007", tourists: "35"},
        {date: "2008", tourists: "21"},
        {date: "2009", tourists: "201"},
        {date: "2010", tourists: "100"},
        {date: "2011", tourists: "110"},
        {date: "2012", tourists: "145"},
        {date: "2013", tourists: "241"},
        {date: "2014", tourists: "101"},
        {date: "2015", tourists: "101"},
        {date: "2016", tourists: "101"},
        {date: "2017", tourists: "101"},
        {date: "2018", tourists: "101"},
        {date: "2019", tourists: "101"},
        {date: "2020", tourists: "101"},
        {date: "2021", tourists: "101"},
    ]});

console.log(tempObj)
*/

const viz5 = d3.select('#viz5');
const viz6 = d3.select('#viz6');

    // Loading data
function loadData() {
    d3.dsv(';','Piedmont_tourism_data.csv', function(d){
        return{
            year : d.anno,
            region : d.provincia,
            qualif : d.qualifica,
            it_arr : d.arrivi_italiani,
            it_pres : d.presenza_italiani,
            st_arr : d.arrivi_stranieri,
            st_pres : d.presenza_stranieri,
            tot_arr : d.arrivi_totali,
            tot_dep : d.partenza_totali
        }
    }).then(onDataLoaded);
}

// Setup filtering Data
function onDataLoaded(data) {

    //let finalArr = [];
    let finalArr2 = []

    for(let i = 0; i < region_list.length; i++){
        /*if(region_list[i] == 'TO' ){
            finalArr.push(regionTimeFilter(data, region_list[i]));
            //console.log(finalArr)
        }else{
            finalArr2.push(regionTimeFilter(data, region_list[i]));
        }*/
        finalArr2.push(regionTimeFilter(data, region_list[i]));
    }

    console.log(finalArr2);
    //lineChart(finalArr, viz5 );
    lineChart(finalArr2, viz6)
}

// Filtering data per region
function regionTimeFilter (data, currentRegion) {

    let data_x = data.filter(d => d.region == currentRegion);

    newObj = {
        name: 'Yo',
        values:[
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0}, 
        {date: 0, tourists:0},
    ]}

    newObj.name = currentRegion;

    for(let i = 0; i < data_x.length; i++){
        if(data_x[i].tot_arr == 'null'){
            data_x[i].tot_arr = 0;
        }
        for(let t = 0; t < year_list.length; t++){
            if(data_x[i].year == year_list[t]){
                newObj.values[t].date = year_list[t]
                newObj.values[t].tourists += Number(data_x[i].tot_arr)
            }
        }
        /*
        for(let j = 0; j < regObj.values.length; j++){
            if(data_x[i].year == regObj.values[j].date)
                regObj.values[j].tourists = Number(data_x[i].tot_arr);
        }*/
    }
    //console.log(newObj);
    return newObj ;
}
    
function lineChart(data, pointer){
    
    
    var width = 900;
    var height = 900;
    var margin = 70;
    var duration = 250;
    
    var lineOpacity = "0.25";
    var lineOpacityHover = "0.85";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";
    
    var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.25"
    var circleRadius = 3;
    var circleRadiusHover = 6;
    
    
    /* Format Data */
    var parseDate = d3.timeParse("%Y");
    data.forEach(function(d) { 
        d.values.forEach(function(d) {
        d.date = parseDate(d.date);
        d.tourists = +d.tourists;    
        });
    });
    
    
    /* Scale */
    var xScale = d3.scaleTime()
        .domain(d3.extent(data[0].values, d => d.date))
        .range([0, width-margin]);
    
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data[6].values, d => d.tourists)])
        .range([height- 20, 0]);
    
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    
    /* Add SVG */
    var svg = pointer.append("svg")
        .attr("width", (width+margin)+"px")
        .attr("height", (height+margin)+"px")
        .append('g')
        .attr("transform", `translate(${margin}, ${margin})`);
    
    
    /* Add line into SVG */
    var line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.tourists));
    
    let lines = svg.append('g')
        .attr('class', 'lines');
    
    lines.selectAll('.line-group')
        .data(data).enter()
        .append('g')
        .attr('class', 'line-group')  
        .on("mouseover", function(d, i) {
            svg.append("text")
            .attr("class", "title-text")
            .style("fill", color(i))        
            .text(d.name)
            .attr("text-anchor", "middle")
            .attr("x", (width-margin)/2)
            .attr("y", 5);
        })
        .on("mouseout", function(d) {
            svg.select(".title-text").remove();
        })
        .append('path')
        .attr('class', 'line')  
        .attr('d', d => line(d.values))
        .style('stroke', (d, i) => color(i))
        .style('opacity', lineOpacity)
        .on("mouseover", function(d) {
            d3.selectAll('.line')
                        .style('opacity', otherLinesOpacityHover);
            d3.selectAll('.circle')
                        .style('opacity', circleOpacityOnLineHover);
            d3.select(this)
            .style('opacity', lineOpacityHover)
            .style("stroke-width", lineStrokeHover)
            .style("cursor", "pointer");
        })
        .on("mouseout", function(d) {
            d3.selectAll(".line")
                        .style('opacity', lineOpacity);
            d3.selectAll('.circle')
                        .style('opacity', circleOpacity);
            d3.select(this)
            .style("stroke-width", lineStroke)
            .style("cursor", "none");
        });
    
    
    /* Add circles in the line */
    lines.selectAll("circle-group")
        .data(data).enter()
        .append("g")
        .style("fill", (d, i) => color(i))
        .selectAll("circle")
        .data(d => d.values).enter()
        .append("g")
        .attr("class", "circle")  
        .on("mouseover", function(d) {
            d3.select(this)     
            .style("cursor", "pointer")
            .append("text")
            .attr("class", "text")
            .text(`${d.tourists}`)
            .attr("x", d => xScale(d.date) + 5)
            .attr("y", d => yScale(d.tourists) - 10);
        })
        .on("mouseout", function(d) {
            d3.select(this)
            .style("cursor", "none")  
            .transition()
            .duration(duration)
            .selectAll(".text").remove();
        })
        .append("circle")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.tourists))
        .attr("r", circleRadius)
        .style('opacity', circleOpacity)
        .on("mouseover", function(d) {
            d3.select(this)
                .transition()
                .duration(duration)
                .attr("r", circleRadiusHover);
            })
        .on("mouseout", function(d) {
            d3.select(this) 
                .transition()
                .duration(duration)
                .attr("r", circleRadius);  
            });
    
    
    /* Add Axis into SVG */
    var xAxis = d3.axisBottom(xScale).ticks(17);
    var yAxis = d3.axisLeft(yScale).ticks(5);
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height-20})`)
        .call(xAxis);
    
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append('text')
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .attr("fill", "#000")
        .text("Total values");
}

loadData();