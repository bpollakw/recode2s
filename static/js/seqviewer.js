function seqviewer(sequence, element) {
		// var Sequence = require("sequence-viewer");
		seqViewer = new Sequence(sequence);
		
		seqViewer.render(element, {
			'charsPerLine': 100,
			'search': true,
			'sequenceMaxHeight': "385px",
			'title': "Gene"
		});
			  
		var legend = [
			{name: "Promoter", color: "#FFFF00", underscore: false},
			{name: "Gene", color: "#00E100", underscore: false},
			{name: "mRNA", color: "#FF0000", underscore: false},
			{name: "ORF",color: "#0096FF",underscore: false}
		];

		seqViewer.addLegend(legend);		
	}

function highlight_seq(element, color){

	var sequenceCoverage = [];
	// WARNING removed local variable definition! - RECODE
	subSeq = "";
	strand = element.strand
	type = element.type
	
	var elStart, elEnd;
	var pos, end;

	for (var i = 0; i < element.subFeatures.length; i++){
		if (element.strand == '+'){
			pos = element.position;
			elStart = pos+element.subFeatures[i].position-1;
			elEnd = pos+element.subFeatures[i].position+element.subFeatures[i].length;
		}
		else{
			end = element.position + element.length;
			elStart = end-(element.subFeatures[i].position+element.subFeatures[i].length)-1;
			elEnd = end-element.subFeatures[i].position;
		}

		if (color == "yellow"){
			sequenceCoverage.push({
			start:		elStart,
			end:		elEnd,
			bgcolor:	color,
			color:		"black",
			underscore:	false   
			});
		}
		else{
			sequenceCoverage.push({
			start:		elStart,
			end:		elEnd,
			bgcolor:	color,
			color:		"white",
			underscore:	false 
			});
		}

		subSeq = subSeq + seq.substring(elStart, elEnd);
	}

	seqViewer.coverage(sequenceCoverage);

	var button = document.getElementById('clipboard_btn');
	button.setAttribute('data-clipboard-text', subSeq)
}

// Functions for RECODE page

function go_recode(cdsName){
	link = "/recode?"+"seq="+subSeq+"&strand="+strand+"&type="+type+"&cdsName="+cdsName
	location.href=link;
}

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

function recode(seq, newseq, type){	
				if (type == 'cds' && seq.substring(0,3) == "ATG"){
					if (typeof changed !== 'undefined'){

					}
					else if(typeof changed == 'undefined'){
						front = "GGTCTCAA";
						back = "GCTTCGAGACC";
					}
				}
				else if (type == 'cds' && seq.substring(0,3) != "ATG"){
					alert("CDS does not start with ATG. Check sequence!")
				}
				else if (type == 'promoter'){
						front = "GGTCTCAGGAG"
						back = "TACTCGAGACC"
				}
				else{
					alert("Recode is for promoters and cdss")
				}
				newseq = front+newseq+back
				recodedseq = newseq
				recoder(newseq, '#seqView', 'Recoded');
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
function export_GB(cdsName, seqtype){
	link = "/export/recode?"+"seq="+recodedseq+"&type="+seqtype+"&cdsName="+cdsName
	location.href=link;
}