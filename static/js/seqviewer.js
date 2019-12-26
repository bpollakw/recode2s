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

function recode(name, seq, newseq){	
// This whole function should be cleared but can't figure out how I made it work. All sub-options are depreciated.
	REseqF = "AAGCTCTTCATCC";
	REseqR = "CGAAGAAGAGCAA";
	REbp = 13;

	if (type == "CDS" && seq.substring(0,3) == "ATG"){
		
				front = REseqF+"A";
				back = "GCAGGT"+REseqR;
				add=1+REbp;
				if (newseq.endsWith("TAG") || newseq.endsWith("TGA") || newseq.endsWith("TAA")){
					newseq = newseq.substring(0, newseq.length-3)
				}
	}
	else if (type == "CDS" || type == "CTAG" && seq.substring(0,3) != "ATG"){
		alert("CDS does not start with ATG. Check sequence!")
	}
	else if (type == 'promoter' && typeof changed == 'undefined'){
			front = REseqF+"GGAG"
			back = "AATG"+REseqR;
			add=4+REbp;
	}
	else if (type == 'promoter' && typeof changed != 'undefined'){
			front = REseqF+"GGAG";
			back = "TACT"+REseqR;;
			add=4+REbp;
	}
	else if (type == 'terminator' && typeof changed == 'undefined'){
			front = REseqF+"GCTT"
			back = "CGCT"+REseqR;
			add=4+REbp;
	}
	else if (type == 'terminator' && typeof changed != 'undefined'){
			front = REseqF+"GGTA";
			back = "CGCT"+REseqR;
			add=4+REbp;
	}
	else if (type == 'gene'){
			front = REseqF+"GGAG"
			back = "CGCT"+REseqR;
			add=4+REbp;
	}
	else if (type == 'CTAG'){
			front = REseqF+"AGGT";
			back = "GCTT"+REseqR;
			add=4+REbp;
	}
	else{
		console.log(type)
		alert("Recode is for promoters, CDSs and terminators")
	}
	newseq = front+newseq+back
	recodedseq = newseq
	recoder(newseq, '#seqView', name+" - Recoded");
	delete sequenceCoverage;
	delete legend;
	var highlight = [2,newseq.length-9]
	var overhangs = [13,newseq.length-17]
	var Sapioverhangs = [10,newseq.length-13]
	sites(Sapioverhangs,3,"brown");
	sites(highlight,7,"blue");
	sites(overhangs,4,"red");
	// WTF?
	for (var i = 0; i < BsaI.length; i++){
		sites([BsaI[i]+add],6,"green");
	}
	for (var i = 0; i < SapI.length; i++){
		sites([SapI[i]+add],7,"green");
	}

	legende("SapI","blue");
	legende("Old sites","green");
	legende("SapI overhangs","brown");
	legende("Syntax overhangs","red");
	add_legend();
	highlight_sites();
	document.getElementById("message").innerHTML = "BsaI & SapI sites recoded, SapI flanking sequences and overhangs for cloning into pL0R-lacZ added. L0 part specific syntax overhangs included";

	var button = document.getElementById('clipboard_btn');
	button.setAttribute('data-clipboard-text', recodedseq)
	
	document.getElementById('clipboard_btn').style.display = 'block'
	document.getElementById('download_gb_btn').style.display = 'block'
}

//Don't think it does anything but I don't think it will work without this...
function change_overhangs(i) {
	changed = i
	if (changed == "N" || changed == "P" || changed == "C" || changed == "CF" || changed == "T"){
		changed = changed
	}
	else{ 
		delete changed;
   	}	  
  }
function export_GB(name){
	console.log(add);
	link = "/export?"+"seq="+recodedseq+"&type="+type+"&name="+name+"&add="+add
	location.href=link;
}