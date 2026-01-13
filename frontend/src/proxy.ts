import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function getCanonicalSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://liveforexstrength.com").replace(/\/+$/, "");
}

export function proxy(req: NextRequest) {
  // Keep local dev predictable (avoid redirecting localhost -> production domain).
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const canonical = new URL(getCanonicalSiteUrl());
  const currentHost = req.headers.get("host");
  if (!currentHost) return NextResponse.next();

  // `Host` can include port (e.g. 161.97.106.190:3105).
  const currentHostNoPort = currentHost.split(":")[0];
  if (currentHostNoPort === canonical.hostname) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.protocol = canonical.protocol;
  url.hostname = canonical.hostname;
  url.port = ""; // canonical host should not include custom ports
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

