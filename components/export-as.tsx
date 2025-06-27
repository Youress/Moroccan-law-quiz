"use client";

import { Download } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  submissionId: string;
};

const ExportAs = ({ submissionId }: Props) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      <Button
        variant="outline"
        onClick={() =>
          window.open(`/api/export/pdf/${submissionId}`, "_blank")
        }
      >
        <Download className="ml-2 h-4 w-4" />
        تصدير PDF
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          window.open(`/api/export/word/${submissionId}`, "_blank")
        }
      >
        <Download className="ml-2 h-4 w-4" />
        تصدير Word
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          window.open(`/api/export/csv/${submissionId}`, "_blank")
        }
      >
        <Download className="ml-2 h-4 w-4" />
        تصدير CSV
      </Button>
    </div>
  );
};

export default ExportAs;
