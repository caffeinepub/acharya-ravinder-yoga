import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useGetTotalEnrollments() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalEnrollments"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalEnrollments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitEnrollment() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitEnrollment(data.name, data.email, data.phone);
    },
  });
}
