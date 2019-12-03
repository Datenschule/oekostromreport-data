document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('[data-piechart]').forEach((v, i) => {
    if (document.getElementById(v.dataset['piechart'])) {
      var ctx = document.getElementById(v.dataset['piechart']).getContext('2d');

      var data = [v.querySelector('[data-water]').dataset['water'],
                  v.querySelector('[data-wind]').dataset['wind'],
                  v.querySelector('[data-solar]').dataset['solar']];

      var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Wasser', 'Wind', 'Solar'],
          datasets: [{
            data: data,
            backgroundColor: [
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 255, 255, 0.8)',
              'rgba(255, 206, 86, 0.8)',
            ],
            borderColor: [
              '#e6e5e6',
              '#e6e5e6',
              '#e6e5e6',
            ],
            borderWidth: 1
          }]
        },
        options: {
          legend: false,
        }
      });
    }
  });


  function colorize(opt, ctx) {
    //debugger
    let type = ctx.dataset.data[ctx.dataIndex]['type'];
    let colors = {
      "Wasser": "rgba(54, 162, 235, 0.9)",
      "Wind": "rgba(255, 255, 255, 0.9)",
      "Solar": "rgba(255, 206, 86, 0.9)"
    }
    return colors[type];
  }

  //<canvas id="barchart" data-linechart="barchart"></canvas>
  //document.querySelectorAll('[data-barchart]').forEach((v, i) => {
  if (document.querySelector('[data-barchart]')) {


    var ctx = document.querySelector('[data-barchart]').getContext('2d');
    var data = [{"x":"1944-01-01T01:16:11Z","y": 84, "type": "Wasser", "name": "Egglfing"},
                {"x":"1942-01-01T01:07:13Z","y": 72.5, "type": "Wasser", "name": "Ering"},
                {"x":"1965-01-01T01:07:13Z","y": 86.4, "type": "Wasser", "name": "Kraftwerk Passau-Ingling"},
                {"x":"1960-01-01T01:07:13Z","y": 9, "type": "Wasser", "name": "Landesbergen Wasser"},
                {"x":"1958-01-01T01:07:13Z","y": 10.6, "type": "Wasser", "name": "Langwedel"},
                {"x":"1982-01-01T01:07:13Z","y": 48.0, "type": "Wasser", "name": "Nußdorf"},
                {"x":"1977-01-01T01:07:13Z","y": 19.4, "type": "Wasser", "name": "Perach"},
                {"x":"1955-01-01T01:07:13Z","y": 23.2, "type": "Wasser", "name": "Stammham"},
                {"x":"1910-01-01T01:07:13Z","y": 0.3, "type": "Wasser", "name": "Wasserkraft Quinckeweg"},
                {"x":"2011-01-01T01:07:13Z","y": 2.7, "type": "Wind", "name": "Windpark Stöttener Berg"},
                {"x":"2017-01-01T01:07:13Z","y": 2.4, "type": "Wind", "name": "WP Herzebrock"},
  ];
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label: 'Kraftwerke',
          data,
          barPercentage: 1,
          barThickness: 20,
          maxBarThickness: 20,
        }]
      },
      options: {
        legend: false,
        tooltips: {
          titleFontSize: 18,
          bodyFontSize: 16,
          footerFontSize: 16,
          callbacks: {
            title: function(tooltipItem, data) {
              var item = data.datasets[0].data[tooltipItem[0].index];
              var label = 'Anlage ' + item.name ||  '';
              return label;
            },
            footer: function(tooltipItem, data) {
              var item = data.datasets[0].data[tooltipItem[0].index];
              var d = new Date(item.x);
              label = 'Erstinbetriebnahme ' + d.getFullYear();
              label += ' - Installierte Leistung '+ item.y + 'MW';
              return label;
            },
            label: function(tooltipItem, data) {
              var item = data.datasets[0].data[tooltipItem.index];
              var label = item.type + 'kraft';
              return label;
            }
          }
        },
        elements: {
	  rectangle: {
	    backgroundColor: colorize.bind(null, false),
	    borderWidth: 2
	  }
	},
    	scales: {
          xAxes: [{
            type: 'time',
            distribution: 'series',
            offset: true,
            time: {
              unit: "year",
              round: "year"
            }
          }],
          yAxis: [{
            offset: true,
            scaleLabel: {
	      display: true,
	      labelString: 'Installierte Leistung'
	    },
            ticks: {
              callback: function(value, index, values) {
                return value + 'MW';
              }
            }
          }]
    	},
    	zone: "Europe/Berlin"
      }
    });


    }
  //});
});
