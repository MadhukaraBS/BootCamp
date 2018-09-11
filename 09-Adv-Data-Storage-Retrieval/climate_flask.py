import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

import datetime as dt
from datetime import timedelta as td
from sqlalchemy import and_

#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///Resources/hawaii.sqlite", connect_args={'check_same_thread': False})

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/<start><br/>"
        f"/api/v1.0/<start>/<end><br/>"
    )


#  /api/v1.0/precipitation
#  Query for the dates and temperature observations from
#  the last year.
#  Convert the query results to a Dictionary using date as
#  the key and tobs as the value.
#  Return the JSON representation of your dictionary.
@app.route("/api/v1.0/precipitation")
def precipitation():
    """Return a list of precipitation date from the last year observations"""
    # Design a query to retrieve the last 12 months of precipitation data and plot the results
    last_entry = session.query(Measurement).order_by(Measurement.date.desc())

    # Calculate the date 1 year ago from today
    last_entry_year = last_entry.first().__dict__['date']
    prev_year = (dt.datetime.strptime(last_entry_year, "%Y-%m-%d") -td(365)).strftime("%Y-%m-%d")

    # Perform a query to retrieve the data and precipitation scores
    prec_data = session.query(Measurement.date, Measurement.prcp).filter(
        and_(Measurement.date >= prev_year, Measurement.prcp != None)).all()

    return jsonify( dict(prec_data))



#  /api/v1.0/stations
#  Return a JSON list of stations from the dataset
@app.route("/api/v1.0/stations")
def stations():
    """Return a list of stations"""
    total_stations = session.query(Station).count()
    stations = session.query(Station)
    return jsonify([st.name for st in stations])


#  /api/v1.0/tobs
#  Return a JSON list of Temperature Observations (tobs) for the previous year.
@app.route("/api/v1.0/tobs")
def tobs():
    last_entry = session.query(Measurement).order_by(Measurement.date.desc())
    last_entry_year = last_entry.first().__dict__['date']
    prev_year = (dt.datetime.strptime(last_entry_year, "%Y-%m-%d") -td(365)).strftime("%Y-%m-%d")
    temperature_data = session.query(Measurement.date, Measurement.tobs).\
            filter(Measurement.date >= prev_year).all()

    return jsonify(dict(temperature_data))



# Write a function called `calc_temps` that will accept start date and end date in the format '%Y-%m-%d' 
# and return the minimum, average, and maximum temperatures for that range of dates
def calc_temps(start_date, end_date):
    """TMIN, TAVG, and TMAX for a list of dates.

    Args:
    start_date (string): A date string in the format %Y-%m-%d
    end_date (string): A date string in the format %Y-%m-%d

    Returns:
    TMIN, TAVE, and TMAX
    """
    return session.query(func.min(Measurement.tobs), \
                         func.avg(Measurement.tobs), \
                         func.max(Measurement.tobs)).\
                         filter(Measurement.date >= start_date).\
                         filter(Measurement.date <= end_date).all()

# Write a function called `calc_all_temps` that will accept start date and end date in the format '%Y-%m-%d' 
# and return the minimum, average, and maximum temperatures for that range of dates
def calc_all_temps(start_date):
    """TMIN, TAVG, and TMAX for a list of dates.

    Args:
    start_date (string): A date string in the format %Y-%m-%d

    Returns:
    TMIN, TAVE, and TMAX
    """
    return session.query(func.min(Measurement.tobs), \
                         func.avg(Measurement.tobs), \
                         func.max(Measurement.tobs)).\
                         filter(Measurement.date >= start_date).all()


#  /api/v1.0/<start> and /api/v1.0/<start>/<end>
#  Return a JSON list of the minimum temperature, the average
#  temperature, and the max temperature for a
#  given start or start-end range.
#  When given the start only, calculate TMIN , TAVG , and TMAX
#  for all dates greater than and equal to the start
#  date.
#  When given the start and the end date, calculate the TMIN,
#  TAVG , and TMAX for dates between the start
#  and end date inclusive.
@app.route("/api/v1.0/<start>")
def start_date(start):
    print(start)
    tobs_stat = calc_all_temps(start)
    print(start)
    print(tobs_stat)
    tmin, tavg, tmax = tobs_stat[0] 
    tobs_dict = { 'Minimum temperature': tmin, 'Maximum temperature': tmax, 'Avg temperature': tavg}
    print(tobs_dict)
    return jsonify(tobs_dict)

@app.route("/api/v1.0/<start>/<end>")
def start_end_date(start, end):
    tobs_stat = calc_temps(start, end)
    print(start, end)
    print(tobs_stat)
    tmin, tavg, tmax = tobs_stat[0] 
    tobs_dict = { 'Minimum temperature': tmin, 'Maximum temperature': tmax, 'Avg temperature': tavg}
    print(tobs_dict)
    return jsonify(tobs_dict)


if __name__ == '__main__':
    app.run(debug=True)


