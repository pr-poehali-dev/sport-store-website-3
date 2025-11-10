import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InventoryItem {
  id: number;
  productName: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  supplierName: string;
  supplierPhone: string;
  supplierEmail: string;
  lastDeliveryDate: string;
  nextDeliveryDate: string;
  unitPrice: number;
  needsRestock: boolean;
}

interface SaleItem {
  storeId: number;
  productName: string;
  quantity: number;
  revenue: number;
}

interface StoreRevenue {
  storeId: number;
  storeName: string;
  totalRevenue: number;
}

interface DailyRevenue {
  date: string;
  revenue: number;
}

interface AdminData {
  inventory: InventoryItem[];
  topSales: SaleItem[];
  storeRevenue: StoreRevenue[];
  dailyRevenue: DailyRevenue[];
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://functions.poehali.dev/dd2279b8-13f2-4252-9822-7e0eba2a1f2c')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading admin data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl">Загрузка данных...</p>
      </div>
    );
  }

  const totalRevenue = data?.storeRevenue.reduce((sum, store) => sum + store.totalRevenue, 0) || 0;
  const lowStockItems = data?.inventory.filter(item => item.needsRestock).length || 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon name="ShieldCheck" size={28} className="text-secondary" />
            <h1 className="text-2xl font-bold text-primary">Админ-панель SportPro</h1>
          </div>
          <Button onClick={onLogout} variant="outline">
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Выручка за неделю</h3>
              <Icon name="TrendingUp" size={20} className="text-secondary" />
            </div>
            <p className="text-3xl font-bold text-accent">{totalRevenue.toLocaleString()} ₽</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Товаров требует закупки</h3>
              <Icon name="AlertTriangle" size={20} className="text-accent" />
            </div>
            <p className="text-3xl font-bold">{lowStockItems}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Магазинов в сети</h3>
              <Icon name="Store" size={20} className="text-secondary" />
            </div>
            <p className="text-3xl font-bold">{data?.storeRevenue.length || 0}</p>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList>
            <TabsTrigger value="inventory">Склад и закупки</TabsTrigger>
            <TabsTrigger value="sales">Продажи</TabsTrigger>
            <TabsTrigger value="revenue">Выручка магазинов</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Остатки на складе</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Товар</TableHead>
                        <TableHead>Категория</TableHead>
                        <TableHead>Остаток</TableHead>
                        <TableHead>Мин. уровень</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Поставщик</TableHead>
                        <TableHead>Контакт</TableHead>
                        <TableHead>Последняя поставка</TableHead>
                        <TableHead>Следующая поставка</TableHead>
                        <TableHead>Цена закупки</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.inventory.map(item => (
                        <TableRow key={item.id} className={item.needsRestock ? 'bg-red-50' : ''}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="font-bold">{item.currentStock}</TableCell>
                          <TableCell>{item.minStockLevel}</TableCell>
                          <TableCell>
                            {item.needsRestock ? (
                              <Badge variant="destructive" className="gap-1">
                                <Icon name="AlertCircle" size={14} />
                                Требуется закупка
                              </Badge>
                            ) : (
                              <Badge className="bg-green-500 gap-1">
                                <Icon name="CheckCircle" size={14} />
                                В наличии
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{item.supplierName}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{item.supplierPhone}</div>
                              <div className="text-muted-foreground">{item.supplierEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>{item.lastDeliveryDate}</TableCell>
                          <TableCell className="font-medium">{item.nextDeliveryDate}</TableCell>
                          <TableCell>{item.unitPrice.toLocaleString()} ₽</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Топ продаж за неделю</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Магазин</TableHead>
                        <TableHead>Товар</TableHead>
                        <TableHead>Продано единиц</TableHead>
                        <TableHead>Выручка</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.topSales.map((sale, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Badge variant="outline">Магазин #{sale.storeId}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{sale.productName}</TableCell>
                          <TableCell className="font-bold">{sale.quantity}</TableCell>
                          <TableCell className="text-accent font-bold">
                            {sale.revenue.toLocaleString()} ₽
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <div className="space-y-6">
              <Card>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Выручка по магазинам (7 дней)</h2>
                  <div className="space-y-4">
                    {data?.storeRevenue.map(store => (
                      <div key={store.storeId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                            <Icon name="Store" size={24} className="text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-bold">{store.storeName}</h3>
                            <p className="text-sm text-muted-foreground">Магазин #{store.storeId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-accent">
                            {store.totalRevenue.toLocaleString()} ₽
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Динамика выручки по дням</h2>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Дата</TableHead>
                          <TableHead>Выручка</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.dailyRevenue.map((day, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{day.date}</TableCell>
                            <TableCell className="text-accent font-bold">
                              {day.revenue.toLocaleString()} ₽
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
