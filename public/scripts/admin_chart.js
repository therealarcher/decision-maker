//Callback that creates and populates a data table,
//instantiates the bar chart, passes in the data and
//draws it.

// Checks to see if a '/' was added to the end of the url
import borda from './borda.js';
const url = window.location.href.endsWith('/') ? `${window.location.href}json` : `${window.location.href}/json`;

const drawChart = function() {
  $.ajax({
    method: "GET",
    url: url,
    dataType: "json",
    async: true
  }).done((json) => {
    let polls = json.polls;
    console.log(polls);

    // Put data in correct format to feed it into the data table
    // let chartCols = [];
    // for (let option of polls) {
    //   let colArr = [];
    //   colArr.push(option.name);
    //   colArr.push(parseInt(option.count));
    //   chartCols.push(colArr);
    // }
    // console.log(chartCols);

    //assigning border function to variable
    const chartCols = borda(polls);
    console.log(chartCols);



    // Create the data table
    const data = new google.visualization.DataTable(chartCols);
    data.addColumn('string', 'Options');
    data.addColumn('number', 'Points');
    data.addRows(chartCols);

    //Set chart options
    const options = {'title': polls[0].title, // FROM AJAX QUERY
      'width':600,
      'height':300,
      colors: ['#3066BE'],
      animation: {
        duration: 1000,
        easing: 'out',
        startup: true
      },
      legend: {position: 'none'},
      hAxis: {
        gridlines: {
            color: 'transparent'
        },
        textPosition: 'none'
      },
      tooltip: {
        textStyle: {
          fontSize: 16
        }
      }
    };


    //Instantiate and draw our chart, passing in some options.
    const chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  });
};

//Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

//Set a callback to run when the Google Visualization API is loaded.
//WILL THIS RUN drawChart if it's in another file?
google.charts.setOnLoadCallback(drawChart);
document.getElementById("refresh-chart").addEventListener("click", drawChart);


