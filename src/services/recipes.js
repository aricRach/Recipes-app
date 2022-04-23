import http from "../http-common";

class RecipesDataService {
  getAll(page = 0) {
    return http.get(`recipes?page=${page}`);
  }

  get(id) {
    return http.get(`/recipe?id=${id}`);
  }

  find(query, by = "name", page = 0) {
    return http.get(`recipes?${by}=${query}&page=${page}`);
  } 

  createReview(data) {
    return http.post("/review-new", data);
  }

  updateReview(data) {
    return http.put("/review-edit", data);
  }

  createRecipe(data) {
    return http.post("/recipe-new", data);
  }

  createUser(user) {
    return http.post("/user-new", user);
  } 

  loginUser(user) {
    return http.post("/user-login", user);
  } 
  
  updateRecipe(data) {
    return http.put("/recipe-edit", data);
  }

  updateFavorites(user) {
    return http.put("/user-edit", user);
  }

  deleteReview(id, userId) {
    id = id.$oid; // id as a string, because we pass it to the url 
    return http.delete(`/review-delete?id=${id}`, {data:{userId: userId}});
  }

  deleteRecipe(id, userId) {
    return http.delete(`/recipe-delete?id=${id}`, {data:{userId: userId}});
  }

  getCuisines(id) {
    return http.get(`/cuisines`);
  }

  findMyRecipes(query, by = "id", page = 0) {
    return http.get(`recipes?${by}=${query}&page=${page}`);
  } 

  findFavorites(id) { // to write
    return http.get(`/favorites?id=${id}`);
  } 

  getUser(id) {
    return http.get(`/user?id=${id}`);
  }

  loginUserOid(oid) {
    return http.get(`/user-login-oid?oid=${oid}`);
  }

  updateRating(data) {
    return http.put("/rating-edit", data);
  }
}

export default new RecipesDataService();