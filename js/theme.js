var render_to_theme = 'theme_js';

function render_theme() {
    display_grid(render_to_theme);

    var min_theme_len = 9; // TODO?: allow user to pick?
    var list_of_lists_of_potential_theme_entries = document.createElement('ul');

    add_heading_and_sublist(list_of_lists_of_potential_theme_entries, 'STARRED CLUES',
        get_ul_of_starred_clues(PUZAPP.puzdata));
    add_heading_and_sublist(list_of_lists_of_potential_theme_entries, 'LONG ENTRIES',
        get_ul_of_long_entries_and_their_common_substrings(PUZAPP.puzdata, min_theme_len));

    document.getElementById(render_to_theme).appendChild(list_of_lists_of_potential_theme_entries);
}


function add_heading_and_sublist(list_of_lists, heading, list_to_be_added) {
    var heading_item = document.createElement('li');
    heading_item.appendChild(document.createTextNode(heading));
    heading_item.appendChild(list_to_be_added);

    list_of_lists.appendChild(heading_item);
}

function get_ul_of_starred_clues(puzdata) {
    var retval = document.createElement('ul');

    var starred_across = getCluesPreOrPostfixedWith(puzdata.across_clues, '*', puzdata.across_entries, 'A');
    var starred_down = getCluesPreOrPostfixedWith(puzdata.down_clues, '*', puzdata.down_entries, 'D');
    var starred_clues = starred_across.concat(starred_down);

    if (starred_clues.length == 0) {
        var item = document.createElement('li');
        item.appendChild(document.createTextNode('<none>'));
        retval.appendChild(item);
    } else {
        for (var i = 0; i < starred_clues.length; ++i) {
            item = document.createElement('li');
            item.appendChild(document.createTextNode(starred_clues[i]));
            retval.appendChild(item);
        }
    }

    return retval;
}

function getCluesPreOrPostfixedWith(clues, token, entries, type) {
    var retval = [];

    for (var i in clues) {
        if (clues[i].startsWith(token) || clues[i].endsWith(token)) {
            // console.log(i + type + " " + clues[i]);
            retval.push(i + type + ' [' + clues[i] + '] ' + entries[i]);
        }
    }

    return retval;
}


function get_ul_of_long_entries_and_their_common_substrings(puzdata, min_theme_len) {
    var retval = document.createElement('ul');

    add_heading_and_sublist(retval, '(across entries of length > ' + min_theme_len + ')',
        get_ul_of_one_directions_long_entries_and_their_common_substrings(puzdata.across_entries, min_theme_len));

    add_heading_and_sublist(retval, '(down entries of length > ' + min_theme_len + ')',
        get_ul_of_one_directions_long_entries_and_their_common_substrings(puzdata.down_entries, min_theme_len));

    return retval;
}

function get_ul_of_one_directions_long_entries_and_their_common_substrings(entries, min_theme_len) {
    var retval = document.createElement('ul');

    var potential_theme_entries = getStringsOfAtLeastMinLength(entries, min_theme_len);
    if (potential_theme_entries.length == 0) {
        var item = document.createElement('li');
        item.appendChild(document.createTextNode('<none>'));
        retval.appendChild(item);
    } else {
        var longest_common_substrings = longestCommonSubstringsFromMultipleStrings.apply(null, potential_theme_entries);
        for (var i_substr = 0; i_substr < longest_common_substrings.length; ++i_substr) {
            var longest_common_substring = longest_common_substrings[i_substr];

            var list_for_particular_substring = document.createElement('ul');
            for (var i = 0; i < potential_theme_entries.length; ++i) {
                var highlighted_substring_item = document.createElement('li');
                add_highlighted_substring(highlighted_substring_item, potential_theme_entries[i], longest_common_substring);
                list_for_particular_substring.appendChild(highlighted_substring_item);
            }

            var heading = '\nlongest common substring: ' + (longest_common_substring.length > 0 ? longest_common_substring : '<none>');
            add_heading_and_sublist(retval, heading, list_for_particular_substring);
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

// returns all strings from {strings} of length at least {min_len}
function getStringsOfAtLeastMinLength(strings, min_len) {
    var retval = [];

    for (var i in strings) {
        var entry = strings[i];
        if (entry.length >= min_len) {
            retval.push(entry);
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
