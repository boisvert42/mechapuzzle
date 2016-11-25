var render_to_theme = 'theme_js';

function render_theme() {
    document.getElementById(render_to_theme).innerHTML = '';
    display_grid(render_to_theme);


    // TODO?: is there a "better" way to do that--instead of just building strings with HTML, is there something offered by Javascript that is somehow better?
    // (DOM, apparently?)
    var potential_theme_entries_lists = '<ul>';

    potential_theme_entries_lists += get_heading_in_list_item('STARRED CLUES');
    potential_theme_entries_lists += get_starred_clues(PUZAPP.puzdata);

    var min_theme_len = 9; // TODO?: allow user to pick?
    potential_theme_entries_lists += get_heading_in_list_item('LONG ENTRIES');
    potential_theme_entries_lists += get_long_entries_and_their_common_substrings(PUZAPP.puzdata, min_theme_len);

    potential_theme_entries_lists += '</ul>';

    document.getElementById(render_to_theme).innerHTML += potential_theme_entries_lists;
}

// TODO: fancy this up?
function get_heading_in_list_item(title) {
    return '<li>' + title + '</li>';
}


function get_starred_clues(puzdata) {
    var retval = '';

    var starred_across = getCluesPreOrPostfixedWith(puzdata.across_clues, '*', puzdata.across_entries, 'A');
    var starred_down = getCluesPreOrPostfixedWith(puzdata.down_clues, '*', puzdata.down_entries, 'D');
    var starred_clues = starred_across.concat(starred_down);

    if (starred_clues.length == 0) {
        retval += '&lt;none&gt;\n';
    } else {
        retval += '<ul>\n';
        for (var i = 0; i < starred_clues.length; ++i) {
            retval += '<li>' + starred_clues[i] + "</li>\n";
        }
        retval += '</ul>\n';
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


function get_long_entries_and_their_common_substrings(puzdata, min_theme_len) {
    var retval = '';

    //document.getElementById(render_to_theme).style.fontFamily = "monospace";

    retval += '<ul>';

    // TODO: stop (essentially) duplicating code (i.e., the next 15 lines--for across, then for down)
    retval += '<li>(across entries of length > ' + min_theme_len + ')</li>';
    retval += get_one_directions_long_entries_and_their_common_substrings(puzdata.across_entries, min_theme_len);

    retval += '<li>(down entries of length > ' + min_theme_len + ')</li>\n\n';
    retval += get_one_directions_long_entries_and_their_common_substrings(puzdata.down_entries, min_theme_len);

    retval += '</ul>';

    return retval;
}

function get_one_directions_long_entries_and_their_common_substrings(entries, min_theme_len) {
    var retval = '';

    var potential_theme_entries = getStringsOfAtLeastMinLength(entries, min_theme_len);
    if (potential_theme_entries.length == 0) {
        retval += '&lt;none&gt;' + '<br />\n';
    } else {
        retval += '<ul>';
        var longest_common_substrings = longestCommonSubstringsFromMultipleStrings.apply(null, potential_theme_entries);
        for (var i_substr = 0; i_substr < longest_common_substrings.length; ++i_substr) {
            var longest_common_substring = longest_common_substrings[i_substr];
            retval += '<li>\nlongest common substring: ' + (longest_common_substring.length > 0 ? longest_common_substring : '&lt;none&gt;') + '</li>\n';
            retval += '<ul>';
            for (var i = 0; i < potential_theme_entries.length; ++i) {
                retval += '<li>' + markSubstring(potential_theme_entries[i], longest_common_substring) + '</li>\n';
            }
            retval += '</ul>'
        }
        retval += '</ul>';
    }

    return retval;
}

// returns a version of {string} with {substring} marked (by <mark></mark> tag)
// TODO: only highlights first instance of substring (per string)--do something else?
function markSubstring(string, substring) {
    var retval = '';

    var substring_start_index = string.indexOf(substring);
    retval += string.substring(0, substring_start_index);
    retval += '<mark>' + substring + '</mark>';
    retval += string.substring(substring_start_index + substring.length, string.length);

    return retval;
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
