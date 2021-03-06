var clues_render_to = 'clues_js';

function render_clues() {
    document.getElementById(clues_render_to).innerHTML = '';
    clue_initial_letters();
    clue_lengths();
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function clues_of_length(clue_length, sort_by)
{
    // Display clues of a given length in the #clues1 div
    var html = '';
	html += 'Sort by: ';
	html += '<form action="." name="entry_sorter">';
	html += '<input type="radio" id="Clue" name="entry_sort" value="Clue" onclick="clues_of_length(' + clue_length + ', \'Clue\');"><label for="Clue">Clue</label>';
	html += '<input type="radio" id="Entry" name="entry_sort" value="Entry" onclick="clues_of_length(' + clue_length + ', \'Entry\');"><label for="Entry">Entry</label>';
	html += '<input type="radio" id="Number" name="entry_sort" value="Number"  onclick="clues_of_length(' + clue_length + ', \'Number\');"><label for="Number">Number</label>';
	html += '</form>\n';
	html += '<big><pre>\n';
	var myobj = PUZAPP.puzdata.all_entries.filter(x => x['Clue'].split(' ').length == clue_length);
	if (clue_length >= 10) {
		myobj = PUZAPP.puzdata.all_entries.filter(x => x['Clue'].split(' ').length >= 10);
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
    var puzdata = PUZAPP.puzdata;
    var letters = [];
    var clue_lists = [puzdata.across_clues, puzdata.down_clues];
    for (var j = 0; j < clue_lists.length; j++) {
        var clues = clue_lists[j];
        for (var key in clues) {
            if (!clues.hasOwnProperty(key))
                continue;
            // Find the first letter of the clue
            for (var i = 0; i < clues[key].length; i++) {
                if (isLetter(clues[key].charAt(i))) {
                    letters.push(clues[key].charAt(i).toUpperCase());
                    break;
                }
            }
        }
    }

    document.getElementById(clues_render_to).innerHTML += 'First letters of clues:<br />' + letters.join(' ') + '<br /><br />';
}

function clue_lengths() {
    // Display the number of clues for each length
    var puzdata = PUZAPP.puzdata;
    var clue_lists = [puzdata.across_clues, puzdata.down_clues];
	var entry_lists = [puzdata.across_entries, puzdata.down_entries];
    var categories = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '>= 10'];
    var data = [];
	var clues_by_count = {};
    // Initialize the data
    for (var i = 0; i < categories.length; i++) {
        data.push(0);
    }
    for (var j = 0; j < clue_lists.length; j++) {
        var clues = clue_lists[j];
		var entries = entry_lists[j];
        for (var key in clues) {
            if (!clues.hasOwnProperty(key))
                continue;
            // Find the length of the clue
            var clue_length = clues[key].split(' ').length;
            if (clue_length >= 10)
                clue_length = 10;
            // Push to "data"
            data[clue_length - 1] += 1;
			// Push to clues_by_count
			if (!clues_by_count[clue_length]) {
                clues_by_count[clue_length] = [];
            }
			clues_by_count[clue_length].push([entries[key], clues[key]]);
        }
    }
    data.unshift('Count');
    // Plot
    var chart = c3.generate({
        bindto: '#clues0',
        title: {
            text: 'Clue length (number of words)'
        },
        data: {
            columns: [data],
            type: 'bar',
            labels: true,
			onclick: function (e) { clues_of_length(e.index + 1, 'Number'); }
        },
        size: {
            // Chart won't render unless we initialize the size up front
            width: 340
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
    CHARTS['clues'].push(chart);
}
