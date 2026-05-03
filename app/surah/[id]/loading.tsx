export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto p-6 pb-24 animate-pulse">
      {/* Header Skeleton */}
      <div className="relative py-12 mb-16 border-b border-gray-100 dark:border-gray-800/50 flex flex-col items-center">
        <div className="w-48 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
        <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>

      {/* Ayah Card Skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-10 mb-10 rounded-2xl bg-white dark:bg-[#1f1f1f] border border-gray-100 dark:border-gray-800/50 flex gap-12">
          <div className="flex flex-col items-center gap-8 shrink-0">
            <div className="w-12 h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="flex flex-col gap-6">
              <div className="w-7 h-7 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="space-y-4 mb-14">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full ml-auto"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 ml-auto"></div>
            </div>
            <div className="pt-8 border-t border-gray-50 dark:border-gray-800/30">
              <div className="w-24 h-3 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mt-2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
