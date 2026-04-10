var clues_render_to = 'clues_js';

function render_clues() {
    document.getElementById(clues_render_to).innerHTML = '';
    clue_initial_letters();
    clue_lengths();
    clue_list();
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function clues_of_length(clue_length, sort_by)
{
  // Display clues of a given length in the #clues1 div
  puzdata = window.puzdata;
  var html = '';
	html += 'Sort by: ';
	html += '<form action="." name="entry_sorter">';
	html += '<input type="radio" id="Clue" name="entry_sort" value="Clue" onclick="clues_of_length(' + clue_length + ', \'Clue\');"><label for="Clue">Clue</label>';
	html += '<input type="radio" id="Entry" name="entry_sort" value="Entry" onclick="clues_of_length(' + clue_length + ', \'Entry\');"><label for="Entry">Entry</label>';
	html += '<input type="radio" id="Number" name="entry_sort" value="Number"  onclick="clues_of_length(' + clue_length + ', \'Number\');"><label for="Number">Number</label>';
	html += '</form>\n';
	html += '<big><pre>\n';

	var myobj = puzdata.all_entries.filter(x => x['Clue'].split(' ').length == clue_length);
	if (clue_length >= 10) {
		myobj = puzdata.all_entries.filter(x => x['Clue'].split(' ').length >= 10);
	}
	sort_entries(myobj, sort_by);
    for (var j = 0; j < myobj.length; j++) {
        var entry = myobj[j]['Entry']; var clue = myobj[j]['Clue'];
        html += entry + ': [ ' + clue + ' ]\n';
    }
    html += '</pre></big>\n';
    document.getElementById('clues1').innerHTML = html;
	return false;
}

function clue_initial_letters() {
    var puzdata = window.puzdata;
    var letters = [];
    var clue_lists = puzdata.clues;
    for (var j = 0; j < clue_lists.length; j++) {
        var clues = clue_lists[j].clue;
        clues.forEach(function(x) {
          var clue_text = x.text;
          for (var i=0; i<clue_text.length; i++) {
            if (isLetter(clue_text.charAt(i))) {
              letters.push(clue_text.charAt(i).toUpperCase());
              break;
            }
          }
        });
    }
    document.getElementById(clues_render_to).innerHTML += 'First letters of clues:<br />' + letters.join(' ') + '<br /><br />';
}

function clue_lengths() {
    /**
     * Aggregates clue lengths (by word count) and renders a horizontal bar chart.
     * Clicking a bar filters the detailed clue list to that specific length.
     */
    var puzdata = window.puzdata;
    var clue_lists = puzdata.clues;
    var categories = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '>= 10'];
    var data = [];
	var clues_by_count = {};
    
    // Initialize buckets
    for (var i = 0; i < categories.length; i++) {
        data.push(0);
    }
    
    var entry_mapper = puzdata.get_entry_mapping();
    for (var j = 0; j < clue_lists.length; j++) {
        var clues = clue_lists[j].clue;
        clues.forEach(function(x) {
          var clue_text = x.text;
          var clue_length = clue_text.split(' ').length;
          if (clue_length >= 10)
              clue_length = 10;
          
          data[clue_length - 1] += 1;
          
          if (!clues_by_count[clue_length]) {
            clues_by_count[clue_length] = [];
          }
          clues_by_count[clue_length].push([entry_mapper[x.word], clue_text]);
        });
    }

    // Chart.js Horizontal Bar Chart
    const ctx = document.getElementById('clues0');
    ctx.innerHTML = '<canvas id="cluesChart"></canvas>';
    const chart = new Chart(document.getElementById('cluesChart'), {
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
            indexAxis: 'y', // Makes it a horizontal bar chart
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Clue length (number of words)'
                },
                legend: {
                    display: false
                }
            },
            onClick: (e, activeEls) => {
                if (activeEls.length > 0) {
                    const index = activeEls[0].index;
                    clues_of_length(index + 1, 'Number');
                }
            }
        }
    });
}

function clue_list() {
    const puzdata = window.puzdata;
    const entries = puzdata.all_entries;
    var html =
        "<style> .clue-item { display: flex; justify-content: space-between; max-width: 500px; } </style>\n\n";

    const acrossEntries = entries
        .filter((entry) => entry.Direction === "ACROSS")
        .sort((a, b) => parseInt(a.number) - parseInt(b.number));
    const downEntries = entries
        .filter((entry) => entry.Direction === "DOWN")
        .sort((a, b) => parseInt(a.number) - parseInt(b.number));

    const displayTemplate = (entry) =>
        `<div class="clue-item"><span><strong>${entry.Number}.</strong> ${entry.Clue} </span><span><em>${entry.Entry}</em></span></div>`;

    html += "<h3>ACROSS</h3>";
    for (var entry of acrossEntries) {
        html += displayTemplate(entry);
    }
    html += "<br /><h3>DOWN</h3>";
    for (var entry of downEntries) {
        html += displayTemplate(entry);
    }
    document.getElementById("clues1").innerHTML = html;
}