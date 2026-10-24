let capturedImageUri: string | null = null;

export function setCapturedImageUri(uri: string) {
  capturedImageUri = uri;
}

export function getCapturedImageUri() {
  return capturedImageUri;
}

export function clearCapturedImageUri() {
  capturedImageUri = null;
}