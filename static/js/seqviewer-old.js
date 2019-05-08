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
	if (type == "CDS" && seq.substring(0,3) == "ATG"){
		/*if (typeof changed !== 'undefined'){
			if(changed == 'CF'){ */
				front = "GGTCTCAA";
				back = "GCAGGTTGAGACC";
				add=8;
				if (newseq.endsWith("TAG") || newseq.endsWith("TGA") || newseq.endsWith("TAA")){
					newseq = newseq.substring(0, newseq.length-3)
				}
			/*}
			else if(changed == 'C'){
				front = "GGTCTCATTCG";
				back = "GCTTTGAGACC";
				add=11;
			}
			else if(changed == 'N'){ 
				front = "GGTCTCACC";
				back = "GCAATGTGAGACC";
				add=9;
				if (newseq.endsWith("TAG") || newseq.endsWith("TGA") || newseq.endsWith("TAA")){
					newseq = newseq.substring(0, newseq.length-3)
				}
			
		}
		else if(typeof changed == 'undefined'){
			front = "GGTCTCAA";
			back = "GCAGGTTGAGACC";
			add=8;
		}}*/
		
	}
	else if (type == "CDS" || type == "CTAG" && seq.substring(0,3) != "ATG"){
		alert("CDS does not start with ATG. Check sequence!")
	}
	else if (type == 'promoter' && typeof changed == 'undefined'){
			front = "GGTCTCAGGAG"
			back = "AATGCGAGACC"
			add=11;
	}
	else if (type == 'promoter' && typeof changed != 'undefined'){
			front = "GGTCTCAGGAG";
			back = "TACTTGAGACC";
			add=11;
	}
	else if (type == 'terminator' && typeof changed == 'undefined'){
			front = "GGTCTCAGCTT"
			back = "CGCTTGAGACC"
			add=11;
	}
	else if (type == 'terminator' && typeof changed != 'undefined'){
			front = "GGTCTCAGGTA";
			back = "CGCTTGAGACC";
			add=11;
	}
	else if (type == 'gene'){
			front = "GGTCTCAGGAG"
			back = "CGCTTGAGACC"
			add=11;
	}
	else if (type == 'CTAG'){
			front = "GGTCTCAAGGT"
			back = "GCTTTGAGACC"
			add=11;
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
	var highlight = [0,newseq.length-6]
	var overhangs = [7,newseq.length-11]
	sites(highlight,6,"blue");
	sites(overhangs,4,"red");
	// WTF?
	for (var i = 0; i < BsaI.length; i++){
		sites([BsaI[i]+add],6,"green");
	}
	for (var i = 0; i < SapI.length; i++){
		sites([SapI[i]+add],7,"green");
	}

	legende("BsaI","blue");
	legende("Old sites","green");
	legende("Overhangs","red");
	add_legend();
	highlight_sites();
	document.getElementById("message").innerHTML = "BsaI & SapI sites recoded, BsaI flanking sequences and overhangs added.";

	var button = document.getElementById('clipboard_btn');
	button.setAttribute('data-clipboard-text', recodedseq)
	
	document.getElementById('clipboard_btn').style.display = 'block'
	document.getElementById('download_gb_btn').style.display = 'block'
	

}

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
	link = "/export-old?"+"seq="+recodedseq+"&type="+type+"&name="+name+"&add="+add
	location.href=link;
}