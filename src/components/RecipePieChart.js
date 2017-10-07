import React, { Component } from 'react';
import {PieChart } from 'react-d3-basic';
import Linq from '../linq.js';

class RecipePieChart extends  Component{
    makeAPercent(n){
        var format = {
            "style" : "percent",
            "maximumFractionDigits": 1
        };

        return n.toLocaleString(undefined, format);
    }

    render(){
        const {carbohydrates, protein, fats} = this.props;
        const name = function(d){
            return d.name;
        };
        const value = function(d){
            return +d.field;
        };
        const data = [
            {name: "Carbohydrates", field: carbohydrates},
            {name: "Fats", field: fats},
            {name: "Protein", field: protein},
        ];

        let totalCalories = Linq(data).Sum(d => d.field);
        let carbPercent = this.makeAPercent(carbohydrates / totalCalories);
        let fatPercent = this.makeAPercent(fats / totalCalories);
        let proteinPercent = this.makeAPercent(protein / totalCalories);

        const chartSeries = [
            {
                field:"Carbohydrates",
                name: "Carbohydrates (" + carbPercent + ")"
            },
            {
                field:"Fats",
                name: "Fats (" + fatPercent + ")"
            },
            {
                field:"Protein",
                name: "Protein (" + proteinPercent + ")" 
            }
        ];

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
