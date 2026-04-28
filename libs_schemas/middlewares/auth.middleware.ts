import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "#utils-types/utils/jwt";
import { prisma } from "#utils-types/utils/db";
import { getUserPermissions, type Resources } from "../abac/engine";
import { User } from "#/prisma/generated/prisma/client";

// Helper type to extract the 'can' method from UserPermissions
type PermissionChecker = Awaited<ReturnType<typeof getUserPermissions>>;

export async function extractUserFromRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    let token: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else {
      token = request.cookies.get("access_token")?.value || null;
    }

    if (!token) {
      return null;
    }

    const payload = await verifyJWT(token);
    if (!payload || typeof payload.id !== "string") {
      return null;
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        menteeProfile: true,
        mentorProfile: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function checkPermission<Res extends keyof Resources>(
  userId: string,
  resource: Res,
  action: Resources[Res]["action"],
  condition?: Resources[Res]["condition"],
): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(userId);
    //can user perform the action
    return permissions.can(resource, action, condition);
  } catch {
    return false;
  }
}

//authorize user
export async function requirePermission<Res extends keyof Resources>(
  userId: User["id"],
  resource: Res,
  action: Resources[Res]["action"],
  condition?: Resources[Res]["condition"],
) {
  const isAllowed = await checkPermission(userId, resource, action, condition);
  if (!isAllowed) {
    throw new Error("not allowed to perform this action on this resource");
  }
  return isAllowed; // you can continue execution
}

//Authenticate user
export async function requireAuth(request: NextRequest) {
  const user = await extractUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  //return authenticated user
  return { user };
}
