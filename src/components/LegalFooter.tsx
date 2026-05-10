import React from "react";
import { Link } from "react-router-dom";

export default function LegalFooter() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
      <Link className="underline hover:text-gray-700 transition-colors" to="/privacy">
        Privacy Policy
      </Link>
      <Link className="underline hover:text-gray-700 transition-colors" to="/terms">
        Terms of Use
      </Link>
      <Link className="underline hover:text-gray-700 transition-colors" to="/crisis-disclaimer">
        Crisis Disclaimer
      </Link>
    </div>
  );
}
