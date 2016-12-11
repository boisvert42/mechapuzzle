var render_to_theme = 'theme_js';

function render_theme() {
    display_grid(render_to_theme);

    var min_theme_len = 9; // TODO?: allow user to pick?
    var list_of_lists_of_potential_theme_entries = document.createElement('div');

    add_named_section(list_of_lists_of_potential_theme_entries, 'STARRED CLUES',
        display_starred_clues(PUZAPP.puzdata));
    add_named_section(list_of_lists_of_potential_theme_entries, 'LONG ENTRIES',
        display_long_entries_and_common_substrings(PUZAPP.puzdata, min_theme_len));

    document.getElementById(render_to_theme).appendChild(list_of_lists_of_potential_theme_entries);
}


function add_named_section(all_items, heading, addedElements) {
    var heading_item = document.createElement('div');
    heading_item.appendChild(document.createTextNode(heading));
    all_items.appendChild(heading_item);
    all_items.appendChild(addedElements);
}

function display_starred_clues(puzdata) {
    var retval = document.createElement('div');
    retval.className = 'items';

    var starred_across = getCluesPreOrPostfixedWith(puzdata.across_clues, '*', puzdata.across_entries, 'A');
    var starred_down = getCluesPreOrPostfixedWith(puzdata.down_clues, '*', puzdata.down_entries, 'D');

    var starred_clues = starred_across.clues.concat(starred_down.clues);

    if (starred_clues.length == 0) {
        var empty_item = document.createElement('div');
        var newChild = document.createTextNode('<none>');
        empty_item.appendChild(newChild);
        retval.appendChild(empty_item);
    } else {
        // for some reason, according to comments found on stackoverflow,
        // when doing this sort of thing, the right-hand item
        // needs to come first. Seems to work

        // RIGHT-HAND ITEMS
        var right_items = document.createElement('div');
        right_items.className = 'item-right';
        var thisItem;

        for (var i = 0; i < starred_across.entries.length; ++i) {
             thisItem = document.createElement('div');
            if (i % 2 === 0) {
                thisItem.className = 'hilight';
            }
            thisItem.appendChild(document.createTextNode(starred_across.entries[i]));
            right_items.appendChild(thisItem);
        }
        for (var i = 0; i < starred_down.entries.length; ++i) {
            thisItem = document.createElement('div');
            if (i % 2 === 0) {
                thisItem.className = 'hilight';
            }
            thisItem.appendChild(document.createTextNode(starred_down.entries[i]));
            right_items.appendChild(thisItem);
        }
        retval.appendChild(right_items);

        // LEFT-HAND ITEMS
        var left_items = document.createElement('div');
        left_items.className = 'item-left';
        for (var i = 0; i < starred_across.clues.length; ++i) {
            thisItem = document.createElement('div');
            if (i % 2 === 0) {
                thisItem.className = 'hilight';
            }
            thisItem.appendChild(document.createTextNode(starred_across.clues[i]));
            left_items.appendChild(thisItem);
        }
        for (var i = 0; i < starred_down.clues.length; ++i) {
            thisItem = document.createElement('div');
            if (i % 2 === 0) {
                thisItem.className = 'hilight';
            }
            thisItem.appendChild(document.createTextNode(starred_down.clues[i]));
            left_items.appendChild(thisItem);
        }
        retval.appendChild(left_items);
    }

    return retval;
}

function getCluesPreOrPostfixedWith(clues, token, entries, type) {
    var retClues = [];
    var retEntries = [];

    for (var i in clues) {
        if (clues[i].startsWith(token) || clues[i].endsWith(token)) {
            // console.log(i + type + " " + clues[i]);
            retClues.push(i + type + ' [' + clues[i] + ']');
            retEntries.push(entries[i]);
        }
    }

    return {
        clues: retClues,
        entries: retEntries
    };
}


function display_long_entries_and_common_substrings(puzdata, min_theme_len) {
    var retval = document.createElement('div');
    retval.className = 'items';

    add_named_section(retval, '(across entries of length > ' + min_theme_len + ')',
        display_one_directions_long_entries_and_their_common_substrings(puzdata.across_entries, puzdata.across_clues, min_theme_len));

    add_named_section(retval, '(down entries of length > ' + min_theme_len + ')',
        display_one_directions_long_entries_and_their_common_substrings(puzdata.down_entries, puzdata.down_clues, min_theme_len));

    return retval;
}

function display_one_directions_long_entries_and_their_common_substrings(entries, clues, min_theme_len) {
    var retval = document.createElement('div');

    var indices_of_potential_theme_entries = getIndicesOfStringsOfAtLeastMinLength(entries, min_theme_len);
    if (indices_of_potential_theme_entries.length == 0) {
        var item = document.createElement('div');
        var newChild = document.createTextNode('<none>');
        item.appendChild(newChild);
        retval.appendChild(item);
    } else {
        var potential_theme_entries = [];
        for (var i = 0; i < indices_of_potential_theme_entries.length; ++i) {
            potential_theme_entries.push(entries[indices_of_potential_theme_entries[i]]);
        }
        var longest_common_substrings = longestCommonSubstringsFromMultipleStrings.apply(null, potential_theme_entries);

        for (var i_substr = 0; i_substr < longest_common_substrings.length; ++i_substr) {
            var some_items = document.createElement('div');
            var left_items = document.createElement('div');
            left_items.className = 'item-left';
            var right_items = document.createElement('div');
            right_items.className = 'item-right';

            var longest_common_substring = longest_common_substrings[i_substr];
            var rightItem;
            var leftItem;
            for (var i = 0; i < indices_of_potential_theme_entries.length; ++i) {
                var highlighted_substring_item = document.createElement('span');
                add_highlighted_substring(highlighted_substring_item,
                    entries[indices_of_potential_theme_entries[i]],
                    longest_common_substring);
                rightItem = document.createElement('div');
                leftItem = document.createElement('div');
                if (i % 2 === 0) {
                    rightItem.className = 'hilight';
                    leftItem.className = 'hilight';
                }
                rightItem.appendChild(document.createTextNode("[" + clues[indices_of_potential_theme_entries[i]] + "]"));
                right_items.appendChild(rightItem);
                leftItem.appendChild(highlighted_substring_item);
                left_items.appendChild(leftItem);
            }

            var heading = '\nlongest common substring: ' + (longest_common_substring.length > 0 ? longest_common_substring : '<none>');

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
    var substring_start_index = string.indexOf(substring);
    item.appendChild(document.createTextNode(string.substring(0, substring_start_index)));
    var marked_part = document.createElement('mark');
    marked_part.appendChild(document.createTextNode(substring));
    item.appendChild(marked_part);
    item.appendChild(document.createTextNode(string.substring(substring_start_index + substring.length, string.length)));
}

// returns indices of all strings from {strings} of length at least {min_len}
// (e.g., if strings 0, 2, and 5 (and none others) are of length at least {min_len}, the return value is [0, 2, 5]
function getIndicesOfStringsOfAtLeastMinLength(strings, min_len) {
    var retval = [];

    for (var i in strings) {
        var entry = strings[i];
        if (entry.length >= min_len) {
            retval.push(i);
        }
    }

    return retval;
}

// returns the longest substrings common to {arguments}
function longestCommonSubstringsFromMultipleStrings() {
    if (arguments.length === 0) {
        return ''; // TODO: do something else (e.g., throw an exception)?
    }

    var substringToSourcesMap = {};
    for (var iArg = 0; iArg < arguments.length; ++iArg) {
        var s = arguments[iArg];
        for (var i = 0; i < s.length; ++i) {
            for (var j = i; j <= s.length; ++j) {
                var substring = s.slice(i, j);
                addKeyValuePairToMultimap(substringToSourcesMap, substring, s);
            }
        }
    }

    var retval = [];
    var maxCommonSubstringLen = -1;
    for (var substring in substringToSourcesMap) {
//        if (!substringToSourcesMap.hasOwnProperty(substring)) { // TODO: is this needed? is this also needed for other for-in constructs?
//            continue;
//        }

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
