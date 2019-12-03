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
              'rgba(214, 233, 255, 0.8)',
              'rgba(255, 206, 86, 0.8)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 0.9)',
              'rgba(214, 233, 255, 0.9)',
              'rgba(255, 206, 86, 0.9)',
            ],
            borderWidth: 1
          }]
        },
        options: {}
      });
    }
  });
});
