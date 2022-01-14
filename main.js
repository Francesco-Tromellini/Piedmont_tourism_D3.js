
// Global variables initialisation
const margin = { top: 30, right: 20, bottom: 35, left: 40 };
const viz2 = d3.select('#viz2');
const viz1 = d3.select('#viz1');
const viz3 = d3.select('#viz3');
const width = 500,
      height = 600;

// Title
d3.select('#first_cont')
    .html('<center><h1>Piedmont Tourism Data 2005 - 2021</h1></center>')

// Global data initialisation
let region_list = ['NO', 'VC', 'BI', 'VB', 'CN', 'AL', 'TO', 'AT']
let year_list = [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021]

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

// Setup filtering data
function onDataLoaded(data) {

    let itArrForYear = [],
        stArrForYear = [],
        totArrForYear = [];

    for(let i = 0; i < year_list.length; i++){
        itArrForYear.push(itYearFilter(data, year_list[i]));
        stArrForYear.push(stYearFilter(data, year_list[i]));
        totArrForYear.push(totYearFilter(data, year_list[i]));
    }

    char1(itArrForYear, viz1);
    char1(stArrForYear, viz2);
    char1(totArrForYear, viz3);
}

// Filtering italian arrives per year
function itYearFilter (data, currentYear) {

    let data_x = data.filter(d => d.year == currentYear);
    let result = 0;


    for(let i = 0; i < data_x.length; i++){
        result += Number(data_x[i].it_arr);
    }

    return result;
}

// Filtering foreign arrives per year
function stYearFilter (data, currentYear) {
    let data_x = data.filter(d => d.year == currentYear);
    let result = 0;


    for(let i = 0; i < data_x.length; i++){
        if(data_x[i].st_arr == 'null'){
            data_x[i].st_arr = 0;
        }
        result += Number(data_x[i].st_arr);
    }

    return result;
}

// Filtering all the arrives per year
function totYearFilter (data, currentYear) {
    let data_x = data.filter(d => d.year == currentYear);
    let result = 0;


    for(let i = 0; i < data_x.length; i++){
        if(data_x[i].tot_arr == 'null'){
            data_x[i].tot_arr = 0;
        }
        result += Number(data_x[i].tot_arr);
    }

    return result;
}

// Creating the bar chart
function char1(charData, pointer) {

    console.log(charData);
      
    // Defining the canevas
    const svg = pointer.append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'lightslategray')

    // Initialisizing variables
    let yScale,
        xScale,
        xAxisValues,
        yAxisValues,
        yAxisTicks,
        colors;

    // Vertical scale for bars
    yScale = d3.scaleLinear()
        .domain([0, d3.max(charData)])
        .range([height - margin.bottom - 5, margin.top])
        .interpolate(d3.interpolateRound);

    // Vertical scale for values
    yAxisValues = d3.scaleLinear()
        .domain([0, d3.max(charData)])
        .range([height - margin.bottom - 5, margin.top])
        .interpolate(d3.interpolateRound);

    // Ticks display
    yAxisTicks = d3.axisLeft(yAxisValues)
        .ticks(9)
        .tickFormat(d => `${d/1000} K`);

    // Horizontal scale for bars
    xScale = d3.scaleBand()
        .domain(charData)
        .padding(0.1)
        .range([0, width - margin.left - margin.right ]);

    // Horizontal scale for values
    xAxisValues = d3.scaleBand()
        .domain(year_list)
        .range([margin.left, width - margin.right]);

    // Colors display
    colors = d3.scaleSequential()
        .domain([d3.min(charData), d3.max(charData)])
        .interpolator(d3.interpolateBlues);

    // Creation of the bars
    svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')')
        .selectAll('rect').data(charData)
            .enter().append('rect')
                .style('fill', colors)
                .attr('width', xScale.bandwidth())
                .attr('height', d => yScale(0) - yScale(d))
                .attr('x', d => xScale(d))
                .attr('y', d => yScale(d));

    // Adding the vertical scale
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 18)`)
        .call(yAxisTicks)
        .call(g => g.select('.domain').remove());

    // Adding the horizontal scale
    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom +15})`)
        .call(d3.axisBottom(xAxisValues))
        .call(g => g.select('.domain').remove());

    // Adding a Title
    svg.append('text')
        .attr('font-size', '21px')
        .attr('class', 'title')
        .attr('x', width / 2 + margin.left / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .text('Number of arrivals per year')
        .style('fill', 'black')
        .style('font-weight', 'bold')

}

loadData();
