import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface DonateProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'weapons' | 'resources' | 'vip';
  icon: string;
}

const products: DonateProduct[] = [
  {
    id: 1,
    name: 'AK-47',
    description: 'Автомат Калашникова. Надёжное оружие для выживания.',
    price: 250,
    image: 'https://cdn.poehali.dev/projects/cb3e8f6c-1b8e-4556-97a9-bb095068a3e1/files/abfdffaa-9ce7-4358-b301-f60d3fc611b1.jpg',
    category: 'weapons',
    icon: 'Swords'
  },
  {
    id: 2,
    name: 'M4A1',
    description: 'Штурмовая винтовка высокой точности.',
    price: 300,
    image: 'https://cdn.poehali.dev/projects/cb3e8f6c-1b8e-4556-97a9-bb095068a3e1/files/abfdffaa-9ce7-4358-b301-f60d3fc611b1.jpg',
    category: 'weapons',
    icon: 'Swords'
  },
  {
    id: 3,
    name: 'Ресурс-пак (5000)',
    description: '5000 единиц дерева, камня и металла.',
    price: 150,
    image: 'https://cdn.poehali.dev/projects/cb3e8f6c-1b8e-4556-97a9-bb095068a3e1/files/51190b65-e7a8-48a6-b971-1b269930824e.jpg',
    category: 'resources',
    icon: 'Package'
  },
  {
    id: 4,
    name: 'Ресурс-пак (10000)',
    description: '10000 единиц дерева, камня и металла.',
    price: 280,
    image: 'https://cdn.poehali.dev/projects/cb3e8f6c-1b8e-4556-97a9-bb095068a3e1/files/51190b65-e7a8-48a6-b971-1b269930824e.jpg',
    category: 'resources',
    icon: 'Package'
  },
  {
    id: 5,
    name: 'VIP Бронза (30 дней)',
    description: 'Базовые привилегии: +10% к добыче ресурсов.',
    price: 199,
    image: 'https://cdn.poehali.dev/projects/cb3e8f6c-1b8e-4556-97a9-bb095068a3e1/files/d658e3d1-2986-4b35-a763-f492a0c9f018.jpg',
    category: 'vip',
    icon: 'Award'
  },
  {
    id: 6,
    name: 'VIP Серебро (30 дней)',
    description: 'Расширенные привилегии: +25% к добыче, набор оружия.',
    price: 399,
    image: 'https://cdn.poehali.dev/projects/cb3e8f6c-1b8e-4556-97a9-bb095068a3e1/files/d658e3d1-2986-4b35-a763-f492a0c9f018.jpg',
    category: 'vip',
    icon: 'Award'
  },
  {
    id: 7,
    name: 'VIP Золото (30 дней)',
    description: 'Максимальные привилегии: +50% к добыче, эксклюзивные скины.',
    price: 799,
    image: 'https://cdn.poehali.dev/projects/cb3e8f6c-1b8e-4556-97a9-bb095068a3e1/files/d658e3d1-2986-4b35-a763-f492a0c9f018.jpg',
    category: 'vip',
    icon: 'Award'
  }
];

interface Purchase {
  id: number;
  productName: string;
  steamId: string;
  status: 'pending' | 'delivered' | 'failed';
  timestamp: Date;
}

export default function Index() {
  const { user, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<DonateProduct | null>(null);
  const [steamId, setSteamId] = useState(user?.steamId || '');
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const handlePurchase = () => {
    if (!selectedProduct) {
      toast({
        title: 'Ошибка',
        description: 'Выберите товар для покупки',
        variant: 'destructive'
      });
      return;
    }

    if (!steamId.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите ваш Steam ID',
        variant: 'destructive'
      });
      return;
    }

    const newPurchase: Purchase = {
      id: Date.now(),
      productName: selectedProduct.name,
      steamId: steamId,
      status: 'pending',
      timestamp: new Date()
    };

    setPurchases([newPurchase, ...purchases]);
    
    setTimeout(() => {
      setPurchases(prev => 
        prev.map(p => 
          p.id === newPurchase.id 
            ? { ...p, status: 'delivered' as const }
            : p
        )
      );
      toast({
        title: 'Товар выдан!',
        description: `${selectedProduct.name} успешно выдан на сервер`,
      });
    }, 2000);

    toast({
      title: 'Обрабатываем платёж...',
      description: 'Товар будет выдан через несколько секунд',
    });

    setSelectedProduct(null);
    setSteamId('');
  };

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => p.category === activeTab);

  const getStatusBadge = (status: Purchase['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border-yellow-600">Обработка</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-600">Выдано</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-600">Ошибка</Badge>;
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
                  <p className="text-sm text-muted-foreground">Поддержи сервер • Получи преимущества</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/profile')}
                      className="border-primary/50 hover:bg-primary/10"
                    >
                      <Icon name="User" size={18} className="mr-2" />
                      {user?.username}
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={login}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Icon name="LogIn" size={18} className="mr-2" />
                    Войти через Steam
                  </Button>
                )}
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Онлайн</p>
                  <p className="text-xl font-bold text-primary">247 игроков</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-foreground">МАГАЗИН ТОВАРОВ</h2>
                <p className="text-muted-foreground">Выбери товар и получи его мгновенно на сервере</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Всё
                  </TabsTrigger>
                  <TabsTrigger value="weapons" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Оружие
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Ресурсы
                  </TabsTrigger>
                  <TabsTrigger value="vip" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    VIP
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid md:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className={`cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg border-2 ${
                      selectedProduct?.id === product.id 
                        ? 'border-primary shadow-primary/20 shadow-lg' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <CardHeader className="p-0">
                      <div className="relative h-40 overflow-hidden rounded-t-lg">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <Icon name={product.icon} size={24} className="text-primary" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
                      <CardDescription className="text-xs mb-3">{product.description}</CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                        {selectedProduct?.id === product.id && (
                          <Badge className="bg-primary text-primary-foreground">Выбрано</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4 border-2 border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="ShoppingCart" size={24} />
                    ОФОРМЛЕНИЕ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedProduct ? (
                    <div className="p-4 bg-muted rounded-lg border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon name={selectedProduct.icon} size={20} className="text-primary" />
                        <div className="flex-1">
                          <p className="font-bold text-sm">{selectedProduct.name}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-primary">{selectedProduct.price} ₽</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/50 rounded-lg border border-dashed border-border text-center">
                      <Icon name="Package" size={32} className="mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Товар не выбран</p>
                    </div>
                  )}

                  {isAuthenticated ? (
                    <div className="p-3 bg-muted rounded border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon name="User" size={16} className="text-primary" />
                        <span className="text-xs font-bold">Авторизован как:</span>
                      </div>
                      <p className="text-sm font-bold">{user?.username}</p>
                      <p className="text-xs text-muted-foreground font-mono">{user?.steamId}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="steam-id" className="text-sm font-bold">Steam ID</Label>
                      <Input
                        id="steam-id"
                        placeholder="STEAM_0:1:12345678"
                        value={steamId}
                        onChange={(e) => setSteamId(e.target.value)}
                        className="bg-input border-border"
                      />
                      <p className="text-xs text-muted-foreground">Товар будет выдан на этот Steam ID</p>
                    </div>
                  )}

                  {isAuthenticated ? (
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg"
                      disabled={!selectedProduct}
                      onClick={handlePurchase}
                    >
                      <Icon name="CreditCard" size={20} className="mr-2" />
                      ОПЛАТИТЬ
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-6 text-lg"
                      onClick={login}
                    >
                      <Icon name="LogIn" size={20} className="mr-2" />
                      ВОЙТИ ДЛЯ ПОКУПКИ
                    </Button>
                  )}
                </CardContent>
              </Card>

              {purchases.length > 0 && (
                <Card className="mt-4 border-2 border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon name="History" size={20} />
                      ИСТОРИЯ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {purchases.slice(0, 5).map((purchase) => (
                      <div key={purchase.id} className="p-3 bg-muted rounded border border-border">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-bold text-sm">{purchase.productName}</p>
                          {getStatusBadge(purchase.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">{purchase.steamId}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {purchase.timestamp.toLocaleTimeString('ru-RU')}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
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