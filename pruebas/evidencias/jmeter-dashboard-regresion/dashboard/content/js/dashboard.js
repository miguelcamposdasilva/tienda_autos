/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.72727272727273, "KoPercent": 4.2727272727272725};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.73, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.737, 500, 1500, "GET /api/autos (listar catálogo)"], "isController": false}, {"data": [0.455, 500, 1500, "POST /api/login"], "isController": false}, {"data": [0.778, 500, 1500, "GET /api/autos/{id} (detalle de vehículo)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1100, 47, 4.2727272727272725, 575.1199999999991, 4, 6211, 482.5, 1099.9, 1447.6000000000004, 4427.59, 39.29553817025685, 35.00836844255707, 6.858578483906691], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /api/autos (listar catálogo)", 500, 21, 4.2, 576.2140000000003, 4, 5424, 468.5, 1047.8000000000002, 1448.9499999999987, 4619.95, 18.19041728817259, 24.94076745370539, 3.037657574489759], "isController": false}, {"data": ["POST /api/login", 100, 26, 26.0, 1396.3899999999999, 140, 6211, 1168.5, 2755.100000000005, 4359.749999999999, 6206.749999999998, 4.522431259044862, 2.4025416063675835, 1.0864434469971058], "isController": false}, {"data": ["GET /api/autos/{id} (detalle de vehículo)", 500, 0, 0.0, 409.7719999999996, 4, 1220, 366.0, 888.9000000000001, 1045.95, 1196.97, 18.272182429469375, 8.818790484304195, 3.0869995706037128], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,843 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 2,821 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 3,578 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 1,754 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 3,156 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 4,620 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 1,571 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 4,260 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 4,872 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 3,744 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 5,786 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 4,192 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 4,671 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 1,862 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 1,616 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 5,424 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 3,356 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 4,365 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 1,900 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 1,753 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 1,758 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 5,265 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 1,593 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 2,841 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 1,668 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, 4.25531914893617, 0.18181818181818182], "isController": false}, {"data": ["The operation lasted too long: It took 2,398 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 2,763 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 4,428 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 3,638 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 2,960 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 1,901 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, 4.25531914893617, 0.18181818181818182], "isController": false}, {"data": ["The operation lasted too long: It took 1,793 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 4,515 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 2,015 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 3,836 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 4.25531914893617, 0.18181818181818182], "isController": false}, {"data": ["The operation lasted too long: It took 1,842 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 5,399 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 3,500 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 3,280 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 6,211 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 4,615 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 3,083 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 4,387 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}, {"data": ["The operation lasted too long: It took 1,982 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.127659574468085, 0.09090909090909091], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1100, 47, "The operation lasted too long: It took 1,668 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 1,901 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 3,836 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, "The operation lasted too long: It took 1,843 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 2,821 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["GET /api/autos (listar catálogo)", 500, 21, "The operation lasted too long: It took 3,836 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, "The operation lasted too long: It took 2,398 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,763 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,821 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 4,428 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1], "isController": false}, {"data": ["POST /api/login", 100, 26, "The operation lasted too long: It took 1,901 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 1,668 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 2, "The operation lasted too long: It took 1,843 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 3,578 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,754 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
