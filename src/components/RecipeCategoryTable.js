/**
 * Created by jasondees on 5/6/17.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Linq from '../linq.js';

import Modal from 'react-bootstrap/lib/Modal';
import Table from 'react-bootstrap/lib/Table';
import Panel from 'react-bootstrap/lib/Panel';
import { fetchCategories, fetchDirections } from '../actions/sheetsactions.js';
import RecipePieChart from "./RecipePieChart";

const fatCalories = 8;
const proteinCalories = 4;
const carbCalories = 4;

class RecipeCategoryTable extends Component {
    static propTypes = {
        categories: PropTypes.array.isRequired,
        directions: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number,
        dispatch: PropTypes.func.isRequired
    };
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchCategories("1IeVSP4r8bQ2lAtgY8HnPGSk-chEYmml0Cc42s8ewRqc"));
        dispatch(fetchDirections("1IeVSP4r8bQ2lAtgY8HnPGSk-chEYmml0Cc42s8ewRqc"));
    }

    render(){
        const { categories, directions } = this.props;
        return(
            <div className="main">
                {categories.map((category) => {
                    let categoryDirections = directions.Where(d => d[0].key === category[0].category)[0];
                    return <RecipeCategory categoryName={category[0].category} key={category[0].category}
                        recipeList={category} directions={categoryDirections}/>;
                    }
                )}
            </div>
        );
    }
}
const mapStateToProps = state => {
    const { categories, directions } = state;
    const {
        isFetching,
        lastUpdated,
    } =  {
        isFetching: true,
        categories: [],
        directions: []
    };

    return {
        categories,
        directions,
        isFetching,
        lastUpdated
    }
};

class RecipeCategory extends Component {
    constructor(props){
        super(props);
        var directions = props.directions || Linq([]);

        this.state = {
            recipes: props.recipeList.GroupBy((c) => c.key),
            name: props.categoryName,
            directions: directions.OrderBy(d => d.order)
        };
    }
    render(){
        const { directions, recipes } = this.state;
        return(
            <Panel header={this.state.name} collapsible defaultExpanded>
                <Panel collapsible header="Directions">
                <ol>
                    {directions.map((direction) =>
                        <li key={direction.key + direction.order}>{direction.text}</li>
                    )}
                </ol>
                </Panel>
                <Table responsive hover fill>
                    <tbody>
                    <tr>
                        <th>Recipe</th>
                        <th>Calories</th>
                        <th>Carbohydrates</th>
                        <th>Fats</th>
                        <th>Protein</th>
                    </tr>
                    {recipes.map((recipe) =>
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
            ingredients: Linq(props.ingredients),
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
        let current = this.state.show;
        this.setState({show: !current});
    }

    render(){
        return (
            <tr className="recipe-overview" onClick={this.switchModalVisibility}>
                <td>
                    {this.state.name}
                    <RecipeModalOverView
                        show={this.state.show}
                        onHide={this.switchModalVisibility}
                        recipe={this.state}
                    />
                </td>
                <td>{this.state.calories}</td>
                <td>{this.state.carbohydrates}</td>
                <td>{this.state.fats}</td>
                <td>{this.state.protein}</td>
            </tr>
        );
    }
}

Recipe.propTypes = {
    name: PropTypes.string.isRequired,
    ingredients: PropTypes.array.isRequired
};

class RecipeModalOverView extends Component{
    render(){
        const { show, onHide, recipe }  = this.props;
        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{recipe.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RecipeTableOverview ingredients={recipe.ingredients} />
                    <RecipePieChart
                        protein={recipe.protein * 4}
                        fats={recipe.fats * 8}
                        carbohydrates={recipe.carbohydrates * 4} />
                </Modal.Body>
            </Modal>
        );
    }
}

class RecipeTableOverview extends Component {

    calculateCalories(ingredient){
        let calories = ingredient.carbohydrates * carbCalories;
        calories += ingredient.fats * fatCalories;
        calories += ingredient.protein * proteinCalories;
        return calories;
    }

    render(){
        const { ingredients} = this.props;
        let totalCalories = ingredients.Sum(this.calculateCalories);
        return(
            <Table condensed>
                <thead>
                    <tr>
                        <th>Ingredient</th>
                        <th>Amount (g)</th>
                        <th>Carbohydrate (g)</th>
                        <th>Fat (g)</th>
                        <th>Protein (g)</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Totals</th>
                        <th>{totalCalories}</th>
                        <th>{ingredients.Select((i) => i.carbohydrates).Sum()}</th>
                        <th>{ingredients.Select((i) => i.fats).Sum()}</th>
                        <th>{ingredients.Select((i) => i.protein).Sum()}</th>
                    </tr>
                </tfoot>
                <tbody>
                {ingredients.map((ingredient) =>
                    <Ingredient
                        ingredient={ingredient}
                        key={ingredient.ingredient} />)}
                </tbody>
            </Table>
        );
    }
}

class Ingredient extends Component{
    render() {
        const {ingredient} = this.props;
        return (
            <tr>
                <td>{ingredient.ingredient}</td>
                <td>{ingredient.amount}</td>
                <td>{ingredient.carbohydrates}</td>
                <td>{ingredient.fats}</td>
                <td>{ingredient.protein}</td>
            </tr>
        );
    }
}

export default connect(mapStateToProps)(RecipeCategoryTable)
