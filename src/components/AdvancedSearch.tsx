import { useState } from 'react';
import { Search, Filter, X, Clock, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Recipe } from '@/types/recipe';

interface AdvancedSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  recipes: Recipe[];
  categories: string[];
  onApplyFilters: (filteredRecipes: Recipe[]) => void;
}

interface SearchFilters {
  category: string;
  difficulty: string;
  maxTime: string;
  minServings: string;
  maxServings: string;
}

export function AdvancedSearch({
  searchTerm,
  onSearchChange,
  recipes,
  categories,
  onApplyFilters
}: AdvancedSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'todas',
    difficulty: 'todas',
    maxTime: '',
    minServings: '',
    maxServings: ''
  });

  const difficulties = ['Fácil', 'Médio', 'Difícil'];

  const parseTime = (timeString: string): number => {
    const match = timeString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const parseServings = (servingsString: string): number => {
    const match = servingsString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const applyFilters = () => {
    let filtered = recipes.filter(recipe => {
      // Busca por texto
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesTitle = recipe.titulo.toLowerCase().includes(searchLower);
        const matchesIngredients = recipe.ingredientes.some(ing => 
          ing.toLowerCase().includes(searchLower)
        );
        const matchesDescription = recipe.descricao.toLowerCase().includes(searchLower);
        
        if (!matchesTitle && !matchesIngredients && !matchesDescription) {
          return false;
        }
      }

      // Filtro por categoria
      if (filters.category !== 'todas' && recipe.categoria !== filters.category) {
        return false;
      }

      // Filtro por dificuldade
      if (filters.difficulty !== 'todas' && recipe.dificuldade !== filters.difficulty) {
        return false;
      }

      // Filtro por tempo máximo
      if (filters.maxTime) {
        const recipeTime = parseTime(recipe.tempo);
        const maxTime = parseInt(filters.maxTime);
        if (recipeTime > maxTime) {
          return false;
        }
      }

      // Filtro por porções mínimas
      if (filters.minServings) {
        const recipeServings = parseServings(recipe.rendimento);
        const minServings = parseInt(filters.minServings);
        if (recipeServings < minServings) {
          return false;
        }
      }

      // Filtro por porções máximas
      if (filters.maxServings) {
        const recipeServings = parseServings(recipe.rendimento);
        const maxServings = parseInt(filters.maxServings);
        if (recipeServings > maxServings) {
          return false;
        }
      }

      return true;
    });

    onApplyFilters(filtered);
  };

  const clearFilters = () => {
    setFilters({
      category: 'todas',
      difficulty: 'todas',
      maxTime: '',
      minServings: '',
      maxServings: ''
    });
    onSearchChange('');
    onApplyFilters(recipes);
  };

  const hasActiveFilters = () => {
    return searchTerm || 
           filters.category !== 'todas' || 
           filters.difficulty !== 'todas' || 
           filters.maxTime || 
           filters.minServings || 
           filters.maxServings;
  };

  return (
    <div className="space-y-4">
      {/* Barra de busca principal */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar receitas, ingredientes ou descrição..."
            value={searchTerm}
            onChange={(e) => {
              onSearchChange(e.target.value);
              applyFilters();
            }}
            className="pl-10 bg-cake-cream/50 border-cake-pink/30"
          />
        </div>
        
        <Button
          variant={showFilters ? "cake" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
        
        {hasActiveFilters() && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filtros avançados */}
      {showFilters && (
        <div className="p-4 bg-card/50 rounded-lg border border-cake-pink/20 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Categoria */}
            <div>
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, category: value }));
                  setTimeout(applyFilters, 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {categories.filter(cat => cat !== 'Todas').map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dificuldade */}
            <div>
              <label className="text-sm font-medium mb-2 block">Dificuldade</label>
              <Select 
                value={filters.difficulty} 
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, difficulty: value }));
                  setTimeout(applyFilters, 0);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as dificuldades</SelectItem>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tempo máximo */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Tempo máximo (min)
              </label>
              <Input
                type="number"
                placeholder="Ex: 60"
                value={filters.maxTime}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, maxTime: e.target.value }));
                  setTimeout(applyFilters, 100);
                }}
              />
            </div>

            {/* Porções mínimas */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                <Users className="h-3 w-3" />
                Porções mínimas
              </label>
              <Input
                type="number"
                placeholder="Ex: 4"
                value={filters.minServings}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, minServings: e.target.value }));
                  setTimeout(applyFilters, 100);
                }}
              />
            </div>

            {/* Porções máximas */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                <Target className="h-3 w-3" />
                Porções máximas
              </label>
              <Input
                type="number"
                placeholder="Ex: 10"
                value={filters.maxServings}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, maxServings: e.target.value }));
                  setTimeout(applyFilters, 100);
                }}
              />
            </div>
          </div>

          {/* Filtros ativos */}
          {hasActiveFilters() && (
            <div className="pt-3 border-t border-cake-pink/20">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Busca: "{searchTerm}"
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        onSearchChange('');
                        applyFilters();
                      }}
                    />
                  </Badge>
                )}
                
                {filters.category !== 'todas' && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.category}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setFilters(prev => ({ ...prev, category: 'todas' }));
                        applyFilters();
                      }}
                    />
                  </Badge>
                )}
                
                {filters.difficulty !== 'todas' && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.difficulty}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setFilters(prev => ({ ...prev, difficulty: 'todas' }));
                        applyFilters();
                      }}
                    />
                  </Badge>
                )}
                
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar todos
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}