import React, { Component } from 'react';
import d3 from "d3";
import d3_shape from "d3-shape";

class PieChart extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        const { colors } = this.props;
        var pie  = d3_shape.pie()
            .sort(null)
            .value(function(d) { return d.population; });
        return(
            <div>
                <h3>stuff goes here</h3>
                <svg>
                    <g ref="graph"></g>
                </svg>
            </div>
        );
    }

}

export default PieChart;
