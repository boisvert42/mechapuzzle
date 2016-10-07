function render_all(puzdata)
{
	render_metadata(puzdata);
    render_grid(puzdata);
    //render_theme(puzdata);
    //render_clues(puzdata);
    //render_entries(puzdata);
    
    // This is just to show the raw data for development purposes
    document.getElementById('rawdata_js').innerHTML = JSON.stringify(puzdata,null,' ');
}

function render_metadata(puzdata)
{
	document.getElementById('metadata').innerHTML = '';
	document.getElementById('metadata').innerHTML += puzdata.title + '<br />';
	document.getElementById('metadata').innerHTML += puzdata.author + '<br />';
	document.getElementById('metadata').innerHTML += puzdata.notes + '<br />';
}