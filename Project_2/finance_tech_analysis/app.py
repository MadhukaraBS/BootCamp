# import necessary libraries
from flask import (
    Flask,
    render_template,
    jsonify,
    request)

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///AAPL.sqlite"

db = SQLAlchemy(app)

class DailyStockData(db.Model):
    __tablename__ = 'StockPrices'

    id = db.Column(db.Integer, primary_key=True)
    Date = db.Column(db.String(64))
    Open = db.Column(db.Float)
    High = db.Column(db.Float)
    Low = db.Column(db.Float)
    Close = db.Column(db.Float)
    Volume = db.Column(db.Integer)

    def __repr__(self):
        return '<StockDate %r>' % (self.id)



@app.route("/")
def index():
    return render_template('index.html')


@app.route("/line")
def test():
    results = db.session.query(
            DailyStockData.Date,
            DailyStockData.Open,
            DailyStockData.High,
            DailyStockData.Low,
            DailyStockData.Close,
            DailyStockData.Volume,
            ).all()

    daily_data = []
    for result in results:
        daily_data.append({
            "Date": result[0],
            "Open": result[1],
            "High": result[2],
            "Low": result[3],
            "Close": result[4],
            "Volume": result[5],
        })
    return jsonify(daily_data)

if __name__ == "__main__":
    app.run(debug=True)
