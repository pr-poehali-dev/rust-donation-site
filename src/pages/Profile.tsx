import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  const mockPurchases = [
    {
      id: 1,
      productName: 'AK-47',
      price: 250,
      status: 'delivered' as const,
      timestamp: new Date('2024-11-25T14:30:00'),
    },
    {
      id: 2,
      productName: 'VIP Серебро (30 дней)',
      price: 399,
      status: 'delivered' as const,
      timestamp: new Date('2024-11-20T10:15:00'),
    },
    {
      id: 3,
      productName: 'Ресурс-пак (10000)',
      price: 280,
      status: 'delivered' as const,
      timestamp: new Date('2024-11-18T16:45:00'),
    },
  ];

  const totalSpent = mockPurchases.reduce((sum, p) => sum + p.price, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border-yellow-600">Обработка</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-600">Выдано</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-600">Ошибка</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(217, 104, 44, 0.3) 35px, rgba(217, 104, 44, 0.3) 70px)',
        }}
      />
      
      <div className="relative z-10">
        <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
                  <Icon name="Skull" size={28} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">RUST DONATE</h1>
                  <p className="text-sm text-muted-foreground">Личный кабинет</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="border-primary/50 hover:bg-primary/10"
                >
                  <Icon name="Store" size={18} className="mr-2" />
                  Магазин
                </Button>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="border-destructive/50 hover:bg-destructive/10"
                >
                  <Icon name="LogOut" size={18} className="mr-2" />
                  Выйти
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border-2 border-border">
                <CardHeader className="text-center pb-4">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden border-4 border-primary">
                    <img 
                      src={user.avatar} 
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-2xl">{user.username}</CardTitle>
                  <CardDescription className="font-mono text-xs">{user.steamId}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Статус</span>
                      <Badge className="bg-primary text-primary-foreground">VIP Серебро</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Покупок</span>
                      <span className="font-bold text-foreground">{mockPurchases.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Потрачено</span>
                      <span className="font-bold text-primary">{totalSpent} ₽</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Calendar" size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Регистрация:</span>
                      <span className="font-medium">15.11.2024</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Clock" size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Последний вход:</span>
                      <span className="font-medium">Сегодня</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-border mt-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Award" size={20} />
                    Активные привилегии
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-muted rounded border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">VIP Серебро</span>
                      <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-600">Активен</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">+25% к добыче ресурсов</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon name="Clock" size={12} />
                      <span>До 20.12.2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="History" size={24} />
                    История покупок
                  </CardTitle>
                  <CardDescription>Все ваши транзакции и донаты</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockPurchases.map((purchase) => (
                    <div 
                      key={purchase.id} 
                      className="p-4 bg-muted rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-base mb-1">{purchase.productName}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Icon name="Calendar" size={12} />
                              <span>{purchase.timestamp.toLocaleDateString('ru-RU')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon name="Clock" size={12} />
                              <span>{purchase.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(purchase.status)}
                          <p className="text-lg font-bold text-primary mt-1">{purchase.price} ₽</p>
                        </div>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Steam ID: {user.steamId}</span>
                        <div className="flex items-center gap-1 text-green-400">
                          <Icon name="CheckCircle" size={14} />
                          <span>Выдано на сервер</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {mockPurchases.length === 0 && (
                    <div className="text-center py-12">
                      <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">У вас пока нет покупок</p>
                      <Button 
                        onClick={() => navigate('/')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Icon name="Store" size={18} className="mr-2" />
                        Перейти в магазин
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-border mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Gift" size={24} />
                    Бонусы и достижения
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg border border-border text-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon name="Trophy" size={24} className="text-primary" />
                      </div>
                      <p className="font-bold text-sm mb-1">Постоянный клиент</p>
                      <p className="text-xs text-muted-foreground">3+ покупок</p>
                    </div>

                    <div className="p-4 bg-muted rounded-lg border border-border text-center">
                      <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon name="Star" size={24} className="text-secondary" />
                      </div>
                      <p className="font-bold text-sm mb-1">VIP игрок</p>
                      <p className="text-xs text-muted-foreground">Активная подписка</p>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg border border-dashed border-border text-center opacity-50">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon name="Lock" size={24} className="text-muted-foreground" />
                      </div>
                      <p className="font-bold text-sm mb-1">Щедрый донатор</p>
                      <p className="text-xs text-muted-foreground">1000+ ₽</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <footer className="border-t border-border/50 bg-card/80 backdrop-blur-sm mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>© 2024 RUST DONATE. Все товары выдаются мгновенно.</p>
              <div className="flex items-center gap-4">
                <Icon name="Shield" size={16} />
                <span>Безопасная оплата</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
