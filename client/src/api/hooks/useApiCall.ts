// --- lib ---
import { useCallback, useState } from "react";

// --- types ---
type UseApiCallOptions = {
  onSuccess?: (response: any) => void;
};

// #### Universal hook for making API calls ###
const useApiCall = <T, P = void>(
  apiFunc: (params: P) => Promise<T>,
  options?: UseApiCallOptions
) => {
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isError, setIsError] = useState<boolean>(false); // Error state
  const [messageCode, setMessageCode] = useState<string | null>(null); // Server message code
  const [errorData, setErrorData] = useState<Record<string, string> | null>(
    null
  ); // Additional error data (fields)

  // --- Execute the API call ---
  const execute = useCallback(
    async (params: P) => {
      setIsLoading(true);
      setIsError(false);
      setMessageCode(null);

      try {
        const response = await apiFunc(params);

        if (options?.onSuccess) options.onSuccess(response);

        return response;
      } catch (err) {
        setIsError(true);
        if (err?.response?.data?.messageCode) {
          setMessageCode(err.response.data.messageCode);
          setErrorData(err.response.data.data || null);
        } else {
          setMessageCode("SERVER_UNREACHABLE");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunc, options]
  );

  // --- Reset states ---
  const reset = () => {
    setIsError(false);
    setMessageCode(null);
    setIsLoading(false);
  };

  return { execute, isLoading, isError, messageCode, reset };
};
export default useApiCall;
