import { useQuery } from "@tanstack/react-query";
import { useStatus } from "../contexts/status.context";
import { errorString } from "../utils";
import { fetchConfig } from "../requests/config";
import { useConfig } from "../contexts/config.context";

export const useAttempt = <T extends (...args: any) => Promise<void>>(fn: T) => {
  const { setStatus } = useStatus();

  return (...args: Parameters<T>): Promise<void> => {
      setStatus('fetching');

      return fn(...args)
        .then(() => setStatus('success'))
        .catch((e) => setStatus('error', errorString(e)))
  }
}

export const useFetchConfig = () => {
  const { apiUrl } = useConfig();

  const { data, isFetching } = useQuery({
    queryKey: ['config'],
    queryFn: () => fetchConfig(apiUrl),
  });

  return { config: data, isFetchingConfig: isFetching };
}
