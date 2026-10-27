import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CareIcon } from "./CareIcon";

const FileLink = ({ file }: { file: File }) => {
  const { t } = useTranslation("translations");
  const [url, setUrl] = useState("");
  useEffect(() => {
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  return (
    <a
      className="care-file-link"
      href={url || undefined}
      download={file.name}
      aria-label={t("care.downloadFile", { name: file.name })}
    >
      <CareIcon name="document" />
      <span className="min-w-0 flex-1 break-words">{file.name}</span>
      <span className="care-muted" dir="ltr">
        {(file.size / 1024 / 1024).toFixed(1)} MB
      </span>
    </a>
  );
};

export const RequestFiles = ({ files }: { files: File[] }) => {
  const { t } = useTranslation("translations");
  return files.length ? (
    <ul className="care-file-list">
      {files.map((file, index) => (
        <li key={`${file.name}-${index}`}>
          <FileLink file={file} />
        </li>
      ))}
    </ul>
  ) : (
    <p className="care-muted">{t("care.sampleFile")}</p>
  );
};
