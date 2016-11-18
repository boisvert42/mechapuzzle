var clues_render_to = 'clues_js';

function render_clues()
{
    document.getElementById(clues_render_to).innerHTML = '';
    clue_initial_letters();
	clue_lengths();
    starred_clues();
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function clue_initial_letters()
{
	var puzdata = PUZAPP.puzdata;
    var letters = [];
    var clue_lists = [puzdata.across_clues, puzdata.down_clues];
    for (var j=0; j < clue_lists.length; j++)
    {
        clues = clue_lists[j];
        for (var key in clues)
        {
            if (!clues.hasOwnProperty(key))
                continue;
            // Find the first letter of the clue
            for (var i=0; i < clues[key].length; i++)
            {
                if (isLetter(clues[key].charAt(i)))
                {
                    letters.push(clues[key].charAt(i).toUpperCase());
                    break;
                }
            }
        }
    }
    
    document.getElementById(clues_render_to).innerHTML += 'First letters of clues:<br />' + letters.join(' ') + '<br /><br />';
}

function clue_lengths()
{
	// Display the number of clues for each length
	var puzdata = PUZAPP.puzdata;
	var clue_lists = [puzdata.across_clues, puzdata.down_clues];
	var categories = ['1','2','3','4','5','6','7','8','9','>= 10'];
	var data = [];
	// Initialize the data
	for (var i=0; i<categories.length; i++)
	{
		data.push(0);
	}
    for (var j=0; j < clue_lists.length; j++)
    {
        clues = clue_lists[j];
        for (var key in clues)
        {
            if (!clues.hasOwnProperty(key))
                continue;
            // Find the length of the clue
			var clue_length = clues[key].split(' ').length;
			if (clue_length >= 10)
				clue_length = 10;
			// Push to "data"
			data[clue_length-1] += 1;
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
			labels: true
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

function starred_clues() {

    var puzdata = PUZAPP.puzdata;
    var starred_clues = [];
    var starred_clues = getStringsPreOrPostfixedWith(puzdata.across_clues, '*', 'A');
    var starred_down = getStringsPreOrPostfixedWith(puzdata.down_clues, '*', 'D');
    starred_clues.push(starred_down);
   
    document.getElementById(clues_render_to).innerHTML += 'Starred clues:<br />\n\n';

    if (starred_clues.length == 0) {
        document.getElementById(clues_render_to).innerHTML += '&lt;none&gt;' + '<br />\n';
    } else {
        for (var i = 0; i < starred_clues.length; ++i) {
            document.getElementById(clues_render_to).innerHTML += starred_clues[i] + "<br />\n";
        }
        document.getElementById(clues_render_to).innerHTML += "\n<br />\n";
    }
}

function getStringsPreOrPostfixedWith(strings, token, type) {
   
    var retval = [];

    for (var i in strings) {
        if(strings[i].startsWith(token) || strings[i].endsWith(token)) {
            // console.log(i + type + " " + strings[i]);
            retval.push(i + type + " " + strings[i]);
        }
    }

    return retval;
}
