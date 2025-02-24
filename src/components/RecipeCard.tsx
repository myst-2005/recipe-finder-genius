
import { Heart } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface RecipeCardProps {
  recipe: Recipe;
  onSave: (id: string) => void;
}

const RecipeCard = ({ recipe, onSave }: RecipeCardProps) => {
  return (
    <div className="group relative rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn hover:scale-[1.02] hover:shadow-xl hover:shadow-rainbow">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
      />
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 relative">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="outline" 
                className={cn(
                  "font-semibold",
                  recipe.matchPercentage > 75 
                    ? "bg-green-100 text-green-700 border-green-300" 
                    : "bg-red-100 text-red-700 border-red-300"
                )}
              >
                {recipe.matchPercentage}% match
              </Badge>
              <span className="text-xs text-gray-500">{recipe.duration} mins</span>
            </div>
            <h3 className="font-semibold text-lg leading-tight mb-2">{recipe.name}</h3>
          </div>
          <button
            onClick={() => onSave(recipe.id)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                recipe.saved ? "fill-accent stroke-accent" : "stroke-gray-400"
              )}
            />
          </button>
        </div>
        
        <div className="space-y-2">
          {recipe.availableIngredients.length > 0 && (
            <div>
              <p className="text-xs font-medium text-green-700 mb-1">You have:</p>
              <div className="flex flex-wrap gap-1">
                {recipe.availableIngredients.map((ingredient, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-green-100 text-green-700 border-green-300"
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {recipe.missingIngredients.length > 0 && (
            <div>
              <p className="text-xs font-medium text-red-700 mb-1">You need:</p>
              <div className="flex flex-wrap gap-1">
                {recipe.missingIngredients.map((ingredient, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-red-100 text-red-700 border-red-300"
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
