var render_to_theme = 'theme_js';

function render_theme() {
    display_grid(render_to_theme);

    let min_theme_len = 9; // TODO?: allow user to pick?
    let list_of_lists_of_potential_theme_entries = document.createElement('div');

    let buttonLabels = ['Clues', 'Entries'];
    let buttonActions = [function() { toggleByClass('entry') }, function() { toggleByClass('clue') }];
    add_buttons(list_of_lists_of_potential_theme_entries, buttonLabels, buttonActions);

    create_twisty(list_of_lists_of_potential_theme_entries, 'toggle-starred', 'starred');
    add_named_section(list_of_lists_of_potential_theme_entries, 'STARRED CLUES & ENTRIES',
        display_starred_clues(PUZAPP.puzdata));

    create_twisty(list_of_lists_of_potential_theme_entries, 'toggle-long', 'long');
    add_named_section(list_of_lists_of_potential_theme_entries, 'LONG ENTRIES',
        display_long_entries_and_common_substrings(PUZAPP.puzdata, min_theme_len));

    document.getElementById(render_to_theme).appendChild(list_of_lists_of_potential_theme_entries);
}

// append a <div> containing n <button> elements defined by an n-sized array of labels
// and an n-sized array of onClick() functions that are invoked when clicking said buttons
function add_buttons(parent, labelsArr, onClickArr) {
    "use strict";
    let buttons = document.createElement('div');
    for (let i = 0; i < labelsArr.length; ++i) {
        let b = document.createElement('button');
        b.appendChild(document.createTextNode(labelsArr[i]));
        b.onclick = function() { onClickArr[i]() };
        buttons.appendChild(b);
    }
    parent.appendChild(buttons);
}

// prepend to a given parent a clickable '▸' character to toggle display
// assigns the id 'toggleName' to the
function create_twisty(parent, toggleName, toggledId) {
    "use strict";

    let showHide = document.createElement('input');
    showHide.type = 'checkbox';
    showHide.id = toggleName;
    showHide.style.display = 'none';
    showHide.onclick = function () { toggleById(toggledId) };

    let toggled = document.createTextNode('▾');
    let untoggled = document.createTextNode('▸');

    let toggleLabel = document.createElement('label');
    toggleLabel.id = 'shown';
    toggleLabel.htmlFor = toggleName;
    toggleLabel.style.float = 'left';
    toggleLabel.style.marginRight = '5px';
    toggleLabel.appendChild(toggled);
    toggleLabel.onclick = function() { swap_label(toggleLabel, toggled, untoggled) };

    parent.appendChild(showHide);
    parent.appendChild(toggleLabel);
}

function swap_label(item, toggled, untoggled) {
    "use strict";
    let textNode = item.childNodes[0];
    if (textNode == toggled) {
        item.replaceChild(untoggled, item.childNodes[0]);
    } else {
        item.replaceChild(toggled, item.childNodes[0]);
    }
}

function add_named_section(all_items, heading, addedElements, classToAdd, styleToApply) {
    let heading_item = document.createElement('div');
    if (!(typeof classToAdd === 'undefined') || !(classToAdd == null)) {
        heading_item.className = classToAdd;
    }
    if (!(typeof styleToApply === 'undefined') || !(styleToApply == null)) {
        heading_item.style = styleToApply;
    }
    heading_item.appendChild(document.createTextNode(heading));
    all_items.appendChild(heading_item);
    all_items.appendChild(addedElements);
}

function display_starred_clues(puzdata) {
    let retval = document.createElement('div');
    retval.className = 'items indent';
    retval.id = 'starred';

    let starred_across = getCluesPreOrPostfixedWith(puzdata.across_clues, '*', puzdata.across_entries, 'A');
    let starred_down = getCluesPreOrPostfixedWith(puzdata.down_clues, '*', puzdata.down_entries, 'D');

    let starred_clues = starred_across.clues.concat(starred_down.clues);

    if (starred_clues.length == 0) {
        let empty_item = document.createElement('div');
        let newChild = document.createTextNode('<none>');
        empty_item.appendChild(newChild);
        retval.appendChild(empty_item);
    } else {
        let items = document.createElement('div');
        items.className = 'indent';
        add_items(items, starred_across.entries, starred_across.clues);
        add_items(items, starred_down.entries, starred_down.clues);

        retval.appendChild(items);
    }
    return retval;
}

function add_items(elem, entries, clues) {
    "use strict";
    for(let i = 0; i < entries.length; ++i) {
        let clueDiv = document.createElement('div');
        let entryDiv = document.createElement('div');
        let clue = document.createElement('span');
        let entry = document.createElement('span');
        clueDiv.className = 'clue';
        entryDiv.className = 'entry';
        if (i % 2 === 0) {
            clueDiv.className  += ' hilight';
            entryDiv.className += ' hilight';
        }
        clue.appendChild(document.createTextNode(clues[i]));
        entry.appendChild(document.createTextNode(entries[i]));
        clueDiv.appendChild(clue);
        entryDiv.appendChild(entry);
        elem.appendChild(clueDiv);
        elem.appendChild(entryDiv);
    }
}

function getCluesPreOrPostfixedWith(clues, token, entries, type) {
    let retClues = [];
    let retEntries = [];

    for (let i in clues) {
        if (clues.hasOwnProperty(i)) {
            if (clues[i].startsWith(token) || clues[i].endsWith(token)) {
                // console.log(i + type + " " + clues[i]);
                retClues.push(i + type + ' [' + clues[i] + ']');
                retEntries.push(entries[i]);
            }
        }
    }

    return {
        clues: retClues,
        entries: retEntries
    };
}


function display_long_entries_and_common_substrings(puzdata, min_theme_len) {
    let retval = document.createElement('div');
    retval.className = 'indent';
    retval.id = 'long';

    add_named_section(retval, '(across entries of length > ' + min_theme_len + ')',
        display_one_directions_long_entries_and_their_common_substrings(puzdata.across_entries, puzdata.across_clues, min_theme_len),
        'indent', 'display: list-item;');

    add_named_section(retval, '(down entries of length > ' + min_theme_len + ')',
        display_one_directions_long_entries_and_their_common_substrings(puzdata.down_entries, puzdata.down_clues, min_theme_len),
        'indent', 'display: list-item;');

    return retval;
}

function display_one_directions_long_entries_and_their_common_substrings(entries, clues, min_theme_len) {
    let retval = document.createElement('div');
    retval.className = 'items indent';

    let indices_of_potential_theme_entries = getIndicesOfStringsOfAtLeastMinLength(entries, min_theme_len);
    if (indices_of_potential_theme_entries.length == 0) {
        let item = document.createElement('div');
        item.className = 'indent';
        let newChild = document.createTextNode('<none>');
        item.appendChild(newChild);
        retval.appendChild(item);
    } else {
        let potential_theme_entries = [];
        for (let i = 0; i < indices_of_potential_theme_entries.length; ++i) {
            potential_theme_entries.push(entries[indices_of_potential_theme_entries[i]]);
        }
        let longest_common_substrings = longestCommonSubstringsFromMultipleStrings.apply(null, potential_theme_entries);

        for (let i_substr = 0; i_substr < longest_common_substrings.length; ++i_substr) {
            let items = document.createElement('div');
            items.className = 'indent';
            let longest_common_substring = longest_common_substrings[i_substr];
            for (let i = 0; i < indices_of_potential_theme_entries.length; ++i) {
                let hilightedSubstringItemDiv = document.createElement('div');
                let hilightedSubstringItem = document.createElement('span');
                let clueDiv = document.createElement('div');
                let clueItem = document.createElement('span');
                let highlighted_substring_item = document.createElement('span');
                add_highlighted_substring(highlighted_substring_item,
                    entries[indices_of_potential_theme_entries[i]],
                    longest_common_substring);
                clueDiv.className = 'indent clue';
                hilightedSubstringItemDiv.className = 'indent entry';
                if (i % 2 === 0) {
                    clueDiv.className += ' hilight';
                    hilightedSubstringItemDiv.className += ' hilight';
                }
                hilightedSubstringItem.appendChild(highlighted_substring_item);
                hilightedSubstringItemDiv.appendChild(hilightedSubstringItem);
                clueItem.appendChild(document.createTextNode("[" + clues[indices_of_potential_theme_entries[i]] + "]"));
                clueDiv.appendChild(clueItem);
                items.appendChild(hilightedSubstringItemDiv);
                items.appendChild(clueDiv);
            }
            let heading = `longest common substring: ${longest_common_substring.length > 0 ? longest_common_substring : '<none>'}`;
            add_named_section(retval, heading, items, 'indent', 'display: list-item;');
        }
    }

    return retval;
}

// add a version of {string} with {substring} marked (by <mark></mark> tag) to item
// TODO: only highlights first instance of substring (per string)--do something else?
function add_highlighted_substring(item, string, substring) {
    let substring_start_index = string.indexOf(substring);
    item.appendChild(document.createTextNode(string.substring(0, substring_start_index)));
    let marked_part = document.createElement('mark');
    marked_part.appendChild(document.createTextNode(substring));
    item.appendChild(marked_part);
    item.appendChild(document.createTextNode(string.substring(substring_start_index + substring.length, string.length)));
}

// returns indices of all strings from {strings} of length at least {min_len}
// (e.g., if strings 0, 2, and 5 (and none others) are of length at least {min_len}, the return value is [0, 2, 5]
function getIndicesOfStringsOfAtLeastMinLength(strings, min_len) {
    let retval = [];

    for (let i in strings) {
        if (strings.hasOwnProperty(i)) {
            let entry = strings[i];
            if (entry.length >= min_len) {
                retval.push(i);
            }
        }
    }

    return retval;
}

// returns the longest substrings common to {arguments}
function longestCommonSubstringsFromMultipleStrings() {
    if (arguments.length === 0) {
        return ''; // TODO: do something else (e.g., throw an exception)?
    }

    let substringToSourcesMap = {};
    for (let iArg = 0; iArg < arguments.length; ++iArg) {
        let s = arguments[iArg];
        for (let i = 0; i < s.length; ++i) {
            for (let j = i; j <= s.length; ++j) {
                let substring = s.slice(i, j);
                addKeyValuePairToMultimap(substringToSourcesMap, substring, s);
            }
        }
    }

    let retval = [];
    let maxCommonSubstringLen = -1;
    for (let substring in substringToSourcesMap) {
        if (substringToSourcesMap.hasOwnProperty(substring)) {
            if (substring.length < maxCommonSubstringLen) {
                continue;
            }
            if (substringToSourcesMap[substring].length == arguments.length) {
                if (substring.length > maxCommonSubstringLen) {
                    maxCommonSubstringLen = substring.length;
                    retval = [];
                }

                retval.push(substring); // when here, substring.length >= (immediately previous value of) maxCommonSubstringLen
            }
        }
    }

    return retval;
}

// bare-bones multimap implementation
function addKeyValuePairToMultimap(multimap, key, value) {
    if (!(key in multimap)) {
        multimap[key] = [];
    }

    if (multimap[key].indexOf(value) == -1) { // TODO: better way to do this?
        multimap[key].push(value);
    }
}


// given an element id, toggle its visibility
function toggleById(id) {
    "use strict";
    let element = document.getElementById(id);
    if (!(typeof element === 'undefined') || !(element == null)) {
        let s = element.style;
        flipDisplay(s);
    }
}

// given an element class, toggle its visibility
function toggleByClass(classTag) {
    "use strict";
    let elements = document.getElementsByClassName(classTag);
    if (!(typeof elements === 'undefined') || !(element == null)) {
        for (let i = 0; i < elements.length; ++i) {
            let s = elements[i].style;
            flipDisplay(s)
        }
    }
}

function flipDisplay(style) {
    "use strict";

    style.display = style.display === 'none' ? '': 'none';
}