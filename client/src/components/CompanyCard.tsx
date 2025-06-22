import { BookmarkButton } from "./BookmarkButton";
import type { Company } from "../types/Company";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";

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
    <Card
      ref={isLast ? forwardedRef : undefined}
      className="hover:shadow-md transition duration-200"
    >
      <CardContent className="flex gap-4 items-start p-4">
        {/* Logo */}
        <a
          href={company.websiteurl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0"
        >
          <Avatar className="w-16 h-16 rounded-lg">
            <AvatarImage
              src={company.logourl}
              alt={company.companyname}
              className="object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZGRkZGRkIiByeD0iMTIiLz48L3N2Zz4=";
              }}
            />
            <AvatarFallback>
              {company.companyname?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </a>

        {/* Company Info */}
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">
              {company.companyname}
            </Label>
            <BookmarkButton
              companyId={company.id}
              isBookmarkedInitial={isBookmarked}
              onToggle={onBookmarkToggle}
            />
          </div>

          <Label className="text-sm opacity-70">{company.location}</Label>
          <Label className="text-sm mt-1 line-clamp-3">
            {company.description}
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};
