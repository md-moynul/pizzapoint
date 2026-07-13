import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const DashboardLayout = ({children }: Readonly<{
  children: React.ReactNode;
}>) => {
    return (
        <div className="flex ">
            <DashboardSidebar />
            <main className="flex-1">
            {children}
            </main>
        </div>
    );
};

export default DashboardLayout;