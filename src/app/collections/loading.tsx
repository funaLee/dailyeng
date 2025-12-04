export default function CollectionsLoading() {
  return (
    <div className="container mx-auto px-8 py-8">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <div className="h-[600px] bg-slate-200 rounded-xl animate-pulse" />
        </div>
        <div className="lg:col-span-9 space-y-6">
          <div className="h-32 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-16 bg-slate-200 rounded-xl animate-pulse" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
