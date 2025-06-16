import { BookmarkButton } from "./BookmarkButton";
import type { Company } from "../types/Company";

export const CompanyCard = ({
  company,
  isLast,
  ref: forwardedRef,
  onBookmarkToggle,
  isBookmarked,
}: {
  company: Company;
  isLast: boolean;
  ref?: (node: HTMLDivElement | null) => void;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string, state: boolean) => void;
}) => {
  return (
    <div
      ref={isLast ? forwardedRef : undefined}
      className="flex gap-4 items-start bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition duration-200"
    >
      <a
        href={company.websiteurl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0"
      >
        <img
          src={company.logourl}
          alt={company.companyname}
          className="w-16 h-16 object-contain rounded-lg bg-gray-50"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml;base64,...";
          }}
        />
      </a>

      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{company.companyname}</h2>
          <BookmarkButton
            companyId={company.id}
            isBookmarkedInitial={isBookmarked}
            onToggle={onBookmarkToggle}
          />
        </div>
        <p className="text-sm text-gray-600">{company.location}</p>
        <p className="text-sm mt-1 line-clamp-3">{company.description}</p>
        <p className="text-xs text-gray-400 mt-2">
          Joined: {new Date(company.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
