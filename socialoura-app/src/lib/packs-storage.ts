import { prisma } from './prisma';

// Read all packs from database
export async function readPacks() {
  try {
    const packs = await prisma.pack.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return packs;
  } catch (error) {
    console.error('Error reading packs:', error);
    return [];
  }
}

// Add a pack to database
export async function addPack(pack: any) {
  try {
    const newPack = await prisma.pack.create({
      data: {
        platform: pack.platform,
        type: pack.type,
        quantity: pack.quantity,
        price: pack.price,
      },
    });
    return newPack;
  } catch (error) {
    console.error('Error adding pack:', error);
    throw error;
  }
}

// Update a pack in database
export async function updatePack(id: string, updateData: any) {
  try {
    const updatedPack = await prisma.pack.update({
      where: { id },
      data: {
        platform: updateData.platform,
        type: updateData.type,
        quantity: updateData.quantity,
        price: updateData.price,
      },
    });
    return updatedPack;
  } catch (error) {
    console.error('Error updating pack:', error);
    return null;
  }
}

// Delete a pack from database
export async function deletePack(id: string): Promise<boolean> {
  try {
    await prisma.pack.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error('Error deleting pack:', error);
    return false;
  }
}
