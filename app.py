from waitress import serve
import os
import re
import itertools
import collections
from flask import Flask, session, redirect, url_for, escape, request, render_template, make_response, flash, abort

from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from Bio.SeqFeature import SeqFeature, FeatureLocation, CompoundLocation
from Bio.Alphabet import IUPAC

app = Flask(__name__, static_url_path="", static_folder="static")
app.secret_key = 'HJKDGSA&^D%HJKN.zczxcoasdk2194uru'


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', title='404'), 404

@app.errorhandler(500)
def internal_error(e):
	return render_template('500.html', title='500'), 500

# Helper function for recursive search of restriction sites
			
def recfind(pattern, string, where_should_I_start=0):
    # Save the result in a variable to avoid doing the same thing twice
    pos = string.find(pattern, where_should_I_start)
    if pos == -1:
        # Not found!
        return []
    # No need for an else statement
    return [pos] + recfind(pattern, string, pos + len(pattern))

def check(seq, sites):
	found = 0
	for site in sites:
		a = seq.find(site, 0, len(seq))
		if a != -1:
			found = found + 1
	return found
	
	
@app.route('/')
def index():
				
	return render_template('home.html')

@app.route('/recode', methods=['POST'])
def recode():
	
	if request.method == 'POST':
		seq = request.form["seq"]
		seq = seq.upper()
		seq = re.sub('\s+','',seq).strip()
		seq = re.sub('[0-9]','',seq)
		
		name = request.form["name"]
	
	BsaI_F = "GGTCTC"
	BsaI_F_replace = ["GGaCTC","GGTCcC","GGTaTC"]
	BsaI_R = "GAGACC"
	BsaI_R_replace = ["GAaACC","GAGAtC" ,"GAGgCC"]
	SapI_F = "GCTCTTC"
	SapI_F_replace = ["GCcCTTC","GCTCgTC","GCTgTTC"]
	SapI_R = "GAAGAGC"
	SapI_R_replace = ["GAgGAGC","GAAGgGC","GAAaAGC"]
	
	sites = ["GGTCTC","GAGACC","GCTCTTC","GAAGAGC"]
	
#		ATGGGTCTCAGGTCTCAAGGTCTCAAAGGTCTCGGTCTCGGTCTCGAGACCAAGAGACCAAAGAGACCGAGACCAGAGACCGAGACCGCTCTTCAGCTCTTCAAGCTCTTCAAAGCTCTTCGAAGAGCAGAAGAGCAAGAAGAGCAAAGAAGAGCGAAGAGC
	
	BsaI_sitesF = []
	BsaI_sitesR = []
	SapI_sitesF = []
	SapI_sitesR = []
	
	BsaI_sitesF = BsaI_sitesF + recfind(BsaI_F, seq)
	BsaI_sitesR = BsaI_sitesR + recfind(BsaI_R, seq)
	SapI_sitesF = SapI_sitesF + recfind(SapI_F, seq)
	SapI_sitesR = SapI_sitesR + recfind(SapI_R, seq)
#	for search in SapI:
#		SapI_sites = SapI_sites + recfind(search, seq)
	orgseq = seq
	for site in BsaI_sitesF:
		for i in range(3):
			if (site % 3 == i):
				seq = seq[:site] + BsaI_F_replace[i] + seq[site + 6:]
	
	for site in BsaI_sitesR:
		for i in range(3):
			if (site % 3 == i):
				seq = seq[:site] + BsaI_R_replace[i] + seq[site + 6:]
	
	for site in SapI_sitesF:
		for i in range(3):
			if (site % 3 == i):
				seq = seq[:site] + SapI_F_replace[i] + seq[site + 7:]
				
	for site in SapI_sitesR:
		for i in range(3):
			if (site % 3 == i):
				seq = seq[:site] + SapI_R_replace[i] + seq[site + 7:]
					
	BsaI_sites = BsaI_sitesF+BsaI_sitesR
	SapI_sites = SapI_sitesF+SapI_sitesR
	session["BsaI"] = BsaI_sites
	session["SapI"] = SapI_sites
	
	verify = check(seq,sites)
	if verify == 0:
		return render_template('recode.html', seq=orgseq, newseq=seq, name=name,BsaI=BsaI_sites, SapI=SapI_sites)
	elif verify != 0:
		return url_for('singularity')
		
@app.route('/singularity')
def singularity():
	return render_template('singularity.html')
	
		
@app.route('/export')
def export():
	name = request.args.get('name','')
	seq = request.args.get('seq','')
	seq_type = request.args.get('type','')
	add = request.args.get('add','')
	BsaI = session.get("BsaI", None)
	SapI = session.get("SapI", None)
	add = int(add)
	if not name:
		return ('', 204)

	record = SeqRecord( Seq( seq, IUPAC.unambiguous_dna ), name = name, description = name+"recoded to type IIs part", id=name)
	
	strand = 1;
	location = FeatureLocation(11, len(seq)-11, strand = strand);
	record.features.append( SeqFeature( location = location, strand = strand, type=seq_type, id=name, qualifiers={"label": name} ))
	
	location = FeatureLocation(0, 6, strand = strand);
	record.features.append( SeqFeature( location = location, strand = strand, type="BsaI_F", id="BsaI"))
	
	location = FeatureLocation(7, 11, strand = strand);
	record.features.append( SeqFeature( location = location, strand = strand, type="misc_feature", id="Overhang", qualifiers={"label": "Overhang"} ))

		
	for site in BsaI:
		location = FeatureLocation(site+add, site+add+6, strand = strand);
		record.features.append( SeqFeature( location = location, strand = strand, type="modified_base", id="BsaI_mut", qualifiers={"label": "BsaI_mut"} ))
	
	for site in SapI:
		location = FeatureLocation(site+add, site+add+7, strand = strand);
		record.features.append( SeqFeature( location = location, strand = strand, type="modified_base", id="SapI_mut", qualifiers={"label": "SapI_mut"} ))
		
	strand = -1;
	location = FeatureLocation(len(seq)-6, len(seq), strand = strand);
	record.features.append( SeqFeature( location = location, strand = strand, type="BsaI_R", id="BsaI" ))

	location = FeatureLocation(len(seq)-11, len(seq)-7, strand = strand);
	record.features.append( SeqFeature( location = location, strand = strand, type="misc_feature", id="Overhang", qualifiers={"label": "Overhang"} ))
	
	response = make_response(record.format("gb"))
	response.headers["Content-Type"] = "application/octet-stream"
	response.headers["Content-Disposition"] = "attachement; filename={0}".format(name+'.gb')
	return response


if __name__ == "__main__":
 	port = int(os.environ.get('PORT', 5000))	
	serve(app, host="0.0.0.0", port=port)
