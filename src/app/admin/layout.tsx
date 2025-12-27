import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getProfile } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile || profile.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader user={profile} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
