'use strict';


function colorChart(elementID, points, axis) {
    // Give the points a 3D feel by adding a radial gradient
    Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.4,
                cy: 0.3,
                r: 0.5
            },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
            ]
        };
    });

    console.log(Highcharts.getOptions().colors);

    // Set up the chart
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: elementID,
            margin: 100,
            type: 'scatter',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 30,
                depth: 1000,
                viewDistance: 5,
                fitToPlot: false,
                frame: {
                    bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                    back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                    side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                }
            }
        },
        title: {
            text: 'Movie Color'
        },
        subtitle: {
            text: 'Click and drag the plot area to rotate in space'
        },
        plotOptions: {
            scatter: {
                width: 1,
                height: 1,
                depth: 1
            }
        },
        xAxis: {
            min: axis.minX,
            max: axis.maxX,
            gridLineWidth: 1
        },
        yAxis: {
            min: axis.minY,
            max: axis.maxY,
            title: null
        },
        zAxis: {
            min: axis.minZ,
            max: axis.maxZ,
            showFirstLabel: false
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'LAB',
            // colorByPoint: true,
            // data: [
            //     {x: 1, y: 6, z: 5, fillColor: "rgb(51, 255, 51)"}
            // ]
            data: points,
            colorByPoint: true,
            turboThreshold: 5000
        }]
    });


    // Add mouse events for rotation
    $("#color-chart").bind('mousedown.hc touchstart.hc', function (eStart) {
        eStart = chart.pointer.normalize(eStart);

        var posX = eStart.pageX,
            posY = eStart.pageY,
            alpha = chart.options.chart.options3d.alpha,
            beta = chart.options.chart.options3d.beta,
            newAlpha,
            newBeta,
            sensitivity = 5; // lower is more sensitive

        $(document).bind({
            'mousemove.hc touchdrag.hc': function (e) {
                // Run beta
                newBeta = beta + (posX - e.pageX) / sensitivity;
                chart.options.chart.options3d.beta = newBeta;

                // Run alpha
                newAlpha = alpha + (e.pageY - posY) / sensitivity;
                chart.options.chart.options3d.alpha = newAlpha;

                chart.redraw(false);
            },
            'mouseup touchend': function () {
                $(document).unbind('.hc');
            }
        });
    });
}