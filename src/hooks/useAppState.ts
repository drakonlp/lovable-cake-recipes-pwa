import { useState, useEffect } from 'react';
import { Recipe, AppState } from '@/types/recipe';

const STORAGE_KEY = 'cake-recipe-app';
const EDITOR_PASSWORD = 'admin123'; // Senha simples para modo editor

// Receitas iniciais para demonstração
const initialRecipes: Recipe[] = [
  {
    id: '1',
    titulo: 'Bolo de Chocolate Simples',
    categoria: 'Bolos Simples',
    imagem: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    descricao: 'Um delicioso bolo de chocolate fofinho e saboroso, perfeito para qualquer ocasião.',
    ingredientes: [
      '2 xícaras de farinha de trigo',
      '1 xícara de açúcar',
      '1/2 xícara de chocolate em pó',
      '1 xícara de leite',
      '3 ovos',
      '1/2 xícara de óleo',
      '1 colher de sopa de fermento'
    ],
    preparo: [
      'Pré-aqueça o forno a 180°C',
      'Em uma tigela, misture todos os ingredientes secos',
      'Em outra tigela, bata os ovos, adicione o leite e o óleo',
      'Misture os ingredientes líquidos aos secos',
      'Despeje em uma forma untada',
      'Asse por 35-40 minutos'
    ],
    tempo: '40 minutos',
    rendimento: '8 porções',
    dificuldade: 'Fácil',
    favorito: false,
    dataCriacao: new Date().toISOString()
  },
  {
    id: '2',
    titulo: 'Cupcake de Baunilha',
    categoria: 'Cupcakes',
    imagem: 'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?w=400',
    descricao: 'Cupcakes delicados de baunilha com cobertura cremosa.',
    ingredientes: [
      '1 1/2 xícara de farinha de trigo',
      '1 xícara de açúcar',
      '1/2 xícara de manteiga',
      '2 ovos',
      '1/2 xícara de leite',
      '1 colher de chá de essência de baunilha',
      '1 colher de chá de fermento'
    ],
    preparo: [
      'Pré-aqueça o forno a 180°C',
      'Bata a manteiga com o açúcar até ficar cremoso',
      'Adicione os ovos um a um',
      'Alterne farinha e leite, mexendo sempre',
      'Adicione a baunilha e o fermento',
      'Distribua em forminhas de cupcake',
      'Asse por 18-20 minutos'
    ],
    tempo: '25 minutos',
    rendimento: '12 cupcakes',
    dificuldade: 'Fácil',
    favorito: false,
    dataCriacao: new Date().toISOString()
  },
  {
    id: '3',
    titulo: 'Bolo Vegano de Cenoura',
    categoria: 'Bolos Veganos',
    imagem: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400',
    descricao: 'Bolo de cenoura vegano super fofo e saboroso, sem ingredientes de origem animal.',
    ingredientes: [
      '2 xícaras de farinha de trigo',
      '1 xícara de açúcar demerara',
      '3 cenouras médias',
      '1/2 xícara de óleo de coco',
      '1 xícara de leite vegetal',
      '1 colher de sopa de fermento',
      '1 colher de chá de canela'
    ],
    preparo: [
      'Cozinhe as cenouras e bata no liquidificador com o leite vegetal',
      'Misture todos os ingredientes secos',
      'Combine o líquido com os secos',
      'Adicione o óleo de coco derretido',
      'Despeje em forma untada',
      'Asse a 180°C por 45 minutos'
    ],
    tempo: '50 minutos',
    rendimento: '10 porções',
    dificuldade: 'Médio',
    favorito: false,
    dataCriacao: new Date().toISOString()
  }
];

const initialState: AppState = {
  recipes: initialRecipes,
  isEditorMode: false,
  isDarkMode: false,
  currentCategory: 'Todas',
  searchTerm: '',
  favorites: [],
  categories: ['Todas', 'Bolos Simples', 'Bolos Decorados', 'Bolos Sem Glúten', 'Bolos Veganos', 'Bolos de Festa', 'Cupcakes']
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          ...parsedState,
          // Mantém receitas iniciais se não houver receitas salvas
          recipes: parsedState.recipes?.length > 0 ? parsedState.recipes : initialRecipes
        }));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  // Salvar no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addRecipe = (recipe: Omit<Recipe, 'id' | 'favorito' | 'dataCriacao'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      favorito: false,
      dataCriacao: new Date().toISOString()
    };
    
    setState(prev => ({
      ...prev,
      recipes: [...prev.recipes, newRecipe]
    }));
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setState(prev => ({
      ...prev,
      recipes: prev.recipes.map(recipe => 
        recipe.id === id ? { ...recipe, ...updates } : recipe
      )
    }));
  };

  const deleteRecipe = (id: string) => {
    setState(prev => ({
      ...prev,
      recipes: prev.recipes.filter(recipe => recipe.id !== id),
      favorites: prev.favorites.filter(fav => fav !== id)
    }));
  };

  const toggleFavorite = (id: string) => {
    setState(prev => {
      const isFavorite = prev.favorites.includes(id);
      return {
        ...prev,
        favorites: isFavorite 
          ? prev.favorites.filter(fav => fav !== id)
          : [...prev.favorites, id],
        recipes: prev.recipes.map(recipe => 
          recipe.id === id ? { ...recipe, favorito: !isFavorite } : recipe
        )
      };
    });
  };

  const setCategory = (category: string) => {
    setState(prev => ({ ...prev, currentCategory: category }));
  };

  const setSearchTerm = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }));
  };

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const enterEditorMode = (password: string) => {
    if (password === EDITOR_PASSWORD) {
      setState(prev => ({ ...prev, isEditorMode: true }));
      return true;
    }
    return false;
  };

  const exitEditorMode = () => {
    setState(prev => ({ ...prev, isEditorMode: false }));
  };

  // Filtrar receitas baseado na categoria e busca
  const filteredRecipes = state.recipes.filter(recipe => {
    const matchesCategory = state.currentCategory === 'Todas' || recipe.categoria === state.currentCategory;
    const matchesSearch = recipe.titulo.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                         recipe.ingredientes.some(ing => ing.toLowerCase().includes(state.searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const favoriteRecipes = state.recipes.filter(recipe => state.favorites.includes(recipe.id));

  const addCategory = (category: string) => {
    if (!state.categories.includes(category)) {
      setState(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    }
  };

  const editCategory = (oldCategory: string, newCategory: string) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(cat => cat === oldCategory ? newCategory : cat),
      recipes: prev.recipes.map(recipe => 
        recipe.categoria === oldCategory ? { ...recipe, categoria: newCategory } : recipe
      ),
      currentCategory: prev.currentCategory === oldCategory ? newCategory : prev.currentCategory
    }));
  };

  const deleteCategory = (category: string) => {
    if (category !== 'Todas') {
      setState(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat !== category),
        currentCategory: prev.currentCategory === category ? 'Todas' : prev.currentCategory
      }));
    }
  };

  const getCategoriesWithCount = () => {
    const counts: Record<string, number> = {};
    state.categories.forEach(category => {
      if (category === 'Todas') {
        counts[category] = state.recipes.length;
      } else {
        counts[category] = state.recipes.filter(recipe => recipe.categoria === category).length;
      }
    });
    return counts;
  };

  return {
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
    favoriteRecipes,
    addCategory,
    editCategory,
    deleteCategory,
    getCategoriesWithCount
  };
}