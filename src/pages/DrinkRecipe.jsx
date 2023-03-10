import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import { isFavorite, isRecipeInProgress,
  removeFavorite, request, saveFavorite } from '../services/services';
import shareIcon from '../images/shareIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';

import '../styles/pages/DrinkRecipe.css';

export const recipeDetailsEndpoint = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';
const recomendationDrinkRecipes = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

export default function DrinkRecipe({ match: { params: { id } } }) {
  const [recipe, setRecipe] = useState({});
  const [recomendation, setRecomendation] = useState({});
  const [startRecipe, setStartRecipe] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    request(recipeDetailsEndpoint + id).then((res) => {
      setRecipe(res.drinks[0]);
    });
    request(recomendationDrinkRecipes).then((res) => {
      const MAX_LENGTH = 6;
      setRecomendation((res.meals).slice(0, MAX_LENGTH));
    });
    if (!isRecipeInProgress('cocktails', id)) {
      setStartRecipe(true);
    }
    setFavorite(isFavorite(id, 'drink'));
  }, [id]);

  const getIngredients = () => {
    const ingredients = Object.keys(recipe)
      .filter((key) => key.includes('strIngredient'));
    if (ingredients) {
      return ingredients.map((key) => recipe[key])
        .filter((ing) => ing !== '' && ing !== null);
    }
    return [];
  };

  const getMeasures = () => {
    const measures = Object.keys(recipe)
      .filter((key) => key.includes('strMeasure'));
    if (measures) {
      return measures.map((key) => recipe[key])
        .filter((ing) => ing !== '' && ing !== null);
    }
    return [];
  };

  const copy = () => {
    clipboardCopy(window.location.href);
    setLinkCopied(true);
  };

  const handleFavoriteClick = () => {
    if (!isFavorite(recipe.idDrink, 'drink')) {
      saveFavorite({
        id: recipe.idDrink,
        type: 'drink',
        nationality: '',
        category: recipe.strCategory,
        alcoholicOrNot: recipe.strAlcoholic,
        name: recipe.strDrink,
        image: recipe.strDrinkThumb,
      });
      setFavorite(true);
      return;
    }
    removeFavorite(recipe.idDrink);
    setFavorite(false);
  };

  return (
    <div>
      <div>
        <img
          style={ { width: '400px' } } // remover se for estilzar com css
          data-testid="recipe-photo"
          src={ recipe.strDrinkThumb }
          alt="s"
        />
        {linkCopied && <p>Link copied!</p>}
        <h3 data-testid="recipe-title">{ recipe.strDrink }</h3>
        <button
          data-testid="share-btn"
          type="button"
          onClick={ copy }
        >
          <img src={ shareIcon } alt="Share" />

        </button>
        <button
          type="button"
          onClick={ handleFavoriteClick }
        >
          <img
            data-testid="favorite-btn"
            src={ favorite ? blackHeart : whiteHeart }
            alt="whiteHeart"
          />
        </button>
        <p data-testid="recipe-category">{ recipe.strAlcoholic }</p>
        <ul>
          {
            getIngredients().map((ingredient, index) => (
              <li
                key={ ingredient }
                data-testid={ `${index}-ingredient-name-and-measure` }
              >
                {`${ingredient} - ${getMeasures()[index]}`}
              </li>))
          }
        </ul>
        <br />
        <p data-testid="instructions">{recipe.strInstructions}</p>
        {recipe.strVideo ? (<iframe
          data-testid="video"
          title="tutorial"
          width="560"
          height="315"
          src={ recipe.strVideo?.replace('watch?v=', 'embed/') }
          frameBorder="0"
          allowFullScreen
        />) : ''}
      </div>
      <div>
        <h2>Recommended</h2>
        <div style={ { height: '300px', display: 'flex', overflowY: 'hidden' } }>
          {
            recomendation.length > 0 && (
              recomendation.map((meal, index) => (
                <div
                  key={ meal.idMeal }
                  data-testid={ `${index}-recomendation-card` }
                >
                  <img
                    style={ { width: '200px' } } // remover se for estilzar com css
                    src={ meal.strMealThumb }
                    alt={ meal.strMeal }
                  />
                  <p>{ meal.strCategory }</p>
                  <h3 data-testid={ `${index}-recomendation-title` }>{ meal.strMeal }</h3>
                </div>
              )))
          }

        </div>
      </div>
      <Link to={ `/drinks/${recipe.idDrink}/in-progress` }>
        <button
          type="button"
          data-testid="start-recipe-btn"
          className="start-recipe"
        >
          { startRecipe ? 'Start Recipe' : 'Continue Recipe' }
        </button>
      </Link>
    </div>
  );
}

DrinkRecipe.propTypes = {
  match: propTypes.objectOf(propTypes.any).isRequired,
};
