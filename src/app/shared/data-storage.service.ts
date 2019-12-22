import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipe/recipe.service";
import { Recipe } from "../recipe/recipe.model";
import { map } from "rxjs/operators";

@Injectable()
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService) {
    }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://ng-recipe-book-84a51.firebaseio.com/recipes.json', recipes)
            .subscribe(response => {
                console.log(response)
            });
    }

    fetchRecipes() {
        // mentioning that the get type would be recipe array
        this.http.get<Recipe[]>('https://ng-recipe-book-84a51.firebaseio.com/recipes.json')
            .pipe(map(recipes => { // map allows us to transform the data by adding the pipe
                return recipes.map(recipe => {
                    // checking if the recipe has ingredient
                    // if not adding empty array instead of undefined using spread operator
                    return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
                })
            }))
            .subscribe(recipes => {
                this.recipeService.setRecipes(recipes)
            })
    }
}