import React, { Component } from 'react';
import {PieChart } from 'react-d3-basic';

class RecipePieChart extends  Component{
    render(){
        const data = [
            {name: "Carbohydrates", field: this.props.carbohydrates},
            {name: "Fats", field: this.props.fats},
            {name: "Protein", field: this.props.protein},
        ];
        const chartSeries = [
            {
                field:"Carbohydrates",
                name: "Carbohydrates"
            },
            {
                field:"Fats",
                name: "Fats"
            },
            {
                field:"Protein",
                name: "Protein"
            }
        ];

        const name = function(d){
            return d.name;
        };
        const value = function(d){
            return +d.field;
        };
        return(
            <div>
                <PieChart
                    width={500}
                    height={200}
                    showLegend={false}
                    data={data}
                    chartSeries={chartSeries}
                    value={value}
                    name={name}
                />
            </div>
        );
    }
}

export default RecipePieChart;
