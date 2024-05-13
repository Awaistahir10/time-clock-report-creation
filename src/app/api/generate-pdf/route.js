import { NextResponse } from "next/server";
import { users } from "@/app/constants/users";

export async function GET() {
  return NextResponse.json({data: users}, {status: 201});
}
