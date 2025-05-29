
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

const AdminNav: React.FC = () => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) return null;

  return (
    <Button asChild variant="ghost" size="sm">
      <Link to="/admin" className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4" />
        Admin
      </Link>
    </Button>
  );
};

export default AdminNav;
