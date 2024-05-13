import { users } from "@/app/constants/users";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({data: users}, {status: 201});
}
