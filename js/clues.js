var clues_render_to = 'clues_js';

function render_clues(puzdata)
{
    document.getElementById(clues_render_to).innerHTML = '';
    clue_initial_letters(puzdata);
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function clue_initial_letters(puzdata)
{
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

