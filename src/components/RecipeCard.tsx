
import { Heart } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  onSave: (id: string) => void;
}

const RecipeCard = ({ recipe, onSave }: RecipeCardProps) => {
  return (
    <div className="group relative rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs font-medium text-primary mb-1">{recipe.cuisine}</p>
            <h3 className="font-semibold text-lg leading-tight mb-1">{recipe.name}</h3>
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
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="px-2 py-1 rounded-full bg-secondary text-xs">
            {recipe.difficulty}
          </span>
          <span>{recipe.duration} mins</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
