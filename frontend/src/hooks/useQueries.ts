import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CreativePackage } from '../backend';

export function useGetAllCreativePackages() {
  const { actor, isFetching } = useActor();

  return useQuery<CreativePackage[]>({
    queryKey: ['creativePackages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCreativePackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCreativePackage(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CreativePackage>({
    queryKey: ['creativePackage', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCreativePackage(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSaveCreativePackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      productName: string;
      description: string;
      funnelStage: string;
      tone: string;
      scriptAssets: Array<{ id: string; name: string; content: string; assetType: string }>;
      copyAssets: Array<{ id: string; name: string; content: string; assetType: string }>;
      personaAssets: Array<{ id: string; name: string; content: string; assetType: string }>;
      shotAssets: Array<{ id: string; name: string; content: string; assetType: string }>;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCreativePackage(
        params.id,
        params.productName,
        params.description,
        params.funnelStage,
        params.tone,
        params.scriptAssets,
        params.copyAssets,
        params.personaAssets,
        params.shotAssets
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creativePackages'] });
    },
  });
}
