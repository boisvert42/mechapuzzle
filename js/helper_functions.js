function render_all(puzdata)
{
    render_grid(puzdata);
    //render_theme(puzdata);
    //render_clues(puzdata);
    //render_entries(puzdata);
    
    // This is just to show the raw data for development purposes
    document.getElementById('rawdata_js').innerHTML = JSON.stringify(puzdata,null,' ');
}