
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "@/components/SearchBar";
import RecipeCard from "@/components/RecipeCard";
import DietaryFilter from "@/components/DietaryFilter";
import { Recipe } from "@/types/recipe";
import { searchRecipesByIngredients } from "@/services/recipeApi";

const dietaryOptions = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "high-protein",
];

const Index = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  // Debounce search input
  const handleSearchChange = (value: string) => {
    setSearch(value);
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  // Fetch recipes using React Query
  const { data: recipes = [], isLoading, isError } = useQuery({
    queryKey: ['recipes', debouncedSearch],
    queryFn: () => searchRecipesByIngredients(debouncedSearch, import.meta.env.VITE_SPOONACULAR_API_KEY),
    enabled: debouncedSearch.length > 0,
  });

  const handleSaveRecipe = (id: string) => {
    // Update local state for saved recipes
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      toast({
        title: recipe.saved ? "Recipe removed from favorites" : "Recipe saved to favorites",
        duration: 2000
      });
    }
  };

  const toggleDietary = (option: string) => {
    setSelectedDietary((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Recipe Finder</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your ingredients to discover delicious recipes you can make right now
          </p>
        </div>

        <SearchBar 
          value={search} 
          onChange={handleSearchChange}
          placeholder="Enter ingredients (e.g., tomatoes, basil, mozzarella)"
        />

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Dietary Preferences</h2>
            <DietaryFilter
              options={dietaryOptions}
              selected={selectedDietary}
              onToggle={toggleDietary}
            />
          </div>

          {isError && (
            <div className="text-center text-red-500">
              Error loading recipes. Please try again later.
            </div>
          )}

          {isLoading && (
            <div className="text-center text-gray-600">
              Searching for recipes...
            </div>
          )}

          {!isLoading && !isError && recipes.length === 0 && debouncedSearch && (
            <div className="text-center text-gray-600">
              No recipes found. Try different ingredients!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSave={handleSaveRecipe}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
