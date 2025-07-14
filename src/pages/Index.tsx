import { useState, useEffect } from 'react';
import { Cake, Heart, Search, Plus, Settings, ChefHat } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { Recipe } from '@/types/recipe';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeModal } from '@/components/RecipeModal';
import { Navigation } from '@/components/Navigation';
import { EditorLogin } from '@/components/EditorLogin';
import { RecipeForm } from '@/components/RecipeForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import appBackground from '@/assets/app-background.jpg';

const Index = () => {
  const {
    state,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
    setCategory,
    setSearchTerm,
    toggleDarkMode,
    enterEditorMode,
    exitEditorMode,
    filteredRecipes,
    favoriteRecipes
  } = useAppState();

  const [currentView, setCurrentView] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showEditorLogin, setShowEditorLogin] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // Aplicar tema escuro/claro
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  const handleEditorLogin = (password: string) => {
    return enterEditorMode(password);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (view === 'add' && state.isEditorMode) {
      setShowRecipeForm(true);
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowRecipeForm(true);
  };

  const handleSaveRecipe = (recipeData: Omit<Recipe, 'id' | 'favorito' | 'dataCriacao'>) => {
    if (editingRecipe) {
      updateRecipe(editingRecipe.id, recipeData);
      setEditingRecipe(null);
    } else {
      addRecipe(recipeData);
    }
    setShowRecipeForm(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'favorites':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                Receitas Favoritas
              </h2>
              <p className="text-muted-foreground">
                {favoriteRecipes.length === 0 
                  ? 'Você ainda não tem receitas favoritas.' 
                  : `${favoriteRecipes.length} receita${favoriteRecipes.length !== 1 ? 's' : ''} favorita${favoriteRecipes.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>

            {favoriteRecipes.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Toque no coração das receitas para salvá-las aqui!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onToggleFavorite={toggleFavorite}
                    onClick={setSelectedRecipe}
                    isFavorite={state.favorites.includes(recipe.id)}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'search':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Search className="h-6 w-6" />
                Buscar Receitas
              </h2>
              
              <Input
                placeholder="Buscar receitas ou ingredientes..."
                value={state.searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md bg-cake-cream/50 border-cake-pink/30"
              />
            </div>

            {state.searchTerm ? (
              <div>
                <p className="text-muted-foreground mb-4">
                  {filteredRecipes.length} resultado{filteredRecipes.length !== 1 ? 's' : ''} 
                  para "{state.searchTerm}"
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onToggleFavorite={toggleFavorite}
                      onClick={setSelectedRecipe}
                      isFavorite={state.favorites.includes(recipe.id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Digite algo para buscar receitas por nome ou ingredientes
                </p>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Configurações do Editor
            </h2>

            <div className="space-y-6 max-w-2xl">
              <div className="bg-card/50 p-6 rounded-lg border border-cake-pink/20">
                <h3 className="font-semibold mb-4">Receitas</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-cake-cream/30 rounded">
                    <div className="text-2xl font-bold text-primary">{state.recipes.length}</div>
                    <div className="text-muted-foreground">Total de Receitas</div>
                  </div>
                  <div className="text-center p-3 bg-cake-strawberry/30 rounded">
                    <div className="text-2xl font-bold text-primary">{state.favorites.length}</div>
                    <div className="text-muted-foreground">Favoritas</div>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 p-6 rounded-lg border border-cake-pink/20">
                <h3 className="font-semibold mb-4">Modo Editor</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No modo editor você pode criar, editar e excluir receitas. Este modo é protegido por senha.
                </p>
                <Button variant="destructive" onClick={exitEditorMode}>
                  Sair do Modo Editor
                </Button>
              </div>

              <div className="bg-card/50 p-6 rounded-lg border border-cake-pink/20">
                <h3 className="font-semibold mb-4">Todas as Receitas</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {state.recipes.map((recipe) => (
                    <div key={recipe.id} className="flex items-center justify-between p-2 bg-background/50 rounded">
                      <div>
                        <div className="font-medium text-sm">{recipe.titulo}</div>
                        <div className="text-xs text-muted-foreground">{recipe.categoria}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditRecipe(recipe)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteRecipe(recipe.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default: // home
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-primary" />
                {state.currentCategory === 'Todas' ? 'Todas as Receitas' : state.currentCategory}
              </h2>
              <p className="text-muted-foreground">
                {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? 's' : ''} 
                {state.currentCategory !== 'Todas' && ` de ${state.currentCategory}`}
              </p>
            </div>

            {state.isEditorMode && (
              <div className="mb-6">
                <Button 
                  variant="cake" 
                  onClick={() => setShowRecipeForm(true)}
                  className="animate-float"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nova Receita
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onToggleFavorite={toggleFavorite}
                  onClick={setSelectedRecipe}
                  isFavorite={state.favorites.includes(recipe.id)}
                />
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <Cake className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {state.currentCategory === 'Todas' 
                    ? 'Nenhuma receita encontrada.' 
                    : `Nenhuma receita encontrada em ${state.currentCategory}.`
                  }
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div 
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: `url(${appBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      
      {/* Navegação */}
      <Navigation
        isEditorMode={state.isEditorMode}
        isDarkMode={state.isDarkMode}
        currentCategory={state.currentCategory}
        searchTerm={state.searchTerm}
        onCategoryChange={setCategory}
        onSearchChange={setSearchTerm}
        onToggleDarkMode={toggleDarkMode}
        onShowEditorLogin={() => setShowEditorLogin(true)}
        onExitEditor={exitEditorMode}
        onShowAddRecipe={() => setShowRecipeForm(true)}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {/* Conteúdo principal */}
      <main className="relative z-10 pt-20 pb-20 md:pb-8 md:pl-64">
        <div className="container mx-auto px-4 py-6">
          {renderContent()}
        </div>
      </main>

      {/* Modais */}
      <RecipeModal
        recipe={selectedRecipe!}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onToggleFavorite={toggleFavorite}
        isFavorite={selectedRecipe ? state.favorites.includes(selectedRecipe.id) : false}
      />

      <EditorLogin
        isOpen={showEditorLogin}
        onClose={() => setShowEditorLogin(false)}
        onLogin={handleEditorLogin}
      />

      <RecipeForm
        isOpen={showRecipeForm}
        onClose={() => {
          setShowRecipeForm(false);
          setEditingRecipe(null);
        }}
        onSave={handleSaveRecipe}
        editingRecipe={editingRecipe}
      />
    </div>
  );
};

export default Index;
