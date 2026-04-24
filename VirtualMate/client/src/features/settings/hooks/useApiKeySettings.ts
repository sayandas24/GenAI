import { useMutation } from "@tanstack/react-query";
import { getApiKeyAPI, updateApiKeyAPI } from "../services/settings.api";

/** Password-gated — reveals the current API key */
export const useGetApiKey = () =>
  useMutation({ mutationFn: getApiKeyAPI });

/** Password-gated — updates the API key in the DB */
export const useUpdateApiKey = () =>
  useMutation({ mutationFn: updateApiKeyAPI });
