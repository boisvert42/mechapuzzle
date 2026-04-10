var entries_render_to = 'entries_js';

function render_entries()
{
    document.getElementById(entries_render_to).innerHTML = '';
    entry_metadata();
    entry_lengths();
}

function entry_metadata()
{
    var puzdata = window.puzdata;
    var num_entries = Object.keys(puzdata.get_entry_mapping()).length;
    document.getElementById(entries_render_to).innerHTML += 'Word count: ' + num_entries;
}

function entries_of_length(entry_length, sort_by)
{
    // Display entries of a given length in the #entries1 div
    var html = '';
	html += 'Sort by: ';
	html += '<form action="." name="entry_sorter">';
	html += '<input type="radio" id="Clue" name="entry_sort" value="Clue" onclick="entries_of_length(' + entry_length + ', \'Clue\');"><label for="Clue">Clue</label>';
	html += '<input type="radio" id="Entry" name="entry_sort" value="Entry" onclick="entries_of_length(' + entry_length + ', \'Entry\');"><label for="Entry">Entry</label>';
	html += '<input type="radio" id="Number" name="entry_sort" value="Number"  onclick="entries_of_length(' + entry_length + ', \'Number\');"><label for="Number">Number</label>';
	html += '</form>\n';
	html += '<big><pre>\n';
	var myobj = window.puzdata.all_entries.filter(x => x.Entry.length == entry_length);
	sort_entries(myobj, sort_by);
    for (var j = 0; j < myobj.length; j++) {
        var entry = myobj[j]['Entry']; var clue = myobj[j]['Clue'];
        html += entry + ': [ ' + clue + ' ]\n';
    }
    html += '</pre></big>\n';
    document.getElementById('entries1').innerHTML = html;
	return false;
}

function entry_lengths()
{
    // Display the number of entries for each length
    var puzdata = window.puzdata;
    var maxDim = Math.max(puzdata.metadata.width, puzdata.metadata.height);
    var categories = Array.from({length: maxDim}, (_, i) => i + 1);
    var data = [];
    var entries_by_count = {};
    // Initialize the data
    for (var i = 0; i < categories.length; i++)
    {
        data.push(0);
    }
    // Create a mapping of word number -> clue
    // TODO: maybe make this part of JSCrossword?
    var clue_mapping = {};
    puzdata.clues.forEach(function(clues) {
      clues.clue.forEach(function(clue) {
        clue_mapping[clue.word] = clue.text;
      });
    });
    // Loop through the entries
    var entry_mapping = window.puzdata.get_entry_mapping();
    Object.keys(entry_mapping).forEach(function(word_num) {
      var entry = entry_mapping[word_num];
      var entry_length = entry.length;
      // push to "data"
      data[entry_length - 1] += 1;
      // add to entries_by_count
      if (!entries_by_count[entry_length]) {
        entries_by_count[entry_length] = [];
      }
      entries_by_count[entry_length].push([entry, clue_mapping[word_num]]);
    });

    // Plot
    const ctx = document.getElementById('entries0');
    ctx.innerHTML = '<canvas id="entriesChart"></canvas>';
    const chart = new Chart(document.getElementById('entriesChart'), {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Count',
                data: data,
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Entry length'
                },
                legend: {
                    display: false
                }
            },
            onClick: (e, activeEls) => {
                if (activeEls.length > 0) {
                    const index = activeEls[0].index;
                    entries_of_length(index + 1, 'Number');
                }
            }
        }
    });
    // CHARTS['entries'].push(chart);
}
