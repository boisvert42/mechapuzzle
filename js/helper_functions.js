function render_all() {
    render_metadata();
    render_grid();
    render_theme();
    render_clues();
    render_entries();

    // This is just to show the raw data for development purposes
    document.getElementById('rawdata_js').innerHTML = JSON.stringify(PUZAPP.puzdata, null, ' ');
}

function render_metadata() {
    var puzdata = PUZAPP.puzdata;
    document.getElementById('metadata').innerHTML = '';
    document.getElementById('metadata').innerHTML += puzdata.title + '<br />';
    document.getElementById('metadata').innerHTML += puzdata.author + '<br />';
    document.getElementById('metadata').innerHTML += puzdata.notes + '<br />';
}