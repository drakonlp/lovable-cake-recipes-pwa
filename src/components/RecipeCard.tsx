import { Heart, Clock, Users, ChefHat } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite: (id: string) => void;
  onClick: (recipe: Recipe) => void;
  isFavorite: boolean;
}

export function RecipeCard({ recipe, onToggleFavorite, onClick, isFavorite }: RecipeCardProps) {
  const getDifficultyColor = (difficulty: Recipe['dificuldade']) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Médio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Difícil': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-recipe hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-cake-pink/20 animate-fade-in"
      onClick={() => onClick(recipe)}
    >
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={recipe.imagem} 
            alt={recipe.titulo}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Botão de favorito */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(recipe.id);
            }}
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`} 
            />
          </Button>

          {/* Badge de categoria */}
          <Badge 
            className="absolute top-2 left-2 bg-gradient-primary text-white border-0"
          >
            {recipe.categoria}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {recipe.titulo}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {recipe.descricao}
          </p>
        </div>

        {/* Informações da receita */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.tempo}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.rendimento}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            <Badge variant="outline" className={getDifficultyColor(recipe.dificuldade)}>
              {recipe.dificuldade}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}