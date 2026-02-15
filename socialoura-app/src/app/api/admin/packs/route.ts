import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readPacks, addPack, updatePack, deletePack } from "@/lib/packs-storage";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('admin-auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const packs = await readPacks();
    return NextResponse.json({ packs });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('admin-auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pack = await request.json();
    
    // Validate pack data
    if (!pack.platform || !pack.type || !pack.quantity || !pack.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newPack = await addPack(pack);

    return NextResponse.json({ success: true, pack: newPack });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('admin-auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Pack ID required" },
        { status: 400 }
      );
    }

    const deleted = await deletePack(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Pack not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('admin-auth');
    
    if (!authCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Pack ID required" },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    
    // Validate update data
    if (!updateData.platform || !updateData.type || !updateData.quantity || !updateData.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedPack = await updatePack(id, {
      platform: updateData.platform,
      type: updateData.type,
      quantity: updateData.quantity,
      price: updateData.price,
    });
    
    if (!updatedPack) {
      return NextResponse.json(
        { error: "Pack not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, pack: updatedPack });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
