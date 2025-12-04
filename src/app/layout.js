import '../styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';


export const metadata = {
  title: "G&R Control Hub",
  description: "Best app ever 🚀",
  icons: {
   // icon: "/Nas-Logo.svg", // <-- place your custom favicon in /public/myicon.png
     icon: "fav-g.ico",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="min-h-screen bg-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
