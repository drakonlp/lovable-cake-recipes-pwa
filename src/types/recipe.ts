export interface Recipe {
  id: string;
  titulo: string;
  categoria: string;
  imagem: string;
  descricao: string;
  ingredientes: string[];
  preparo: string[];
  tempo: string;
  rendimento: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  favorito: boolean;
  dataCriacao: string;
}

export interface AppState {
  recipes: Recipe[];
  isEditorMode: boolean;
  isDarkMode: boolean;
  currentCategory: string;
  searchTerm: string;
  favorites: string[];
  categories: string[];
}

export const CATEGORIES = [
  'Todas',
  'Bolos Simples',
  'Bolos Decorados',
  'Bolos Sem Glúten', 
  'Bolos Veganos',
  'Bolos de Festa',
  'Cupcakes'
] as const;

export const DIFFICULTY_LEVELS = ['Fácil', 'Médio', 'Difícil'] as const;