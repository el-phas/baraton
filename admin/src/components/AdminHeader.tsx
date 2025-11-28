import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  admin: any;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ admin, onLogout }) => (
  <div className="bg-white shadow-sm border-b">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
          <h1 className="text-2xl font-bold text-hotel-navy">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Welcome, {admin?.name}</span>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default AdminHeader;
