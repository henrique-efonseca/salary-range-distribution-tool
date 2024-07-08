from flask import render_template, request, jsonify
import numpy as np
import scipy.stats as stats
from app import app

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def get_data():
    min_salary = float(request.args.get('min_salary', 35))
    max_salary = float(request.args.get('max_salary', 40))
    
    mean = (min_salary + max_salary) / 2
    std_dev = (max_salary - min_salary) / 4
    
    # Generate the salary range strictly within the min and max salary values
    salary_range = np.linspace(min_salary, max_salary, 1000)
    pdf = stats.norm.pdf(salary_range, mean, std_dev).tolist()
    
    # Calculate percentiles within the specified range
    percentiles = stats.norm.cdf(salary_range, mean, std_dev) * 100
    
    # Specific percentiles to display
    specific_percentiles = [50, 70, 75, 80, 85, 90, 95, 99]
    salary_percentiles = {p: np.clip(stats.norm.ppf(p/100, mean, std_dev), min_salary, max_salary) for p in specific_percentiles}

    seventy_fifth_percentile = mean + 0.675 * std_dev
    
    return jsonify({
        'salary_range': salary_range.tolist(),
        'pdf': pdf,
        'percentiles': percentiles.tolist(),
        'mean': mean,
        'seventy_fifth_percentile': seventy_fifth_percentile,
        'salary_percentiles': salary_percentiles
    })
