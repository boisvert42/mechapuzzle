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
    document.getElementById(render_to_theme).style.fontFamily = "monospace";

    document.getElementById(render_to_theme).innerHTML += '(across entries of length > ' + min_theme_len  + ')<br />\n\n';
    var potential_across_theme_entries = getStringsOfMinLength(puzdata.across_entries, min_theme_len);
    var longest_common_substring_across = longestCommonSubstringFromMultipleStrings.apply(null, potential_across_theme_entries);
    document.getElementById(render_to_theme).innerHTML += "longest common substring: " + (longest_common_substring_across.length > 0 ? longest_common_substring_across : '&lt;none&gt;') + '<br />\n';
    for (var i = 0; i < potential_across_theme_entries.length; ++i) {
        document.getElementById(render_to_theme).innerHTML += markSubstring(potential_across_theme_entries[i], longest_common_substring_across) + '<br />\n';
    }

    document.getElementById(render_to_theme).innerHTML += '<br />\n(down entries of length > ' + min_theme_len  + ')<br />\n\n';
    var potential_down_theme_entries = getStringsOfMinLength(puzdata.down_entries, min_theme_len);
    var longest_common_substring_down = longestCommonSubstringFromMultipleStrings.apply(null, potential_down_theme_entries);
    document.getElementById(render_to_theme).innerHTML += "longest common substring: " + (longest_common_substring_down.length > 0 ? longest_common_substring_down : '&lt;none&gt;') + '<br />\n';
    for (var i = 0; i < potential_down_theme_entries.length; ++i) {
        document.getElementById(render_to_theme).innerHTML += markSubstring(potential_down_theme_entries[i], longest_common_substring_down) + '<br />\n';
    }
}

// returns a version of {string} with {substring} marked (by <mark></mark> tag)
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
function getStringsOfMinLength(strings, min_len)
{
    var retval = [];

    for (var num in strings) {
        var entry = strings[num];
        if (entry.length >= min_len) {
            retval.push(entry);
        }
    }

    return retval;
}

// returns the longest substring common to {arguments}
function longestCommonSubstringFromMultipleStrings()
{
    if (arguments.length === 0) {
        return ""; // TODO: do something else (e.g., throw an exception)?
    }

    var retval = arguments[0];
    for (var i = 1; i < arguments.length; ++i) {
        retval = longestCommonSubstringFromTwoStrings(retval, arguments[i]);
    }

    return retval;
}

// returns the longest substring common to {str1} and {str2} (from https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Longest_common_substring#JavaScript)
function longestCommonSubstringFromTwoStrings(str1, str2) {
    if (!str1 || !str2) {
        return "";
    }

    var sequence = "",
        str1Length = str1.length,
        str2Length = str2.length,
        num = new Array(str1Length),
        maxlen = 0,
        lastSubsBegin = 0;

    for (var i = 0; i < str1Length; ++i) {
        var subArray = new Array(str2Length);
        for (var j = 0; j < str2Length; ++j) {
            subArray[j] = 0;
        }
        num[i] = subArray;
    }
    var thisSubsBegin = null;
    for (var i = 0; i < str1Length; ++i) {
        for (var j = 0; j < str2Length; ++j) {
            if (str1[i] !== str2[j]) {
                num[i][j] = 0;
            } else {
                if ((i === 0) || (j === 0)) {
                    num[i][j] = 1;
                } else {
                    num[i][j] = 1 + num[i - 1][j - 1];
                }

                if (num[i][j] > maxlen) {
                    maxlen = num[i][j];
                    thisSubsBegin = i - num[i][j] + 1;
                    if (lastSubsBegin === thisSubsBegin) {//if the current LCS is the same as the last time this block ran
                        sequence += str1[i];
                    } else { //this block resets the string builder if a different LCS is found
                        lastSubsBegin = thisSubsBegin;
                        sequence= ""; //clear it
                        sequence += str1.substr(lastSubsBegin, (i + 1) - lastSubsBegin);
                    }
                }
            }
        }
    }

    return sequence;
}
