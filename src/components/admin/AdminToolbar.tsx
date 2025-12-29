'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, CheckCircle, XCircle, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AdminToolbarProps {
  selectedCount: number;
  onBulkApprove: () => void;
  onBulkSuspend: () => void;
  onBulkFeature: () => void;
  onClearSelection: () => void;
  isProcessing: boolean;
}

export function AdminToolbar({
  selectedCount,
  onBulkApprove,
  onBulkSuspend,
  onBulkFeature,
  onClearSelection,
  isProcessing,
}: AdminToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  // Update search value when URL changes
  useEffect(() => {
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    router.push(`/admin/artists?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/admin/artists?${params.toString()}`);
  };

  return (
    <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search artists by name..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 bg-[var(--color-teal)]/5 px-4 py-2 rounded-lg">
          <span className="text-sm font-medium text-[var(--color-teal)]">
            {selectedCount} selected
          </span>
          <div className="h-4 w-px bg-gray-300" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkApprove}
            disabled={isProcessing}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkSuspend}
            disabled={isProcessing}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Suspend
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkFeature}
            disabled={isProcessing}
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          >
            <Star className="w-4 h-4 mr-1" />
            Feature
          </Button>
          <div className="h-4 w-px bg-gray-300" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={isProcessing}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
