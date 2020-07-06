import React from 'react';
import ReactDOM from 'react-dom';

import Chart from 'chart.js';

import {elements} from './base'

export const changeTitle = name => {
    elements.companyTitle.textContent = name;
}

export const changeChart = data => {
    const ctx = ReactDOM.render(<canvas></canvas>, elements.companyChart);
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                data: data
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month'
                    }
                }],
                yAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return '$' + value;
                        }
                    }
                }]
            }
        }
    });
}

export const defaultChart = () => {
    const element = (
        <div>
          <h2 className="heading-2">Don't Stop Searching</h2>
          <h2>It is {new Date().toLocaleTimeString()}.</h2>
        </div>
    );
    ReactDOM.render(element, elements.companyChart);
}

export const changeIframe = url => {
    elements.companyInfo.src=url
}