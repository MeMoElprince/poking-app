/* eslint-disable react/prop-types */

// Generic shimmer block
export default function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

// Friend-list row placeholders for LeftSection
export function FriendListSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-5 p-2">
          <Skeleton className="min-w-[50px] h-[50px] !rounded-full" />
          <div className="flex flex-col justify-center gap-2 flex-grow">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Chat message placeholders, alternating sides with varied widths
const BUBBLE_WIDTHS = ['w-32', 'w-48', 'w-40', 'w-24', 'w-56', 'w-36', 'w-44'];

export function ChatSkeleton({ rows = 7 }) {
  return (
    <div className="flex flex-col gap-4 px-4 py-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`flex ${i % 2 ? 'justify-end' : 'justify-start'}`}>
          <Skeleton className={`h-9 ${BUBBLE_WIDTHS[i % BUBBLE_WIDTHS.length]}`} />
        </div>
      ))}
    </div>
  );
}
