"use client"

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating circles */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-violet-400 to-electric-400 rounded-full opacity-20 animate-float" />
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-emerald-400 to-sunset-400 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-sunset-400 to-violet-400 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-electric-400 to-emerald-400 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "0.5s" }}
      />

      {/* Floating shapes */}
      <div
        className="absolute top-60 left-1/4 w-8 h-8 bg-violet-400 opacity-10 rotate-45 animate-float"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute bottom-60 right-1/4 w-6 h-6 bg-emerald-400 opacity-10 rotate-12 animate-float"
        style={{ animationDelay: "2.5s" }}
      />
    </div>
  )
}
