var render_to_theme = 'theme_js';

function render_theme()
{
    document.getElementById(render_to_theme).innerHTML = '';
    display_grid(render_to_theme);
    display_theme();
}

function display_theme()
{
    var puzdata = PUZAPP.puzdata;
    var min_theme_len = 9;
    //document.getElementById(render_to_theme).style.fontFamily = "monospace";

    document.getElementById(render_to_theme).innerHTML += '(across entries of length > ' + min_theme_len  + ')<br />\n\n';
    var potential_across_theme_entries = getStringsOfAtLeastMinLength(puzdata.across_entries, min_theme_len);
//    document.getElementById(render_to_theme).innerHTML += '**' + potential_across_theme_entries + ': ' + potential_across_theme_entries.length + '**'
    if (potential_across_theme_entries.length == 0) {
        document.getElementById(render_to_theme).innerHTML += '&lt;none&gt;' + '<br />\n';
    } else {
        longest_common_substrings_across = longestCommonSubstringsFromMultipleStrings.apply(null, potential_across_theme_entries);
        for (i_substr = 0; i_substr < longest_common_substrings_across.length; ++i_substr) {
            var longest_common_substring_across = longest_common_substrings_across[i_substr];
            document.getElementById(render_to_theme).innerHTML += "<br />\nlongest common substring: " + (longest_common_substring_across.length > 0 ? longest_common_substring_across : '&lt;none&gt;') + '<br />\n';
            for (var i = 0; i < potential_across_theme_entries.length; ++i) {
                document.getElementById(render_to_theme).innerHTML += markSubstring(potential_across_theme_entries[i], longest_common_substring_across) + '<br />\n';
            }
        }
    }

    document.getElementById(render_to_theme).innerHTML += '<br /><br /><br />\n\n\n(down entries of length > ' + min_theme_len  + ')<br />\n\n';
    var potential_down_theme_entries = getStringsOfAtLeastMinLength(puzdata.down_entries, min_theme_len);
    if (potential_down_theme_entries.length == 0) {
        document.getElementById(render_to_theme).innerHTML += '&lt;none&gt;' + '<br />\n';
    } else {
        longest_common_substrings_down = longestCommonSubstringsFromMultipleStrings.apply(null, potential_down_theme_entries);
        for (i_substr = 0; i_substr < longest_common_substrings_down.length; ++i_substr) {
            var longest_common_substring_down = longest_common_substrings_down[i_substr];
            document.getElementById(render_to_theme).innerHTML += "<br />\nlongest common substring: " + (longest_common_substring_down.length > 0 ? longest_common_substring_down : '&lt;none&gt;') + '<br />\n';
            for (var i = 0; i < potential_down_theme_entries.length; ++i) {
                document.getElementById(render_to_theme).innerHTML += markSubstring(potential_down_theme_entries[i], longest_common_substring_down) + '<br />\n';
            }
        }
    }
}

// returns a version of {string} with {substring} marked (by <mark></mark> tag)
// TODO: only highlights first instance of substring (per string)--do something else?
function markSubstring(string, substring)
{
    var retval = "";

    var substring_start_index = string.indexOf(substring);
    retval += string.substring(0, substring_start_index);
    retval += '<mark>' + substring + '</mark>';
    retval += string.substring(substring_start_index + substring.length, string.length);

    return retval;
}

// returns all strings from {strings} of length at least {min_len}
function getStringsOfAtLeastMinLength(strings, min_len)
{
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
function longestCommonSubstringsFromMultipleStrings()
{
    if (arguments.length === 0) {
        return ""; // TODO: do something else (e.g., throw an exception)?
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
