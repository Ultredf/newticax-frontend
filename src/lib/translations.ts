// src/lib/translations.ts
export const translations = {
  ENGLISH: {
    general: {
      homepage: 'Home',
      dashboard: 'Dashboard',
      search: 'Search',
      trending: 'Trending',
      latest: 'Latest',
      bookmarks: 'Bookmarks',
      readingHistory: 'Reading History',
      notifications: 'Notifications',
      profile: 'Profile',
      settings: 'Settings',
      signIn: 'Sign in',
      signUp: 'Sign up',
      signOut: 'Sign out',
      cancel: 'Cancel',
      save: 'Save',
      create: 'Create',
      update: 'Update',
      delete: 'Delete',
      edit: 'Edit',
      submit: 'Submit'
    },
    auth: {
      welcome: 'Welcome to NewticaX',
      loginPrompt: 'Enter your credentials to sign in',
      registerPrompt: 'Enter your details to sign up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      forgotPassword: 'Forgot password?',
      noAccount: 'Don\'t have an account?',
      hasAccount: 'Already have an account?',
      continueWith: 'Or continue with'
    },
    article: {
      readMore: 'Read More',
      comments: 'Comments',
      likes: 'Likes',
      views: 'Views',
      share: 'Share',
      save: 'Save',
      saved: 'Saved',
      published: 'Published',
      addComment: 'Add a comment',
      postComment: 'Post Comment',
      writeComment: 'Write your comment...',
      relatedArticles: 'Related Articles',
      category: 'Category',
      tags: 'Tags',
      source: 'Source'
    }
  },
  INDONESIAN: {
    general: {
      homepage: 'Beranda',
      dashboard: 'Dasbor',
      search: 'Cari',
      trending: 'Trending',
      latest: 'Terbaru',
      bookmarks: 'Tersimpan',
      readingHistory: 'Riwayat Baca',
      notifications: 'Notifikasi',
      profile: 'Profil',
      settings: 'Pengaturan',
      signIn: 'Masuk',
      signUp: 'Daftar',
      signOut: 'Keluar',
      cancel: 'Batal',
      save: 'Simpan',
      create: 'Buat',
      update: 'Perbarui',
      delete: 'Hapus',
      edit: 'Edit',
      submit: 'Kirim'
    },
    auth: {
      welcome: 'Selamat Datang di NewticaX',
      loginPrompt: 'Masukkan kredensial Anda untuk masuk',
      registerPrompt: 'Masukkan detail Anda untuk mendaftar',
      email: 'Email',
      password: 'Kata Sandi',
      confirmPassword: 'Konfirmasi Kata Sandi',
      fullName: 'Nama Lengkap',
      forgotPassword: 'Lupa kata sandi?',
      noAccount: 'Belum punya akun?',
      hasAccount: 'Sudah punya akun?',
      continueWith: 'Atau lanjutkan dengan'
    },
    article: {
      readMore: 'Baca Selengkapnya',
      comments: 'Komentar',
      likes: 'Suka',
      views: 'Dilihat',
      share: 'Bagikan',
      save: 'Simpan',
      saved: 'Tersimpan',
      published: 'Diterbitkan',
      addComment: 'Tambahkan komentar',
      postComment: 'Kirim Komentar',
      writeComment: 'Tulis komentar Anda...',
      relatedArticles: 'Artikel Terkait',
      category: 'Kategori',
      tags: 'Tag',
      source: 'Sumber'
    }
  }
};

export function t(key: string, language: 'ENGLISH' | 'INDONESIAN' = 'ENGLISH'): string {
  const keys = key.split('.');
  let result: any = translations[language];
  
  for (const k of keys) {
    if (result && result[k]) {
      result = result[k];
    } else {
      // Fallback to English if the key doesn't exist in the selected language
      let fallback = translations['ENGLISH'];
      for (const fallbackKey of keys) {
        if (fallback && fallback[fallbackKey]) {
          fallback = fallback[fallbackKey];
        } else {
          return key; // Return the key if not found in any language
        }
      }
      return typeof fallback === 'string' ? fallback : key;
    }
  }
  
  return typeof result === 'string' ? result : key;
}