
// Global variables
const region_list = ['NO', 'VC', 'BI', 'VB', 'CN', 'AL', 'TO', 'AT'];
const viz4 = d3.select('#viz4');

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

    let regArray = [];

    for(let i = 0; i < region_list.length; i++){
        regArray.push(regionFilter(data, region_list[i]));
    }

    regionPie(regArray, viz4);
}

// Filtering data per region
function regionFilter (data, currentRegion) {

    let data_x = data.filter(d => d.region == currentRegion);
    let result = 0;


    for(let i = 0; i < data_x.length; i++){
        if(data_x[i].tot_arr == 'null'){
            data_x[i].tot_arr = 0;
        }
        result += Number(data_x[i].tot_arr);
    }

    return result;
}

// Creating the pie chart
function regionPie (regionData, pointer) {

    // Verify the data
    console.log(regionData)

    // Region to attribute to each slice of the pie
    xAxisValues = d3.scaleOrdinal(region_list)

    // Defining the canevas
    const svg = pointer.append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'white')

    // Radius of the pie
    let radius = (Math.min(width, height) / 2) - 10;

    // Positioning
    let g = svg.append('g')
        .attr('transform', 'translate('+ width / 2 + ',' + height / 2 + ')');

    // Color of the pie
    let color = d3.scaleOrdinal(['lightYellow', 'lightGreen','#006666' ,
         '#669900', '#ff8c00', 'violet','#8080ff','#006600']);

    // Pie variable deifiniton
    let pie = d3.pie();

    // Creating the shape
    let arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
    
    // Filling the shape with data => creating the pie
    let arcs = g.selectAll('arc')
            .data(pie(regionData))
            .enter().append('g')
            .attr('class','arc')
    
    // Giving color to the slices
    arcs.append('path')
        .attr('fill',function(d, i){
            return color(i)
        })
        .attr('d', arc)
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

    // Legend within the slices
    arcs.append('text')
        .attr('transform', function(d){return 'translate(' + arc.centroid(d) + ')';})
        .text(xAxisValues)
        .style('font-size', '10px')
        .style('font-weight', 'bold');

    // Title of the chart
    svg.append('g')
        .attr('transform', 'translate(' + (width / 2 - 240) + ',' + 20 + ')')
        .append('text')
        .text('Share of Total turism arrivals per region from 2005 to 2021')
        .attr('class', 'title')
        .style('font-size', '17px')
        .style('font-weight', 'bold');
    }
loadData();