var entries_render_to = 'entries_js';

function render_entries()
{
    document.getElementById(entries_render_to).innerHTML = '';
    entry_metadata();
    entry_lengths();
}

function entry_metadata()
{
    var puzdata = PUZAPP.puzdata;
    var num_entries = puzdata.nbrClues;
    document.getElementById(entries_render_to).innerHTML += 'Word count: ' + num_entries;
}

function entries_of_length(arr)
{
    // Display entries of a given length in the #entries1 div
    var html = '<big><pre>\n';
    for (var j = 0; j < arr.length; j++) {
        var entry = arr[j][0]; var clue = arr[j][1];
        html += entry + ': [ ' + clue + ' ]\n';
    }
    html += '</pre></big>\n';
    document.getElementById('entries1').innerHTML = html;
}

function entry_lengths()
{
    // Display the number of entries for each length
    var puzdata = PUZAPP.puzdata;
    var entry_lists = [puzdata.across_entries, puzdata.down_entries];
    var categories = d3.range(1, d3.max([puzdata.width, puzdata.height]) + 1);
    var data = [];
    var clues;
    var entries_by_count = {};
    // Initialize the data
    for (var i = 0; i < categories.length; i++)
    {
        data.push(0);
    }
    for (var j = 0; j < entry_lists.length; j++)
    {
        var entries = entry_lists[j];
        clues = (entries === puzdata.across_entries) ? puzdata.across_clues : puzdata.down_clues;
        for (var key in entries)
        {
            if (!entries.hasOwnProperty(key))
                continue;
            // Find the length of the entry
            var entry_length = entries[key].length;
            // Push to "data"
            data[entry_length - 1] += 1;
            // Add to entries_by_count
            if (!entries_by_count[entry_length]) {
                entries_by_count[entry_length] = [];
            }
            entries_by_count[entry_length].push([entries[key], clues[key]]);
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
            labels: true,
            onclick: function (e) { entries_of_length(entries_by_count[e.index + 1]); }
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
