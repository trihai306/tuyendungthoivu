import { apiClient } from "./api";

export interface UploadResponse {
  url: string;
  path: string;
  filename: string;
  original_name: string;
  size: number;
}

/**
 * Upload a file to the server.
 * @param file - The file to upload
 * @param folder - Target folder: "avatars" | "id-cards" | "documents"
 */
export async function uploadFile(
  file: File,
  folder: string = "uploads",
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await apiClient.post<UploadResponse>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

/**
 * Delete a previously uploaded file.
 */
export async function deleteFile(path: string): Promise<void> {
  await apiClient.delete("/upload", { data: { path } });
}
