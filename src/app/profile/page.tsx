'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const { user, isLoading } = useAuth({
    requireAuth: true,
    redirectTo: '/login',
  });

  const [activeTab, setActiveTab] = useState('profile');
  // For edit profile functionality
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil Pengguna</h1>
        <p className="text-gray-500 mt-1">Kelola informasi akun dan preferensi Anda</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide mb-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="preferences">Preferensi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Edit Profil</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-2xl">
                        {user?.name ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button type="submit">Simpan Perubahan</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <CardTitle className="text-xl">Informasi Akun</CardTitle>
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profil
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-6">
                <div className="flex justify-center md:justify-start">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nama Lengkap</h3>
                    <p className="mt-1 text-lg font-medium">{user?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-lg font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tanggal Bergabung</h3>
                    <p className="mt-1 text-lg font-medium">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Aktivitas Saya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <span className="text-3xl font-bold text-blue-600">12</span>
                  <p className="mt-1 text-gray-600">Artikel Dibaca</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <span className="text-3xl font-bold text-green-600">5</span>
                  <p className="mt-1 text-gray-600">Artikel Disimpan</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <span className="text-3xl font-bold text-amber-600">3</span>
                  <p className="mt-1 text-gray-600">Kategori Favorit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Ubah Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Password Saat Ini</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password Baru</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button type="submit">Ubah Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Preferensi Berita</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Pilih kategori berita yang ingin ditampilkan di halaman utama Anda
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="cat-politik" className="w-4 h-4" defaultChecked />
                  <Label htmlFor="cat-politik">Politik</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="cat-teknologi" className="w-4 h-4" defaultChecked />
                  <Label htmlFor="cat-teknologi">Teknologi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="cat-hiburan" className="w-4 h-4" defaultChecked />
                  <Label htmlFor="cat-hiburan">Hiburan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="cat-sport" className="w-4 h-4" defaultChecked />
                  <Label htmlFor="cat-sport">Sport</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="cat-ekonomi" className="w-4 h-4" />
                  <Label htmlFor="cat-ekonomi">Ekonomi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="cat-pendidikan" className="w-4 h-4" />
                  <Label htmlFor="cat-pendidikan">Pendidikan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="cat-kesehatan" className="w-4 h-4" />
                  <Label htmlFor="cat-kesehatan">Kesehatan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="cat-internasional" className="w-4 h-4" />
                  <Label htmlFor="cat-internasional">Internasional</Label>
                </div>
              </div>
              <Button className="mt-6">Simpan Preferensi</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
