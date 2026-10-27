import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CareIcon } from "./CareIcon";
import { CareButton } from "./CareButton";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export const FileUpload = ({
  files,
  onChange,
  error,
  onError,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
  onError: (message: string) => void;
}) => {
  const { t } = useTranslation("translations");
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const addFiles = (selected: FileList | null) => {
    const next = Array.from(selected ?? []);
    if (!next.length) return;
    if (
      files.length + next.length > 3 ||
      next.some(
        (file) =>
          !allowedTypes.has(file.type) ||
          file.size === 0 ||
          file.size > MAX_FILE_SIZE,
      )
    ) {
      onError(t("care.fileError"));
      return;
    }
    onChange([...files, ...next]);
  };
  return (
    <div>
      <div
        className={`care-dropzone ${dragging ? "is-dragging" : ""} ${error ? "has-error" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <span className="care-upload-symbol">
          <CareIcon name="upload" />
        </span>
        <p className="care-drop-title">{t("care.dropFiles")}</p>
        <p className="care-muted" id="file-hint">
          {t("care.fileTypes")}
        </p>
        <input
          ref={input}
          id="prescription-files"
          data-testid="prescription-files"
          className="care-sr-only"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf,.heic,.heif"
          tabIndex={-1}
          aria-label={t("care.chooseFiles")}
          aria-describedby={`file-hint${error ? " file-error" : ""}`}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <CareButton
          variant="secondary"
          icon="add"
          onClick={() => input.current?.click()}
        >
          {t("care.chooseFiles")}
        </CareButton>
      </div>
      {error && (
        <p className="care-error" id="file-error" role="alert">
          {error}
        </p>
      )}
      <ul className="care-file-list" aria-live="polite">
        {files.map((file, index) => (
          <li className="care-attached-file" key={`${file.name}-${index}`}>
            <CareIcon name="document" />
            <div className="min-w-0 flex-1">
              <p className="break-words">{file.name}</p>
              <span className="care-muted" dir="ltr">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
            <button
              type="button"
              className="care-icon-button"
              aria-label={t("care.removeFile", { name: file.name })}
              onClick={() => onChange(files.filter((_, i) => i !== index))}
            >
              <CareIcon name="close" />
            </button>
          </li>
        ))}
      </ul>
      <p className="care-privacy-note">
        <CareIcon name="shield" />
        {t("care.sampleOnly")}
      </p>
    </div>
  );
};
