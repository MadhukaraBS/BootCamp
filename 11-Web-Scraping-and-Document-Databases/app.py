from flask import Flask, render_template, redirect
import pymongo
import scrape_mars_data

app = Flask(__name__)

client = pymongo.MongoClient("mongodb://localhost:27017")
db = client.mars_db
collection = db.mars_data_coll

@app.route("/")
def index():
    mars_dict = collection.find_one()
    return render_template("index.html", mars_dict=mars_dict)


@app.route("/scrape")
def scraper():
    collection.drop()
    collection.insert_one(scrape_mars_data.scrape())
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)

