function recoder(sequence, element, name) {
		seqViewer = new Sequence(sequence);
		
		seqViewer.render(element, {
			'charsPerLine': 100,
			'sequenceMaxHeight': "300px",
			'title': name
		});
}

function sites(sites, length, color){
	if (typeof sequenceCoverage !== 'undefined') {
	}
	else{
		sequenceCoverage = [];
	}
	if (sites.length > 0){
		for (var i = 0; i < sites.length; i++){

			sequenceCoverage.push({
			start:		sites[i],
			end:		sites[i]+length,
			bgcolor:	color,
			color:		"white",
			underscore:	false   
			});
		}
	}
	else{
			sequenceCoverage.push({
			start:		0,
			end:		0,
			bgcolor:	"white",
			color:		"black",
			underscore:	false   
			});
	}
}

function legende(name, color){
		if (typeof legend !== 'undefined') {
	}
	else{
		 legend = [];
	}	
	
		 legend.push({
			 name: name, color: color, underscore: false
		 });
}

function add_legend(){
	seqViewer.addLegend(legend);		
					 }

function highlight_sites(){
	seqViewer.coverage(sequenceCoverage);
}

function recode(name, seq, newseq, type){	
				if (type == 'cds' && seq.substring(0,3) == "ATG"){
					if (typeof changed !== 'undefined'){

					}
					else if(typeof changed == 'undefined'){
						front = "GGTCTCAA";
						back = "GCTTCGAGACC";
					}
				}
				else if (type == 'cds' && seq.substring(0,3) != "ATG"){
					alert("cds does not start with ATG. Check sequence!")
				}
				else if (type == 'Promoter'){
						front = "GGTCTCAGGAG"
						back = "TACTCGAGACC"
				}
				else if (type == 'Terminator'){
						front = "GGTCTCAGGAGNNNN"
						back = "TACTCGAGACCNNNN"
				}
				else{
					alert("Recode is for promoters, cdss and terminators")
				}
				newseq = front+newseq+back
				recodedseq = newseq
				recoder(newseq, '#seqView', name+" - Recoded");
				delete sequenceCoverage;
				delete legend;
				var highlight = [0,newseq.length-6]
				var overhangs = [7,newseq.length-11]
				sites(highlight,6,"blue");
				sites(overhangs,4,"red");
				legende("BsaI","blue");
				legende("Overhangs","red");
				add_legend();
				highlight_sites();
				document.getElementById("message").innerHTML = "BsaI & SapI sites recoded, BsaI flanking sequences and overhangs added.";
				
				var button = document.getElementById('clipboard_btn');
				button.setAttribute('data-clipboard-text', recodedseq)

					}
  function change_overhangs(i) {
    if (i == "N"){
		changed ="yes";
		front = "GGTCTCACC";
		back = "AATGCGAGACC";
	}
	else if (i == "C"){
		changed ="yes";
		front = "GGTCTCATTCG";
		back = "GCTTCGAGACC";
   	}
   	else{ 
		delete changed;
   	}	  
  }
function export_GB(name, seqtype){
	link = "/export?"+"seq="+recodedseq+"&type="+seqtype+"&name="+name
	location.href=link;
}