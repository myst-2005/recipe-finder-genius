import { Recipe } from "@/types/recipe";
import { supabase } from "@/integrations/supabase/client";

export async function searchRecipesByIngredients(ingredients: string, apiKey: string) {
  try {
    if (!apiKey) {
      throw new Error('Spoonacular API key is not configured');
    }

    const cleanedIngredients = ingredients
      .split(',')
      .map(i => i.trim())
      .filter(i => i)
      .join(',');

    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${cleanedIngredients}&apiKey=${apiKey}&number=9`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    const data = await response.json();

    // Transform Spoonacular data and calculate match percentage
    const recipes = data.map((item: any) => {
      const usedIngredientCount = item.usedIngredients.length;
      const missedIngredientCount = item.missedIngredients.length;
      const totalIngredients = usedIngredientCount + missedIngredientCount;
      const matchPercentage = Math.round((usedIngredientCount / totalIngredients) * 100);

      return {
        id: item.id.toString(),
        name: item.title,
        image: item.image,
        cuisine: "Various",
        difficulty: "medium" as const,
        duration: 30,
        ingredients: [
          ...item.usedIngredients.map((ing: any) => ing.name),
          ...item.missedIngredients.map((ing: any) => ing.name)
        ],
        availableIngredients: item.usedIngredients.map((ing: any) => ing.name),
        missingIngredients: item.missedIngredients.map((ing: any) => ing.name),
        matchPercentage,
        instructions: [],
        dietary: [],
        saved: false
      };
    });

    // Sort recipes by match percentage (highest first)
    recipes.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Store recipes in Supabase
    for (const recipe of recipes) {
      const { data: existingRecipe } = await supabase
        .from('recipes')
        .select()
        .eq('id', recipe.id)
        .single();

      if (!existingRecipe) {
        await supabase
          .from('recipes')
          .insert({
            id: recipe.id,
            name: recipe.name,
            image: recipe.image,
            cuisine: recipe.cuisine,
            difficulty: recipe.difficulty,
            duration: recipe.duration,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            dietary: recipe.dietary
          });
      }
    }

    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

export const toggleFavoriteRecipe = async (recipeId: string, userId: string | undefined) => {
  if (!userId) {
    throw new Error('User must be logged in to save recipes');
  }

  const { data: existing } = await supabase
    .from('user_favorites')
    .select()
    .eq('recipe_id', recipeId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    await supabase
      .from('user_favorites')
      .delete()
      .eq('recipe_id', recipeId)
      .eq('user_id', userId);
    return false;
  } else {
    await supabase
      .from('user_favorites')
      .insert({
        recipe_id: recipeId,
        user_id: userId
      });
    return true;
  }
};

export const getFavoriteStatus = async (recipeId: string, userId: string | undefined): Promise<boolean> => {
  if (!userId) return false;

  const { data } = await supabase
    .from('user_favorites')
    .select()
    .eq('recipe_id', recipeId)
    .eq('user_id', userId)
    .single();

  return !!data;
};