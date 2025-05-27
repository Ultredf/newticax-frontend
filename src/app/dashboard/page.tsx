'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  const { user } = useAuth({
    requireAuth: true,
    redirectTo: '/login',
  });

  // Dummy news data
  const recentNews = [
    { id: 1, title: "DPR RESMI SAHKAN RUU TNI JADI UNDANG-UNDANG", category: "Politik", time: "40 menit yang lalu" },
    { id: 2, title: "Trump Sebut AS Akan Ambil Alih Jalur Gaza!", category: "Internasional", time: "1 jam yang lalu" },
    { id: 3, title: "Tim Garuda Kalah 5-1, Bagaimana Potensi Lolos Piala Dunia?", category: "Sport", time: "2 jam yang lalu" }
  ];

  // For personalized content
  const [selectedTab, setSelectedTab] = useState('semua');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Selamat datang, {user?.name}!</h1>
        <p className="text-gray-500 mt-1">Jelajahi berita terbaru dari berbagai kategori</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Breaking News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNews.map((news) => (
                <div key={news.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <h3 className="font-medium">{news.title}</h3>
                  <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>{news.category}</span>
                    <span>{news.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Kategori Populer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-100 p-3 rounded-md text-center">
                <span className="block font-medium text-blue-700">Politik</span>
                <span className="text-sm text-blue-600">24 artikel</span>
              </div>
              <div className="bg-green-100 p-3 rounded-md text-center">
                <span className="block font-medium text-green-700">Teknologi</span>
                <span className="text-sm text-green-600">18 artikel</span>
              </div>
              <div className="bg-amber-100 p-3 rounded-md text-center">
                <span className="block font-medium text-amber-700">Sport</span>
                <span className="text-sm text-amber-600">15 artikel</span>
              </div>
              <div className="bg-purple-100 p-3 rounded-md text-center">
                <span className="block font-medium text-purple-700">Hiburan</span>
                <span className="text-sm text-purple-600">12 artikel</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ringkasan Aktivitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Artikel dibaca</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Artikel disimpan</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Kategori favorit</span>
                <span className="font-medium">Teknologi</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personalized content */}
      <div className="mt-8">
        <Tabs defaultValue="semua" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide mb-4">
            <TabsTrigger value="semua">Semua</TabsTrigger>
            <TabsTrigger value="politik">Politik</TabsTrigger>
            <TabsTrigger value="teknologi">Teknologi</TabsTrigger>
            <TabsTrigger value="hiburan">Hiburan</TabsTrigger>
            <TabsTrigger value="sport">Sport</TabsTrigger>
            <TabsTrigger value="kesehatan">Kesehatan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="semua" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <NewsCard 
                image="/api/placeholder/600/400" 
                category="Politik"
                title="DPR RESMI SAHKAN RUU TNI JADI UNDANG-UNDANG"
                time="40 menit yang lalu"
                views={890}
                shares={86}
              />
              <NewsCard 
                image="/api/placeholder/600/400" 
                category="Internasional"
                title="Trump Sebut AS Akan Ambil Alih Jalur Gaza!"
                time="1 jam yang lalu"
                views={1240}
                shares={158}
              />
              <NewsCard 
                image="/api/placeholder/600/400" 
                category="Sport"
                title="Tim Garuda Kalah 5-1, Bagaimana Potensi Lolos Piala Dunia?"
                time="2 jam yang lalu"
                views={990}
                shares={85}
              />
              <NewsCard 
                image="/api/placeholder/600/400" 
                category="Kriminalitas"
                title="Kasus Kriminal WNI di Jepang Meningkat, Kemlu Ungkap Ada Faktor Judol"
                time="1 jam yang lalu"
                views={540}
                shares={32}
              />
              <NewsCard 
                image="/api/placeholder/600/400" 
                category="Ekonomi"
                title="Rupiah Menguat di Tengah Ketidakpastian Global"
                time="3 jam yang lalu"
                views={320}
                shares={14}
              />
              <NewsCard 
                image="/api/placeholder/600/400" 
                category="Kesehatan"
                title="Studi Baru: Pola Makan Sehat Kurangi Risiko Demensia"
                time="5 jam yang lalu"
                views={480}
                shares={62}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="politik" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <NewsCard 
                image="/api/placeholder/600/400" 
                category="Politik"
                title="DPR RESMI SAHKAN RUU TNI JADI UNDANG-UNDANG"
                time="40 menit yang lalu"
                views={890}
                shares={86}
              />
              <NewsCard 
                image="/api/placeholder/600/400" 
                category="Politik"
                title="Pemilihan Ketua MPR Berlangsung Sengit"
                time="3 jam yang lalu"
                views={420}
                shares={23}
              />
              <NewsCard 
                image="/api/placeholder/600/400" 
                category="Politik"
                title="Pemerintah Ajukan RUU Pemilu, Ini Perubahannya"
                time="5 jam yang lalu"
                views={380}
                shares={19}
              />
            </div>
          </TabsContent>
          
          {/* Repeat similar structure for other tabs */}
          <TabsContent value="teknologi" className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <NewsCard 
                image="/api/placeholder/600/400" 
                category="Teknologi"
                title="Indonesia Luncurkan Satelit Telekomunikasi Baru"
                time="2 jam yang lalu"
                views={560}
                shares={48}
              />
              <NewsCard 
                image="/api/placeholder/600/400" 
                category="Teknologi"
                title="Startup Lokal Raih Pendanaan Seri A $15 Juta"
                time="4 jam yang lalu"
                views={420}
                shares={35}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// NewsCard Component
interface NewsCardProps {
  image: string;
  category: string;
  title: string;
  time: string;
  views: number;
  shares: number;
}

function NewsCard({ image, category, title, time, views, shares }: NewsCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
      <div className="aspect-video relative bg-gray-100">
        <img 
          src={image} 
          alt={title} 
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-black text-white text-xs px-2 py-1 rounded-md">
            {category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium line-clamp-2 mb-2">{title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{time}</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {views}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {shares}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
