var grid_render_to = 'grid_js';
var colors = ['aqua', 'gold', 'chartreuse', 'greenyellow', 'lightskyblue', 'orange', 'plum'];

var standard_letter_distribution = [11.3, 1.9, 2.9, 3.6, 13.0, 1.1, 2.0, 2.4, 6.3, 0.3, 1.1, 5.1, 2.9, 6.0, 7.7, 2.9, 0.1, 6.9, 8.8, 7.2, 2.4, 0.8, 1.1, 0.3, 1.6, 0.3];

var highlighted_letters = {'A':0, 'B':0, 'C':0, 'D':0, 'E':0, 'F':0, 'G':0, 'H':0, 'I':0, 'J':0, 'K':0, 'L':0, 'M':0, 'N':0, 'O':0, 'P':0, 'Q':0, 'R':0, 'S':0, 'T':0, 'U':0, 'V':0, 'W':0, 'X':0, 'Y':0, 'Z':0};
var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function render_grid() {
    document.getElementById(grid_render_to).innerHTML = '';
    width_height();
    symmetry();
    display_grid(grid_render_to);
    letter_frequency();
}

function width_height() {
    var puzdata = window.puzdata;
    var width_height = puzdata.metadata.width + 'x' + puzdata.metadata.height;
    var is_unusual_size = false;
    if (puzdata.metadata.width != 15 || puzdata.metadata.height != 15) {
        is_unusual_size = true;
    }
    if (is_unusual_size) {
        width_height = '<mark>' + width_height + '</mark>';
    }
    document.getElementById(grid_render_to).innerHTML += 'Grid size: ' + width_height + '<br />\n';
}

function symmetry() {
    /**
     * Checks for 180-degree rotational symmetry.
     * Compares each cell with its counterpart from the opposite side of the grid.
     */
    var puzdata = window.puzdata;
    var sol = '';
    puzdata.cells.forEach(function(x) {
      if (x.type == 'block') {sol += '.';}
      else {sol += x.solution;}
    });
    var sol_length = sol.length;
    var is_symmetric = true;
    for (var i = 0; i < sol_length / 2; i++) {
        if ((sol.charAt(i) == '.' && sol.charAt(sol_length - 1 - i) != '.') || (sol.charAt(i) != '.' && sol.charAt(sol_length - 1 - i) == '.')) {
            is_symmetric = false;
            break;
        }
    }
    var symmetry_text = 'Grid is symmetric (180&deg; rotational symmetry)';
    if (!is_symmetric) {
        symmetry_text = '<mark>Grid does not have standard (180&deg; rotational) symmetry</mark>';
    }
    document.getElementById(grid_render_to).innerHTML += symmetry_text + '<br />\n';
}

/* toggle theme status of an entry */
function toggle_theme(grid_num, dir, render_to) {
    var puzdata = window.puzdata;
    var dir_index = (dir == 'across') ? 0 : 1;
    var dir_theme_entries = puzdata.theme[dir_index];
    if (dir_theme_entries.has(grid_num)) {
        dir_theme_entries.delete(grid_num);
    }
    else {
        dir_theme_entries.add(grid_num);
    }
    // Re-display the grid
    display_grid(render_to);
    return true;
}

function display_grid() // display_grid(render_to = NULL)
{
    var puzdata = window.puzdata;

    // Optional arguments
    var render_to = (arguments[0] ? arguments[0] : grid_render_to);

    document.getElementById(render_to).innerHTML = '';

    var h = puzdata.metadata.height;
    var w = puzdata.metadata.width;
    var thisGrid = new xwGrid(puzdata.cells);
    var grid_html = '<table class="grid">\n';
    // for circles
    var background_shapes = puzdata.cells.map(x => x['background-shape']);

    // for tooltips: create lookups of (x, y) -> across number and down number
    var acrossWordClues = {}, downWordClues = {};
    var acrossEntries = thisGrid.acrossEntries();
    var downEntries = thisGrid.downEntries();
    Object.keys(acrossEntries).forEach(function(num) {
        var wd = acrossEntries[num];
        var clue = puzdata.all_entries.find((entry) => (entry.Number == num && entry.Direction.toLowerCase() == 'across'));
        if (clue) {
            wd.cells.forEach(function(cell_coords) {
              acrossWordClues[cell_coords] = clue;
            });
        }
    });

    //console.log(downEntries);
    Object.keys(downEntries).forEach(function(num) {
        var wd = downEntries[num];
        var clue = puzdata.all_entries.find((entry) => (entry.Number == num && entry.Direction.toLowerCase() == 'down'));
        if (clue) {
            wd.cells.forEach(function(cell_coords) {
              downWordClues[cell_coords] = clue;
            });
        }
    });
    //console.log(downWordClues);

    for (var y = 0; y < h; y++) {
        grid_html += '<tr>';
        for (var x = 0; x < w; x++) {
            var thisCell = thisGrid.cellAt(x, y);
            var sol_at_index = thisGrid.letterAt(x, y) || '.';
            var thisNumber = thisCell.number || '';
            var td_class_arr = [];
            var td_class = (thisGrid.isBlack(x, y) ? ' class="black"' : '');

            var cell_key = x + ',' + y;
            var awc = acrossWordClues[cell_key] || {};
            var dwc = downWordClues[cell_key] || {};
            var across_number = awc.Number || '';
            var down_number = dwc.Number || '';

            /** For the tooltip **/
            var tooltip_text = (across_number ? across_number + 'A: ' + awc.Clue : '');
            if (across_number && down_number) tooltip_text += '<br />';
            tooltip_text += (down_number ? down_number + 'D: ' + dwc.Clue : '');

            /** For coloring **/
            if (puzdata.theme[0].has(across_number) || puzdata.theme[1].has(down_number)) {
                td_class = ' class="theme"';
            }

            if (highlighted_letters[sol_at_index]) {
                td_class = ' class="highlighted"';
            }

            /**
             * All cells have the class of "puzcell"
             * Circled ones have an additional "circle" class
             **/
            var div_class_array = ['puzcell'];
            if (thisCell['background-shape']) {
                div_class_array.push('circle');
            }
            var div_class = ' class="' + div_class_array.join(' ') + '"';
            grid_html += '<td' + td_class + ' onclick="toggle_theme(' + across_number + ',\'across\',\'' + render_to + '\');return false;" ';
            grid_html += 'oncontextmenu="toggle_theme(' + down_number + ',\'down\',\'' + render_to + '\');return false;">\n';
            grid_html += '  <div' + div_class + '>\n';
            grid_html += '    <div class="number">' + thisNumber + '</div>\n';
            grid_html += '    <div class="letter">' + sol_at_index + '</div>\n';
            if (across_number || down_number) {
                grid_html += '    <span class="celltooltip">' + tooltip_text + '</span>\n';
            }
            grid_html += '  </div>\n';
            grid_html += '</td>\n';
        }
        grid_html += '</tr>';
    }
    grid_html += '</table>';
    //console.log(grid_html);
    document.getElementById(render_to).innerHTML += grid_html + '<br />\n';
}

function letter_frequency() {
    var puzdata = window.puzdata;
    var sol = '';
    puzdata.cells.forEach(function(x) {
      if (x.type == 'block') {sol += '.';}
      else {sol += x.solution;}
    });
    // Container for letter counts
    var letter_counts = [];
    for (var i = 0; i < 26; i++) {
        letter_counts[i] = 0;
    }
    var total_letters = 0;
    for (i = 0; i < sol.length; i++) {
        var mychar = sol.charAt(i);
        if (mychar != '.') {
            var num = sol.charCodeAt(i) - 65;
            letter_counts[num] += 1;
            total_letters += 1;
        }
    }

    // Array of letters
    var letters = [];
    for (i = 0; i < 26; i++) {
        letters[i] = String.fromCharCode(i + 65);
    }

    // Fake standard counts
    var standard_counts = [];
    for (i = 0; i < 26; i++) {
        standard_counts[i] = Math.round(total_letters * standard_letter_distribution[i] / 100);
    }

    function highlight_letter(x) {
        highlighted_letters[ALPHABET.charAt(x)] = 1 - highlighted_letters[ALPHABET.charAt(x)];
        display_grid(grid_render_to);
    }

    // Now plot!
    const ctx = document.getElementById('grid0');
    ctx.innerHTML = '<canvas id="gridChart"></canvas>';
    const chart = new Chart(document.getElementById('gridChart'), {
        type: 'bar',
        data: {
            labels: letters,
            datasets: [
                {
                    label: 'This puzzle',
                    data: letter_counts,
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Typical puzzle',
                    data: standard_counts,
                    backgroundColor: 'rgba(189, 195, 199, 0.5)',
                    borderColor: 'rgba(189, 195, 199, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Letter counts (click a bar to highlight in the grid)'
                }
            },
            onClick: (e, activeEls) => {
                if (activeEls.length > 0) {
                    const index = activeEls[0].index;
                    highlight_letter(index);
                }
            }
        }
    });
    // CHARTS['grid'].push(chart);
}
