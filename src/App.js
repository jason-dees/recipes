import React, { Component } from 'react';
import './App.css';
import GoogleSheet from './GoogleSheet.js';
import Linq from './linq.js';
import Modal from 'react-bootstrap/lib/Modal';
import Table from 'react-bootstrap/lib/Table';
import Panel from 'react-bootstrap/lib/Panel';

const fatCalories = 8;
const proteinCalories = 4;
const carbCalories = 4;

const dbsrc = "1IeVSP4r8bQ2lAtgY8HnPGSk-chEYmml0Cc42s8ewRqc";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: [],
        };
    }

    render() {
        return (
            <div className="App">
                <RecipeCategoryTable masterSheet={dbsrc} />
            </div>
        );
    }
}

class RecipeCategoryTable extends Component {
    constructor(props) {
        super(props);
        let masterSheet = new GoogleSheet(props.masterSheet, 2);

        this.state = {
            categoryList: []
        };

        masterSheet.getSheet(() => {
            let bigList = Linq(masterSheet.results);
            let categories = bigList.GroupBy((c) => c.category);
            this.setState({categoryList: categories});
        });
    }

    render(){
        return(
            <div id="recipe-list">
                {this.state.categoryList.map((category) =>
                    <RecipeCategory categoryName={category[0].category} key={category[0].category}
                                    recipeList={category} />
                )}
            </div>
        );
    }
}

class RecipeCategory extends Component {
    constructor(props){
        super(props);

        this.state = {
            recipes: props.recipeList.GroupBy((c) => c.key),
            name: props.categoryName
        };
    }
    render(){
        return(
            <Panel header={this.state.name} collapsible defaultExpanded>
                <div>
                    Directions!
                </div>
                <Table responsive hover fill>
                    <tbody>
                        <tr>
                            <th>Recipe</th>
                            <th>Calories</th>
                            <th>Carbohydrates</th>
                            <th>Fats</th>
                            <th>Protein</th>
                        </tr>
                        {this.state.recipes.map((recipe) =>
                            <Recipe ingredients={recipe} key={recipe[0].key} name={recipe[0].key} />
                        )}
                    </tbody>
                </Table>
            </Panel>
        );
    }
}

class Recipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:  props.name,
            ingredients: props.ingredients,
            calories: props.ingredients.Sum(this.calculateCalories),
            carbohydrates: props.ingredients.Select((i) => i.carbohydrates).Sum(),
            fats: props.ingredients.Select((i) => i.fats).Sum(),
            protein: props.ingredients.Select((i) => i.protein).Sum(),
            show: false,
        };
        this.switchModalVisibility = this.switchModalVisibility.bind(this);
    }

    calculateCalories(ingredient){
        let calories = ingredient.carbohydrates * carbCalories;
        calories += ingredient.fats * fatCalories;
        calories += ingredient.protein * proteinCalories;
        return calories;
    }

    switchModalVisibility(){
        var current = this.state.show;
        this.setState({show: !current});
    }

    render(){
        return (
            <tr className="recipe-overview" onClick={this.switchModalVisibility}>
                <td>
                    {this.state.name}
                    <Modal show={this.state.show} onHide={this.switchModalVisibility}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.state.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <RecipeOverview ingredients={this.state.ingredients} />
                        </Modal.Body>
                    </Modal>
                </td>
                <td>{this.state.calories}</td>
                <td>{this.state.carbohydrates}</td>
                <td>{this.state.fats}</td>
                <td>{this.state.protein}</td>
            </tr>
        );
    }
}

class RecipeOverview extends Component {
    constructor(props){
        super(props);

        this.state = {
            ingredients: props.ingredients,
            name: props.name,
        }
    }

    render(){
        return(
            <Table condensed>
                <thead>
                    <tr>
                        <th>Ingredient</th>
                        <th>Serving Size (g)</th>
                        <th>Carbohydrate</th>
                        <th>Fat</th>
                        <th>Protein</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.ingredients.map((ingredient) =>
                        <Ingredient ingredient={ingredient}
                            key={ingredient.ingredient} />)}
                </tbody>
            </Table>
        );
    }
}

class Ingredient extends Component{
    //Serving size in grams, carbohydrate, fat, protein, name, index (?)
    constructor(props){
        super(props);
        this.state = props.ingredient;
    }
    render() {
        return (
            <tr>
                <td>{this.state.ingredient}</td>
                <td>{this.state.amount}</td>
                <td>{this.state.carbohydrates}</td>
                <td>{this.state.fats}</td>
                <td>{this.state.protein}</td>
            </tr>
        );
    }
}

export default App;