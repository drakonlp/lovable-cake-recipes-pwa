import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CATEGORIES, DIFFICULTY_LEVELS, Recipe } from '@/types/recipe';
import { useToast } from '@/hooks/use-toast';

interface RecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Omit<Recipe, 'id' | 'favorito' | 'dataCriacao'>) => void;
  editingRecipe?: Recipe | null;
}

export function RecipeForm({ isOpen, onClose, onSave, editingRecipe }: RecipeFormProps) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    titulo: editingRecipe?.titulo || '',
    categoria: editingRecipe?.categoria || '',
    imagem: editingRecipe?.imagem || '',
    descricao: editingRecipe?.descricao || '',
    ingredientes: editingRecipe?.ingredientes || [''],
    preparo: editingRecipe?.preparo || [''],
    tempo: editingRecipe?.tempo || '',
    rendimento: editingRecipe?.rendimento || '',
    dificuldade: editingRecipe?.dificuldade || 'Fácil' as const
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.categoria) newErrors.categoria = 'Categoria é obrigatória';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.tempo.trim()) newErrors.tempo = 'Tempo é obrigatório';
    if (!formData.rendimento.trim()) newErrors.rendimento = 'Rendimento é obrigatório';
    
    const validIngredientes = formData.ingredientes.filter(ing => ing.trim());
    if (validIngredientes.length === 0) newErrors.ingredientes = 'Pelo menos um ingrediente é obrigatório';
    
    const validPreparo = formData.preparo.filter(passo => passo.trim());
    if (validPreparo.length === 0) newErrors.preparo = 'Pelo menos um passo é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast({
        title: "Erro no formulário",
        description: "Verifique os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const recipeData = {
      ...formData,
      ingredientes: formData.ingredientes.filter(ing => ing.trim()),
      preparo: formData.preparo.filter(passo => passo.trim()),
      imagem: formData.imagem || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'
    };

    onSave(recipeData);
    onClose();
    
    toast({
      title: editingRecipe ? "Receita atualizada!" : "Receita criada!",
      description: `${formData.titulo} foi ${editingRecipe ? 'atualizada' : 'adicionada'} com sucesso.`,
    });
  };

  const addIngrediente = () => {
    setFormData(prev => ({
      ...prev,
      ingredientes: [...prev.ingredientes, '']
    }));
  };

  const removeIngrediente = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index)
    }));
  };

  const updateIngrediente = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.map((ing, i) => i === index ? value : ing)
    }));
  };

  const addPasso = () => {
    setFormData(prev => ({
      ...prev,
      preparo: [...prev.preparo, '']
    }));
  };

  const removePasso = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preparo: prev.preparo.filter((_, i) => i !== index)
    }));
  };

  const updatePasso = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      preparo: prev.preparo.map((passo, i) => i === index ? value : passo)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Card 
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-cake-pink/20 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingRecipe ? 'Editar Receita' : 'Nova Receita'}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título *</Label>
                    <Input
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                      className={errors.titulo ? 'border-red-500' : ''}
                    />
                    {errors.titulo && <p className="text-sm text-red-500">{errors.titulo}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}>
                      <SelectTrigger className={errors.categoria ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.filter(cat => cat !== 'Todas').map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>
                            {categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoria && <p className="text-sm text-red-500">{errors.categoria}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imagem">URL da Imagem</Label>
                  <Input
                    id="imagem"
                    value={formData.imagem}
                    onChange={(e) => setFormData(prev => ({ ...prev, imagem: e.target.value }))}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva a receita..."
                    className={errors.descricao ? 'border-red-500' : ''}
                  />
                  {errors.descricao && <p className="text-sm text-red-500">{errors.descricao}</p>}
                </div>

                {/* Informações de preparo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tempo">Tempo de Preparo *</Label>
                    <Input
                      id="tempo"
                      value={formData.tempo}
                      onChange={(e) => setFormData(prev => ({ ...prev, tempo: e.target.value }))}
                      placeholder="45 minutos"
                      className={errors.tempo ? 'border-red-500' : ''}
                    />
                    {errors.tempo && <p className="text-sm text-red-500">{errors.tempo}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rendimento">Rendimento *</Label>
                    <Input
                      id="rendimento"
                      value={formData.rendimento}
                      onChange={(e) => setFormData(prev => ({ ...prev, rendimento: e.target.value }))}
                      placeholder="8 porções"
                      className={errors.rendimento ? 'border-red-500' : ''}
                    />
                    {errors.rendimento && <p className="text-sm text-red-500">{errors.rendimento}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dificuldade">Dificuldade</Label>
                    <Select value={formData.dificuldade} onValueChange={(value: any) => setFormData(prev => ({ ...prev, dificuldade: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTY_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Ingredientes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Ingredientes *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addIngrediente}>
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  
                  {errors.ingredientes && <p className="text-sm text-red-500">{errors.ingredientes}</p>}
                  
                  <div className="space-y-2">
                    {formData.ingredientes.map((ingrediente, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={ingrediente}
                          onChange={(e) => updateIngrediente(index, e.target.value)}
                          placeholder={`Ingrediente ${index + 1}`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeIngrediente(index)}
                          disabled={formData.ingredientes.length === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modo de preparo */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Modo de Preparo *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addPasso}>
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  
                  {errors.preparo && <p className="text-sm text-red-500">{errors.preparo}</p>}
                  
                  <div className="space-y-2">
                    {formData.preparo.map((passo, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="w-8 h-8 bg-gradient-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">
                          {index + 1}
                        </span>
                        <Textarea
                          value={passo}
                          onChange={(e) => updatePasso(index, e.target.value)}
                          placeholder={`Passo ${index + 1}`}
                          className="flex-1 min-h-[60px]"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removePasso(index)}
                          disabled={formData.preparo.length === 1}
                          className="mt-1"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" variant="cake" className="flex-1">
                    {editingRecipe ? 'Atualizar' : 'Criar'} Receita
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}