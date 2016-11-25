var entries_render_to = 'entries_js';

function render_entries() {
    document.getElementById(entries_render_to).innerHTML = '';
    entry_metadata();
    entry_lengths();
}

function entry_metadata() {
    var puzdata = PUZAPP.puzdata;
    var num_entries = puzdata.nbrClues;
    document.getElementById(entries_render_to).innerHTML += 'Word count: ' + num_entries;
}

function entry_lengths() {
    // Display the number of entries for each length
    var puzdata = PUZAPP.puzdata;
    var entry_lists = [puzdata.across_entries, puzdata.down_entries];
    var categories = d3.range(1, d3.max([puzdata.width, puzdata.height]) + 1);
    var data = [];
    // Initialize the data
    for (var i = 0; i < categories.length; i++) {
        data.push(0);
    }
    for (var j = 0; j < entry_lists.length; j++) {
        var entries = entry_lists[j];
        for (var key in entries) {
            if (!entries.hasOwnProperty(key))
                continue;
            // Find the length of the entry
            var entry_length = entries[key].length;
            // Push to "data"
            data[entry_length - 1] += 1;
        }
    }
    data.unshift('Count');
    // Plot
    var chart = c3.generate({
        bindto: '#entries0',
        title: {
            text: 'Entry length'
        },
        data: {
            columns: [data],
            type: 'bar',
            labels: true
        },
        size: {
            // Chart won't render unless we initialize the size up front
            width: 340
        },
        tooltip: {
            show: false
        },
        axis: {
            rotated: true,
            x: {
                type: 'category',
                categories: categories
            },
            y: {
                label: 'Count'
            }
        },

    });
    CHARTS['entries'].push(chart);
}