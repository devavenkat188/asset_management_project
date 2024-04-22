async function fetchData() {
    const response = await fetch('/chart/employee');
    const data = await response.json(); 
    return data;
  }

  async function employeeBarChart() {
    try {
      Chart.register(ChartDataLabels);
      const data = await fetchData();
      console.log(data);
      const labels = [];
      const counts = [];
      for(let i=0; i<data.counts.length; i++) {
        labels.push(data.counts[i].status);
        counts.push(data.counts[i].count);
      }
    
      console.log(labels+" "+counts);
      const colors = ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'];
    
      const myChart = new Chart("myChart", {
        type: 'bar',
        data: {
          labels: ['InActive Employees', 'Active Employees'],
          datasets: [{
            label: ['Employee Status'],
            data: counts,
            backgroundColor: colors,
            borderWidth: 1,
            boderColor: 'rgba(0, 0, 0, 0)',
            barThickness: 40
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
              }
            },
            y: {
                ticks: {
                  beginAtZero: true
                },
                grid: {
                  display: false,
                }
            }
          },
          plugins: {
            datalabels: {
                align: 'end',
                anchor: 'end',
                render:"label",
                color: '#997a8d',
                formatter: function(value, ctx) {
                    return ctx.chart.data.labels[ctx.dataIndex] + ': ' + value;
                }
            }
        }
        
        }
      });
    } catch (error) {
      console.error('Error creating employee pie chart:', error);
    }
  }
  employeeBarChart();

  async function fetchvalues() {
    const response = await fetch('/chart/asset');
    const data = await response.json(); 
    
    return data;
  }

async function assetPieChart() {
  try {
      Chart.register(ChartDataLabels);
      const data = await fetchvalues();
      console.log(data);

      const counts = [data.counts.length, data.getback.length, data.scrap.length];

      const colors = ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(211, 211, 211, 0.5)'];

      const myChart = new Chart("Chart", {
          type: 'pie',
          data: {
              labels: ['Issue', 'Return', 'Scrap'],
              datasets: [{
                  label: 'Asset Status',
                  data: counts,
                  backgroundColor: colors,
                  borderWidth: 5
              }]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
              title: {
                  display: true,
                  text: 'Asset Status',
                  fontSize: 16
              },
              plugins: {
                  datalabels: {
                      render:"label",
                      color: '#ffa07a',
                      formatter: function(value, ctx) {
                          return ctx.chart.data.labels[ctx.dataIndex] + ': ' + value;
                      }
                  }
              }
          }
      });
  } catch (error) {
      console.error('Error creating asset pie chart:', error);
  }
}

assetPieChart();

  // async function assetPieChart() {
  //   try {
  //     const data = await fetchvalues();
  //     console.log(data);

  //     const counts = [data.counts.length, data.getback.length, data.scrap.length];
  //     const assetName = [data.counts.assetName, data.getback.assetName, data.scrap.assetName];
        
  //     const colors = ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'];
  //     const myChart = new Chart("Chart", {
  //       type: 'pie',
  //       data: {
  //         labels: ['Issue', 'Return', 'Scrap'],
  //         datasets: [{
  //           label: ['Asset Status'],
  //           data: counts, assetName,
  //           backgroundColor: colors,
  //           borderWidth: 5
  //         }]
  //       },
  //       options: {
  //         title: {
  //           display: true,
  //           fontSize: 16,
  //         },
  //         plugins: {
  //           datalabels: {
  //               textAlign: 'center',
  //               font: {
  //                   lineHeight: 1.6
  //               },
  //         // responsive: false,
  //       }
  //     },
  //     formatter: function(value,data) {
  //       return data.chart.data.labels[data.dataIndex] + '\n' + value + '%';
  //   }
  //   }
  // });
  //   } catch (error) {
  //     console.error('Error creating asset pie chart:', error);
  //   }
  // }

  // assetPieChart();