"use client"

type CoreLightProps = {
  className?: string
}

export function CoreLight({
  className = "absolute left-0 right-0 top-0 z-[3] flex h-[100dvh] items-center justify-center",
}: CoreLightProps) {
  return (
    <div className={className}>
      <div className="relative flex items-center justify-center">
        <div
          className="absolute w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full mix-blend-screen"
          style={{
            background: "radial-gradient(circle, #ffffff 10%, #a289ff 50%, transparent 70%)",
            filter: "blur(20px)",
            opacity: 1,
            animation: "breathe 5s ease-in-out infinite",
          }}
        />

        <div
          className="absolute w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-full mix-blend-screen"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(162,137,255,0.4) 40%, transparent 70%)",
            filter: "blur(30px)",
            animation: "breathe 7s ease-in-out infinite",
          }}
        />

        <div
          className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] rounded-full mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(162,137,255,0.15) 30%, transparent 60%)",
            filter: "blur(50px)",
            animation: "breathe 9s ease-in-out infinite",
          }}
        />

        {/* Vertical beam */}
        <div
          className="absolute w-[2px] h-[120vh] opacity-80"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6) 50%, transparent)",
            filter: "blur(4px)",
          }}
        />

        {/* Horizontal beam */}
        <div
          className="absolute w-screen h-[2px] opacity-60"
          style={{
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.6) 50%, transparent)",
            filter: "blur(4px)",
          }}
        />

        <div
          className="absolute w-[400px] sm:w-[800px] md:w-[1200px] h-[40px] sm:h-[60px] md:h-[80px] mix-blend-color-dodge"
          style={{
            background: "radial-gradient(ellipse, rgba(169,142,255,0.5) 0%, transparent 60%)",
            filter: "blur(15px)",
            animation: "rotateSlow 20s linear infinite",
          }}
        />

        <div
          className="absolute w-[300px] sm:w-[500px] md:w-[800px] h-[60px] sm:h-[90px] md:h-[120px] mix-blend-color-dodge"
          style={{
            background: "radial-gradient(ellipse, rgba(200,180,255,0.4) 0%, transparent 60%)",
            filter: "blur(15px)",
            animation: "rotateSlowReverse 25s linear infinite",
          }}
        />
      </div>
    </div>
  )
}
