import storage from "react-secure-storage";

// Preserve the package's encrypted data across both Babel and Node-style CJS interop.
const secureStorage: typeof storage =
  "getItem" in storage
    ? storage
    : (storage as unknown as { default: typeof storage }).default;

export default secureStorage;
