import React, {useContext, useState} from "react";
import RecipesDataService from "../services/recipes";
import {Link, useLocation, useParams} from "react-router-dom";
import { Navigate } from "react-router-dom";
import {RecipesContext} from "../store/recipes-context";

const AddReview = props => {

  const location = useLocation();
  let params = useParams();
  const recipeIdParam = params.id;
  const recipesContext = useContext(RecipesContext);


  let initialReviewState = ""

  let editing = false;

  if (location.state && location.state.currentReview) {
    editing = true;
    initialReviewState = location.state.currentReview.text
  }

  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    var data = {
      text: review,
      name: recipesContext.user.name,
      userId: recipesContext.user.id,
      recipeId: recipeIdParam
    };

    if (editing) {
      data.reviewId = location.state.currentReview._id;

      RecipesDataService.updateReview(data)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
        RecipesDataService.createReview(data)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });
    }

  };

  return (
    <div>
      {recipesContext.user ? (
      <div className="submit-form">
        {submitted ? (
          <div>
            <Navigate to={"/recipes/" + recipeIdParam} />
          </div>
        ) : (
          <div>
            <label htmlFor="description">{ editing ? "Edit" : "Create" } Review</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={review}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            <button onClick={saveReview} className="btn btn-success submit-btn">
              Submit
            </button>
          </div>
        )}
      </div>

      ) : (
      <div>
        Please log in.
      </div>
      )}

    </div>
  );
};

export default AddReview;
