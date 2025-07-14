import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CategoryManagerProps {
  categories: string[];
  onAddCategory: (category: string) => void;
  onEditCategory: (oldCategory: string, newCategory: string) => void;
  onDeleteCategory: (category: string) => void;
  recipesCount: Record<string, number>;
}

export function CategoryManager({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  recipesCount
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
      setIsAddDialogOpen(false);
    }
  };

  const handleEditCategory = (category: string) => {
    setEditingCategory(category);
    setEditValue(category);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue.trim() !== editingCategory && !categories.includes(editValue.trim())) {
      onEditCategory(editingCategory!, editValue.trim());
      setEditingCategory(null);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  const canDeleteCategory = (category: string) => {
    return category !== 'Todas' && (recipesCount[category] || 0) === 0;
  };

  // Categorias editáveis (excluindo "Todas")
  const editableCategories = categories.filter(cat => cat !== 'Todas');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Gerenciar Categorias
        </h3>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="cake" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome da categoria..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddCategory} disabled={!newCategory.trim() || categories.includes(newCategory.trim())}>
                  Adicionar
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {editableCategories.map((category) => (
          <div key={category} className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-cake-pink/20">
            {editingCategory === category ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  className="flex-1"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveEdit} disabled={!editValue.trim() || editValue.trim() === category || categories.includes(editValue.trim())}>
                  Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{category}</div>
                    <div className="text-sm text-muted-foreground">
                      {recipesCount[category] || 0} receita{(recipesCount[category] || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  
                  {canDeleteCategory(category) ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteCategory(category)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      title="Não é possível excluir categoria com receitas"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {editableCategories.length === 0 && (
        <Alert>
          <AlertDescription>
            Nenhuma categoria personalizada criada ainda. Adicione uma nova categoria acima.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}