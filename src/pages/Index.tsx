import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import AdminDashboard from '@/components/AdminDashboard';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  color: string;
  size: string;
  image: string;
  description: string;
}

const products: Product[] = [
  { id: 1, name: 'Кроссовки для бега Pro', price: 8990, category: 'Обувь', color: 'Черный', size: '42', image: 'https://cdn.poehali.dev/projects/d6fbfb25-a520-4b78-9df9-8c60df5ae822/files/9e16b086-667c-44e1-8317-cf2842b9947a.jpg', description: 'Профессиональные беговые кроссовки' },
  { id: 2, name: 'Фитнес набор', price: 4500, category: 'Аксессуары', color: 'Синий', size: 'S', image: 'https://cdn.poehali.dev/projects/d6fbfb25-a520-4b78-9df9-8c60df5ae822/files/19d6b61b-c448-4da9-8df5-1c108b3e18a1.jpg', description: 'Комплект для домашних тренировок' },
  { id: 3, name: 'Спортивная куртка', price: 6790, category: 'Одежда', color: 'Серый', size: 'L', image: 'https://cdn.poehali.dev/projects/d6fbfb25-a520-4b78-9df9-8c60df5ae822/files/eb93a87a-e5dd-4747-aeef-8f7364a501e4.jpg', description: 'Легкая ветрозащитная куртка' },
  { id: 4, name: 'Беговые кроссовки Ultra', price: 12990, category: 'Обувь', color: 'Белый', size: '43', image: 'https://cdn.poehali.dev/projects/d6fbfb25-a520-4b78-9df9-8c60df5ae822/files/9e16b086-667c-44e1-8317-cf2842b9947a.jpg', description: 'Премиум линейка для профессионалов' },
  { id: 5, name: 'Гантели 5кг', price: 2990, category: 'Аксессуары', color: 'Черный', size: 'M', image: 'https://cdn.poehali.dev/projects/d6fbfb25-a520-4b78-9df9-8c60df5ae822/files/19d6b61b-c448-4da9-8df5-1c108b3e18a1.jpg', description: 'Пара неопреновых гантелей' },
  { id: 6, name: 'Спортивный костюм', price: 5490, category: 'Одежда', color: 'Синий', size: 'M', image: 'https://cdn.poehali.dev/projects/d6fbfb25-a520-4b78-9df9-8c60df5ae822/files/eb93a87a-e5dd-4747-aeef-8f7364a501e4.jpg', description: 'Комфортный костюм для тренировок' },
];

const stores = [
  { id: 1, name: 'SportPro ТЦ Европейский', address: 'Москва, пл. Киевского Вокзала, 2', phone: '+7 (495) 123-45-67', hours: '10:00 - 22:00' },
  { id: 2, name: 'SportPro Авиапарк', address: 'Москва, Ходынский бульвар, 4', phone: '+7 (495) 234-56-78', hours: '10:00 - 22:00' },
  { id: 3, name: 'SportPro Мега Белая Дача', address: 'Котельники, 1-й Покровский проезд, 5', phone: '+7 (495) 345-67-89', hours: '10:00 - 22:00' },
];

export default function Index() {
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'contacts'>('home');
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();

  const categories = ['Обувь', 'Одежда', 'Аксессуары'];
  const colors = ['Черный', 'Белый', 'Синий', 'Серый'];
  const sizes = ['S', 'M', 'L', 'XL', '42', '43', '44'];

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
    const sizeMatch = selectedSizes.length === 0 || selectedSizes.includes(product.size);
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && colorMatch && sizeMatch && priceMatch;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]);
  };

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    setIsLoggingIn(true);

    try {
      const response = await fetch('https://functions.poehali.dev/7d26f6e9-c56d-42c8-ad1a-3c198dfec864', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.user.isAdmin) {
          setIsAdmin(true);
          setIsAuthOpen(false);
          toast({
            title: 'Успешный вход',
            description: 'Добро пожаловать в админ-панель!',
          });
        } else {
          toast({
            title: 'Вход выполнен',
            description: `Добро пожаловать, ${data.user.name}!`,
          });
          setIsAuthOpen(false);
        }
      } else {
        toast({
          title: 'Ошибка входа',
          description: 'Неверный логин или пароль',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setLoginEmail('');
    setLoginPassword('');
    toast({
      title: 'Выход выполнен',
      description: 'Вы вышли из админ-панели',
    });
  };

  if (isAdmin) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-primary">SportPro</h1>
            <nav className="hidden md:flex gap-6">
              <button onClick={() => setCurrentPage('home')} className="text-sm font-medium hover:text-secondary transition-colors">
                Главная
              </button>
              <button onClick={() => setCurrentPage('catalog')} className="text-sm font-medium hover:text-secondary transition-colors">
                Каталог
              </button>
              <button onClick={() => setCurrentPage('contacts')} className="text-sm font-medium hover:text-secondary transition-colors">
                Контакты
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsAuthOpen(true)}>
              <Icon name="User" size={20} />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="Heart" size={20} />
                  {favorites.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {favorites.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="animate-slide-in-right">
                <SheetHeader>
                  <SheetTitle>Избранное</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {favorites.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Нет избранных товаров</p>
                  ) : (
                    products.filter(p => favorites.includes(p.id)).map(product => (
                      <Card key={product.id} className="p-3 flex gap-3">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{product.name}</h4>
                          <p className="text-accent font-bold">{product.price.toLocaleString()} ₽</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(product.id)}>
                          <Icon name="X" size={16} />
                        </Button>
                      </Card>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="animate-slide-in-right">
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4 flex-1">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map((product, index) => (
                        <Card key={index} className="p-3 flex gap-3">
                          <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{product.name}</h4>
                            <p className="text-accent font-bold">{product.price.toLocaleString()} ₽</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(index)}>
                            <Icon name="X" size={16} />
                          </Button>
                        </Card>
                      ))}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold">Итого:</span>
                          <span className="text-2xl font-bold text-accent">{cartTotal.toLocaleString()} ₽</span>
                        </div>
                        <Button className="w-full" size="lg">Оформить заказ</Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{authMode === 'login' ? 'Вход' : 'Регистрация'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {authMode === 'register' && (
              <div className="space-y-2">
                <Label>Имя</Label>
                <Input placeholder="Введите имя" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="text" 
                placeholder="example@mail.com" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Пароль</Label>
              <Input 
                type="password" 
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Вход...' : (authMode === 'login' ? 'Войти' : 'Зарегистрироваться')}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {authMode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-secondary hover:underline font-medium"
              >
                {authMode === 'login' ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {currentPage === 'home' && (
        <main className="animate-fade-in">
          <section className="relative h-[600px] bg-gradient-to-r from-primary to-primary/80 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img src="https://cdn.poehali.dev/projects/d6fbfb25-a520-4b78-9df9-8c60df5ae822/files/eb93a87a-e5dd-4747-aeef-8f7364a501e4.jpg" alt="Hero" className="w-full h-full object-cover" />
            </div>
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
              <h2 className="text-5xl md:text-7xl font-bold mb-6 max-w-2xl">Твой путь к победе начинается здесь</h2>
              <p className="text-xl md:text-2xl mb-8 max-w-xl text-white/90">Профессиональное спортивное снаряжение для достижения твоих целей</p>
              <div className="flex gap-4">
                <Button size="lg" variant="secondary" onClick={() => setCurrentPage('catalog')}>
                  Перейти в каталог
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                  Узнать больше
                </Button>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-16">
            <h3 className="text-3xl font-bold mb-8">Популярные категории</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {categories.map(category => (
                <Card key={category} className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300" onClick={() => {
                  setCurrentPage('catalog');
                  setSelectedCategories([category]);
                }}>
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={products.find(p => p.category === category)?.image} 
                      alt={category}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold">{category}</h4>
                    <p className="text-muted-foreground">Широкий ассортимент</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <h3 className="text-3xl font-bold mb-8">Хиты продаж</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {products.slice(0, 3).map(product => (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-scale-in">
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Icon name="Heart" size={20} className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''} />
                      </Button>
                    </div>
                    <div className="p-6">
                      <Badge className="mb-2">{product.category}</Badge>
                      <h4 className="text-lg font-bold mb-2">{product.name}</h4>
                      <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-accent">{product.price.toLocaleString()} ₽</span>
                        <Button onClick={() => addToCart(product)}>
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                  <Icon name="Truck" size={32} className="text-secondary" />
                </div>
                <h4 className="text-xl font-bold">Бесплатная доставка</h4>
                <p className="text-muted-foreground">При заказе от 5000 ₽</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                  <Icon name="Shield" size={32} className="text-secondary" />
                </div>
                <h4 className="text-xl font-bold">Гарантия качества</h4>
                <p className="text-muted-foreground">Только оригинальная продукция</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                  <Icon name="Clock" size={32} className="text-secondary" />
                </div>
                <h4 className="text-xl font-bold">Быстрый возврат</h4>
                <p className="text-muted-foreground">30 дней на возврат товара</p>
              </div>
            </div>
          </section>
        </main>
      )}

      {currentPage === 'catalog' && (
        <main className="container mx-auto px-4 py-8 animate-fade-in">
          <h2 className="text-4xl font-bold mb-8">Каталог товаров</h2>
          <div className="flex gap-8">
            <aside className="w-64 shrink-0 space-y-6">
              <Card className="p-6">
                <h3 className="font-bold mb-4">Цена</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={15000}
                  step={500}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{priceRange[0]} ₽</span>
                  <span>{priceRange[1]} ₽</span>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-4">Категория</h3>
                <div className="space-y-3">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          setSelectedCategories(prev =>
                            checked ? [...prev, category] : prev.filter(c => c !== category)
                          );
                        }}
                      />
                      <Label htmlFor={category} className="ml-2 cursor-pointer">{category}</Label>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-4">Цвет</h3>
                <div className="space-y-3">
                  {colors.map(color => (
                    <div key={color} className="flex items-center">
                      <Checkbox
                        id={color}
                        checked={selectedColors.includes(color)}
                        onCheckedChange={(checked) => {
                          setSelectedColors(prev =>
                            checked ? [...prev, color] : prev.filter(c => c !== color)
                          );
                        }}
                      />
                      <Label htmlFor={color} className="ml-2 cursor-pointer">{color}</Label>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-4">Размер</h3>
                <div className="space-y-3">
                  {sizes.map(size => (
                    <div key={size} className="flex items-center">
                      <Checkbox
                        id={size}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={(checked) => {
                          setSelectedSizes(prev =>
                            checked ? [...prev, size] : prev.filter(s => s !== size)
                          );
                        }}
                      />
                      <Label htmlFor={size} className="ml-2 cursor-pointer">{size}</Label>
                    </div>
                  ))}
                </div>
              </Card>
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">Найдено товаров: {filteredProducts.length}</p>
                {(selectedCategories.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedColors([]);
                      setSelectedSizes([]);
                      setPriceRange([0, 15000]);
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Icon name="Heart" size={20} className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''} />
                      </Button>
                    </div>
                    <div className="p-6">
                      <Badge className="mb-2">{product.category}</Badge>
                      <h4 className="text-lg font-bold mb-2">{product.name}</h4>
                      <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
                      <div className="flex gap-2 mb-4">
                        <Badge variant="outline">{product.color}</Badge>
                        <Badge variant="outline">{product.size}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-accent">{product.price.toLocaleString()} ₽</span>
                        <Button onClick={() => addToCart(product)}>
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {currentPage === 'contacts' && (
        <main className="container mx-auto px-4 py-8 animate-fade-in">
          <h2 className="text-4xl font-bold mb-8">Наши магазины</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {stores.map(store => (
                <Card key={store.id} className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold mb-3">{store.name}</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <Icon name="MapPin" size={20} className="shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Phone" size={20} className="shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={20} className="shrink-0" />
                      <span>{store.hours}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Свяжитесь с нами</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input placeholder="Ваше имя" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="example@mail.com" />
                </div>
                <div className="space-y-2">
                  <Label>Сообщение</Label>
                  <Input placeholder="Ваше сообщение" />
                </div>
                <Button className="w-full">Отправить</Button>
              </div>
              
              <div className="mt-8 pt-8 border-t">
                <h4 className="font-bold mb-4">Контактный центр</h4>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Icon name="Phone" size={18} />
                    8 (800) 555-35-35
                  </p>
                  <p className="flex items-center gap-2">
                    <Icon name="Mail" size={18} />
                    info@sportpro.ru
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      )}

      <footer className="bg-primary text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">SportPro</h3>
              <p className="text-white/80">Профессиональные спортивные товары для достижения ваших целей</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Компания</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Вакансии</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Блог</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Покупателям</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Доставка</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Возврат</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Гарантия</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-white/80">
                <li>8 (800) 555-35-35</li>
                <li>info@sportpro.ru</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>© 2024 SportPro. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}