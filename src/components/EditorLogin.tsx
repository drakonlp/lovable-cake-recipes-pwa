import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface EditorLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

export function EditorLogin({ isOpen, onClose, onLogin }: EditorLoginProps) {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    
    if (success) {
      setPassword('');
      onClose();
      toast({
        title: "Modo Editor Ativado",
        description: "Agora você pode criar e editar receitas.",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "Verifique a senha e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Card 
            className="w-full max-w-md bg-background/95 backdrop-blur-sm border-cake-pink/20 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Modo Editor
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Digite a senha para acessar o modo de edição e criar/modificar receitas.
                  </p>
                  
                  <Input
                    type="password"
                    placeholder="Digite a senha..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-cake-cream/50 border-cake-pink/30"
                    autoFocus
                  />
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Dica: A senha padrão é "admin123"
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" variant="cake" className="flex-1">
                    Entrar
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