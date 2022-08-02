import * as React from "react";
import PdfIcons from "../../assets/images/icons/PdfIcon.svg";
export default function DownloadContract() {
  return (
    <div>
      <img
        src={PdfIcons}
        className="w-7 h-7 fill-current transform scale-90"
        alt="pdf"
      />
    </div>
  );
}
