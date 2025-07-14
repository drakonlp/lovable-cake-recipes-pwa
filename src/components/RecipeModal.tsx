import { X, Heart, Clock, Users, ChefHat, Share2, Timer } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface RecipeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

export function RecipeModal({ recipe, isOpen, onClose, onToggleFavorite, isFavorite }: RecipeModalProps) {
  const { toast } = useToast();

  if (!isOpen) return null;

  const getDifficultyColor = (difficulty: Recipe['dificuldade']) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Médio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Difícil': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  };

  const shareRecipe = async () => {
    const shareData = {
      title: recipe.titulo,
      text: `Confira esta receita: ${recipe.titulo}\n\n${recipe.descricao}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback para copiar para clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n\n${shareData.text}`
        );
        toast({
          title: "Link copiado!",
          description: "A receita foi copiada para a área de transferência.",
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const startTimer = () => {
    const minutes = parseInt(recipe.tempo.match(/\d+/)?.[0] || '0');
    if (minutes > 0) {
      toast({
        title: "Timer iniciado!",
        description: `Timer de ${minutes} minutos iniciado para ${recipe.titulo}`,
      });
      // Aqui você poderia implementar um timer real
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Card 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-cake-pink/20 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com imagem */}
            <div className="relative">
              <img 
                src={recipe.imagem} 
                alt={recipe.titulo}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* Botões do header */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 hover:bg-white"
                  onClick={() => onToggleFavorite(recipe.id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`} 
                  />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 hover:bg-white"
                  onClick={shareRecipe}
                >
                  <Share2 className="h-4 w-4 text-gray-600" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 hover:bg-white"
                  onClick={onClose}
                >
                  <X className="h-4 w-4 text-gray-600" />
                </Button>
              </div>

              {/* Badge de categoria */}
              <Badge className="absolute top-4 left-4 bg-gradient-primary text-white border-0">
                {recipe.categoria}
              </Badge>

              {/* Título sobreposto */}
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-2xl font-bold text-white mb-2">{recipe.titulo}</h1>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${getDifficultyColor(recipe.dificuldade)} border-0`}>
                    <ChefHat className="h-3 w-3 mr-1" />
                    {recipe.dificuldade}
                  </Badge>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Informações rápidas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{recipe.tempo}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{recipe.rendimento}</span>
                </div>
              </div>

              <Button 
                variant="cake" 
                size="recipe" 
                className="w-full"
                onClick={startTimer}
              >
                <Timer className="h-4 w-4 mr-2" />
                Iniciar Timer de Preparo
              </Button>

              {/* Descrição */}
              <div>
                <p className="text-muted-foreground">{recipe.descricao}</p>
              </div>

              <Separator />

              {/* Ingredientes */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">Ingredientes</h3>
                <ul className="space-y-2">
                  {recipe.ingredientes.map((ingrediente, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{ingrediente}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Modo de preparo */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary">Modo de Preparo</h3>
                <ol className="space-y-3">
                  {recipe.preparo.map((passo, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="w-6 h-6 bg-gradient-primary text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-sm leading-relaxed">{passo}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}