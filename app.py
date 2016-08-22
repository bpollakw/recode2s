from flask import Flask, redirect, url_for, escape, request, render_template, make_response, flash, abort

from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from Bio.SeqFeature import SeqFeature, FeatureLocation, CompoundLocation
from Bio.Alphabet import IUPAC



app = Flask(__name__)

def page_not_found(e):
    return render_template('404.html', title='404'), 404

@app.errorhandler(500)
def internal_error(e):
	return render_template('500.html', title='500'), 500

@app.route("/")
def index():
	return render_template("home.html")




if __name__ == "__main__":
  app.run(host="0.0.0.0", port=5000)