import { useState } from 'react';
import { History, Package, ChevronRight, PlusCircle, Loader2, Inbox, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllCreativePackages } from '../hooks/useQueries';
import { deserializePackageFromAssets, type CreativePackageData, type FormInputs } from '../utils/creativeGenerator';
import type { CreativePackage } from '../backend';

interface PackageHistoryProps {
  onSelectPackage: (data: CreativePackageData, inputs: FormInputs) => void;
  onNewCreative: () => void;
}

const toneLabels: Record<string, string> = {
  aggressive: 'Aggressive',
  soft: 'Soft Persuasive',
  authority: 'Authority',
  luxury: 'Luxury',
};

const funnelLabels: Record<string, string> = {
  cold: 'Cold',
  warm: 'Warm',
  hot: 'Hot',
};

const funnelColors: Record<string, string> = {
  cold: 'text-blue-400 border-blue-500/30',
  warm: 'text-yellow-400 border-yellow-500/30',
  hot: 'text-brand border-brand/30',
};

export default function PackageHistory({ onSelectPackage, onNewCreative }: PackageHistoryProps) {
  const { data: packages, isLoading, error } = useGetAllCreativePackages();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSelect = (pkg: CreativePackage) => {
    setLoadingId(pkg.id);
    const result = deserializePackageFromAssets(
      pkg.scripts,
      pkg.adCopy,
      pkg.personas,
      pkg.shots,
      pkg.productName,
      pkg.description,
      pkg.funnelStage,
      pkg.tone
    );
    if (result) {
      onSelectPackage(result.data, result.inputs);
    }
    setLoadingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-black text-foreground flex items-center gap-2">
            <History className="w-6 h-6 text-brand" />
            Saved Packages
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {packages ? `${packages.length} creative package${packages.length !== 1 ? 's' : ''} saved` : 'Loading...'}
          </p>
        </div>
        <Button onClick={onNewCreative} className="btn-brand gap-2">
          <PlusCircle className="w-4 h-4" />
          New Creative
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-panel">
              <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-72" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="card-panel text-center py-10">
          <p className="text-destructive text-sm">Failed to load packages. Please try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && (!packages || packages.length === 0) && (
        <div className="card-panel text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-brand/60" />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground mb-2">No saved packages yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Generate your first creative package and save it to see it here.
          </p>
          <Button onClick={onNewCreative} className="btn-brand gap-2">
            <PlusCircle className="w-4 h-4" />
            Create Your First Package
          </Button>
        </div>
      )}

      {/* Package list */}
      {!isLoading && packages && packages.length > 0 && (
        <div className="space-y-3">
          {packages.map(pkg => (
            <button
              key={pkg.id}
              onClick={() => handleSelect(pkg)}
              disabled={loadingId === pkg.id}
              className="w-full text-left card-panel hover:border-brand/40 hover:bg-surface-2/80 transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand/15 flex items-center justify-center flex-shrink-0 group-hover:bg-brand/25 transition-colors">
                  <Package className="w-5 h-5 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-bold text-base text-foreground truncate">
                      {pkg.productName}
                    </h3>
                    {loadingId === pkg.id ? (
                      <Loader2 className="w-4 h-4 text-brand animate-spin flex-shrink-0 mt-0.5" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {pkg.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`text-xs ${funnelColors[pkg.funnelStage] ?? 'text-muted-foreground border-border/50'}`}
                    >
                      {funnelLabels[pkg.funnelStage] ?? pkg.funnelStage}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">
                      {toneLabels[pkg.tone] ?? pkg.tone}
                    </Badge>
                    <span className="text-xs text-muted-foreground/60">
                      ID: {pkg.id.slice(0, 16)}...
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
