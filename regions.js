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

function onDataLoaded(data) {

    let regArray = [];

    for(let i = 0; i < region_list.length; i++){
        regArray.push(regionFilter(data, region_list[i]));
    }

    regionPie(regArray, viz4);
}

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

function regionPie (regionData, pointer) {

    console.log(regionData)

    let radius = Math.min(width, height) / 2 - margin

    // Defining the canevas
    const svg = pointer.append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'lightslategray')

    
    }

loadData();