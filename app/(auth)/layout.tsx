import SideNav from '@/app/ui/sidenav';
import Footer from '@/app/ui/footer'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <div className="flex h-screen flex-col lg:flex-row bg-gray-100">
      {/* SideNav */}
      <div className="w-full flex-none lg:w-64">
        <SideNav />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-grow lg:overflow-hidden">
        {/* Scrolling Content */}
        <div className="flex-grow overflow-y-auto">
          {children}
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </div>

  );

}
