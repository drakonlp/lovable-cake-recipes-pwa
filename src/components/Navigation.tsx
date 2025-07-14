import { useState } from 'react';
import { Menu, X, Home, Heart, Search, Settings, Plus, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORIES } from '@/types/recipe';

interface NavigationProps {
  isEditorMode: boolean;
  isDarkMode: boolean;
  currentCategory: string;
  searchTerm: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (term: string) => void;
  onToggleDarkMode: () => void;
  onShowEditorLogin: () => void;
  onExitEditor: () => void;
  onShowAddRecipe: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({
  isEditorMode,
  isDarkMode,
  currentCategory,
  searchTerm,
  onCategoryChange,
  onSearchChange,
  onToggleDarkMode,
  onShowEditorLogin,
  onExitEditor,
  onShowAddRecipe,
  currentView,
  onViewChange
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'favorites', label: 'Favoritos', icon: Heart },
    { id: 'search', label: 'Buscar', icon: Search },
  ];

  if (isEditorMode) {
    menuItems.push(
      { id: 'add', label: 'Adicionar', icon: Plus },
      { id: 'settings', label: 'Configurações', icon: Settings }
    );
  }

  return (
    <>
      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-cake-pink/20 shadow-card">
        <div className="flex items-center justify-between p-4">
          {/* Logo/Título */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Receitas de Bolo
            </h1>
            
            {isEditorMode && (
              <span className="px-2 py-1 text-xs bg-cake-gold text-cake-chocolate rounded-full font-medium">
                Editor
              </span>
            )}
          </div>

          {/* Ações do header */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {isEditorMode ? (
              <Button variant="outline" size="sm" onClick={onExitEditor}>
                Sair do Editor
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={onShowEditorLogin}>
                Editor
              </Button>
            )}
          </div>
        </div>

        {/* Barra de busca */}
        {currentView === 'search' && (
          <div className="px-4 pb-4">
            <Input
              placeholder="Buscar receitas ou ingredientes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-cake-cream/50 border-cake-pink/30"
            />
          </div>
        )}
      </header>

      {/* Menu lateral para mobile */}
      <div className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setIsMenuOpen(false)}>
        <div className={`fixed left-0 top-0 h-full w-80 bg-background border-r border-cake-pink/20 transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Header do menu */}
          <div className="p-4 border-b border-cake-pink/20">
            <h2 className="font-semibold text-foreground">Menu</h2>
          </div>

          {/* Navegação principal */}
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "cake" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      onViewChange(item.id);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            {/* Categorias */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Categorias</h3>
              <div className="space-y-1">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    variant={currentCategory === category ? "cream" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => {
                      onCategoryChange(category);
                      onViewChange('home');
                      setIsMenuOpen(false);
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom navigation para mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-cake-pink/20 md:hidden">
        <div className="flex items-center justify-around p-2">
          {menuItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "cake" : "ghost"}
                size="icon"
                className="flex-1 max-w-16 h-12 flex-col gap-1"
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background/80 backdrop-blur-sm border-r border-cake-pink/20 hidden md:block overflow-y-auto">
        <nav className="p-4">
          {/* Navegação principal */}
          <div className="space-y-2 mb-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "cake" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Categorias</h3>
            <div className="space-y-1">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={currentCategory === category ? "cream" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => {
                    onCategoryChange(category);
                    onViewChange('home');
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}