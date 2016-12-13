var render_to_theme = 'theme_js';

function render_theme() {
    display_grid(render_to_theme);

    let min_theme_len = 9; // TODO?: allow user to pick?
    let list_of_lists_of_potential_theme_entries = document.createElement('div');

    create_twisty(list_of_lists_of_potential_theme_entries, 'toggle-starred', 'starred');
    add_named_section(list_of_lists_of_potential_theme_entries, 'STARRED CLUES',
        display_starred_clues(PUZAPP.puzdata));

    create_twisty(list_of_lists_of_potential_theme_entries, 'toggle-long', 'long');
    add_named_section(list_of_lists_of_potential_theme_entries, 'LONG ENTRIES',
        display_long_entries_and_common_substrings(PUZAPP.puzdata, min_theme_len));

    document.getElementById(render_to_theme).appendChild(list_of_lists_of_potential_theme_entries);
}

function create_twisty(parent, toggleName, toggledId) {
    "use strict";

    let showHide = document.createElement('input');
    showHide.type = 'checkbox';
    showHide.id = toggleName;
    showHide.style.display = 'none';
    showHide.onclick = function () { toggle_display(toggledId) };

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

function add_named_section(all_items, heading, addedElements, classToAdd) {
    let heading_item = document.createElement('div');
    if (!(typeof classToAdd === 'undefined') || !(classToAdd == null)) {
        heading_item.className = classToAdd;
    }
    heading_item.appendChild(document.createTextNode(heading));
    all_items.appendChild(heading_item);
    all_items.appendChild(addedElements);
}

function display_starred_clues(puzdata) {
    let retval = document.createElement('div');
    retval.className = 'items indent-l1';
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
        let right_items = document.createElement('div');
        right_items.className = 'item-right indent-l2';
        add_items(right_items, 'indent-l2', starred_across.entries);
        add_items(right_items, 'indent-l2', starred_down.entries);
        retval.appendChild(right_items);

        // LEFT-HAND ITEMS
        let left_items = document.createElement('div');
        left_items.className = 'item-left indent-l2';
        add_items(left_items, 'indent-l2', starred_across.clues);
        add_items(left_items, 'indent-l2', starred_down.clues);
        retval.appendChild(left_items);
    }
    return retval;
}

function add_items(elem, class_type, itemArray) {
    "use strict";
    for(let i = 0; i < itemArray.length; ++i) {
        let this_item = document.createElement('div');
        if (i % 2 === 0) {
            this_item.className = 'hilight ' + class_type;
        }
        this_item.appendChild(document.createTextNode(itemArray[i]));
        elem.appendChild(this_item);
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
    retval.className = 'items indent-l1';
    retval.id = 'long';

    add_named_section(retval, '(across entries of length > ' + min_theme_len + ')',
        display_one_directions_long_entries_and_their_common_substrings(puzdata.across_entries, puzdata.across_clues, min_theme_len),
        'indent-l2');

    add_named_section(retval, '(down entries of length > ' + min_theme_len + ')',
        display_one_directions_long_entries_and_their_common_substrings(puzdata.down_entries, puzdata.down_clues, min_theme_len),
        'indent-l2');

    return retval;
}

function display_one_directions_long_entries_and_their_common_substrings(entries, clues, min_theme_len) {
    let retval = document.createElement('div');
    retval.className = 'indent-l3';

    let indices_of_potential_theme_entries = getIndicesOfStringsOfAtLeastMinLength(entries, min_theme_len);
    if (indices_of_potential_theme_entries.length == 0) {
        let item = document.createElement('div');
        item.className = 'indent-l4';
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
            let some_items = document.createElement('div');
            let left_items = document.createElement('div');
            left_items.className = 'item-left indent-l5';
            let right_items = document.createElement('div');
            right_items.className = 'item-right indent-l5';

            let longest_common_substring = longest_common_substrings[i_substr];
            let rightItem;
            let leftItem;
            for (let i = 0; i < indices_of_potential_theme_entries.length; ++i) {
                let highlighted_substring_item = document.createElement('span');
                add_highlighted_substring(highlighted_substring_item,
                    entries[indices_of_potential_theme_entries[i]],
                    longest_common_substring);
                rightItem = document.createElement('div');
                leftItem = document.createElement('div');
                if (i % 2 === 0) {
                    rightItem.className = 'hilight indent-l5';
                    leftItem.className = 'hilight indent-l5';
                }
                rightItem.appendChild(document.createTextNode("[" + clues[indices_of_potential_theme_entries[i]] + "]"));
                right_items.appendChild(rightItem);
                leftItem.appendChild(highlighted_substring_item);
                left_items.appendChild(leftItem);
            }

            let heading = '\nlongest common substring: ' + (longest_common_substring.length > 0 ? longest_common_substring : '<none>');

            // right before left, again.
            some_items.appendChild(right_items);
            some_items.appendChild(left_items);
            add_named_section(retval, heading, some_items);
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
function toggle_display(id) {
    let element = document.getElementById(id);
    if (!(typeof element === 'undefined') || !(element == null)) {
        if (element.style.display === 'none') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }
}