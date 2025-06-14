import type { Company } from "../types/Company";

export const CompanyCard = ({
  company,
  isLast,
  ref: forwardedRef,
}: {
  company: Company;
  isLast: boolean;
  ref?: (node: HTMLAnchorElement | null) => void;
}) => {
  return (
    <a
      href={company.websiteurl}
      target="_blank"
      rel="noopener noreferrer"
      ref={isLast ? forwardedRef : null}
      className="flex gap-4 items-start bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition duration-200"
    >
      <img
        src={company.logourl}
        alt={company.companyname}
        className="w-16 h-16 object-contain rounded-lg bg-gray-50"
        onError={(e) => {
          e.currentTarget.src =
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNGM0Y0RjYiLz48dGV4dCB4PSIzMiIgeT0iMzgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Q0EzQUYiIGZvbnQtc2l6ZT0iMTIiPk5vIExvZ288L3RleHQ+PC9zdmc+";
        }}
      />
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">{company.companyname}</h2>
        <p className="text-sm text-gray-600">{company.location}</p>
        <p className="text-sm mt-1 line-clamp-3">{company.description}</p>
        <p className="text-xs text-gray-400 mt-2">
          Joined: {new Date(company.created_at).toLocaleDateString()}
        </p>
      </div>
    </a>
  );
};
