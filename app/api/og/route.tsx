import { ImageResponse } from "next/og"
import { cars } from "@/lib/data"

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const carId = searchParams.get("id")

    // Default values
    let title = "Wise | Luxury Vehicles"
    let description = "Find your perfect luxury vehicle at Wise"
    let imageUrl = "https://wjcarsales.com/images/logo.png"

    // If car ID is provided, get car details
    if (carId) {
      const car = cars.find((car) => car.id === carId)
      if (car) {
        title = `${car.year} ${car.make} ${car.model} ${car.trim}`
        description = car.shortDescription
        imageUrl = car.images[0] || "https://wjcarsales.com/images/logo.png"
      }
    }

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          fontSize: 32,
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          padding: 40,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Car Image"
            width={400}
            height={225}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        </div>
        <h1 style={{ fontSize: 48, fontWeight: "bold", marginBottom: 12 }}>{title}</h1>
        <p style={{ fontSize: 24, color: "#666", maxWidth: 800, textAlign: "center" }}>{description}</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 40,
            padding: "12px 24px",
            background: "#10b981",
            color: "white",
            borderRadius: 8,
            fontWeight: "bold",
          }}
        >
          View Details at Wise
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e) {
    console.error(e)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
