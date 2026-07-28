export default function DashboardLoading() {
  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full items-start animate-pulse">
      {/* Main Left Area */}
      <div className="flex-1 w-full flex flex-col gap-6 min-w-0">
        {/* SoftTopCards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="h-32 bg-secondary/40 rounded-3xl w-full border border-border/20 shadow-sm"></div>
          <div className="h-32 bg-secondary/40 rounded-3xl w-full border border-border/20 shadow-sm"></div>
        </div>
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 w-full">
          {/* SoftTransactionsTable Skeleton */}
          <div className="h-[400px] bg-secondary/40 rounded-3xl w-full border border-border/20 shadow-sm"></div>
          
          {/* SoftBreakdown Skeleton */}
          <div className="h-[300px] bg-secondary/40 rounded-3xl w-full border border-border/20 shadow-sm"></div>
        </div>
      </div>

      {/* Right Sidebar Area */}
      <div className="w-full xl:w-[350px] 2xl:w-[400px] shrink-0 flex flex-col gap-6">
        {/* SoftRightPanel Skeleton */}
        <div className="h-[480px] bg-secondary/40 rounded-3xl w-full border border-border/20 shadow-sm"></div>
        {/* SoftCommunication Skeleton */}
        <div className="h-[250px] bg-secondary/40 rounded-3xl w-full border border-border/20 shadow-sm"></div>
      </div>
    </div>
  )
}
