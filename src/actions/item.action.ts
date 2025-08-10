"use server";

import prisma from "@/lib/prisma";
import { getUserID } from "./user.actions";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";

export async function getItems(searchTerm: string ){
    try{
        const currentUserID = await getUserID();
        
        if (!currentUserID) {
            return { success: false, userItems: [] };
        }
        
        const whereClause: {
            userId: string;
            name?: {
                contains: string;
                mode: "insensitive";
            };
        } = {
            userId: currentUserID,
        }
        if(searchTerm){
            whereClause.name = {
                contains: searchTerm,
                mode: "insensitive"
            };
        }
        const userItems = await prisma.items.findMany({
            where:whereClause
        })

        revalidatePath("/");
        return {success: true, userItems}

    }catch(error){
        console.log(error);
        return { success: false, userItems: [] };
    }
}

export async function getItemById(itemId: string) {
    try {
        const item = await prisma.items.findUnique({
            where: {
                id: itemId
            }
        });
        
        if (!item) {
            return { success: false, item: null };
        }
        
        return { success: true, item };
    } catch (error) {
        console.log(error);
        return { success: false, item: null };
    }
}
export async function addItem(data: {
    name: string;
    description: string;
    category: string;
    stock: number;
    price: number;
    imgUrl?: string;
}){
    try{
        console.log("addItem called with data:", data);
        
        const currentUserID = await getUserID();
        console.log("Current user ID:", currentUserID);
        
        if(!currentUserID) {
            console.log("No user ID found, throwing error");
            throw new Error("User not authenticated");
        }
        
        console.log("Creating item with data:", {
            ...data,
            userId: currentUserID,
            imgUrl: data.imgUrl || null
        });
        
        const newItem = await prisma.items.create({
            data: {
                ...data,
                userId: currentUserID,
                imgUrl: data.imgUrl || null
            }
        });
        
        console.log("Item created successfully:", newItem);
        
        revalidatePath("/");
        revalidatePath("/Items");
        return { success: true, item: newItem };
    }catch(error){
        console.error("Error adding item:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: data
        });
        return { success: false, error: error instanceof Error ? error.message : "Failed to add item" };
    }
}

export async function updateItem(itemId: string, data: {
    name: string;
    description: string;
    category: string;
    stock: number;
    price: number;
    imgUrl?: string;
}) {
    try {
        console.log("updateItem called with itemId:", itemId, "and data:", data);
        
        const currentUserID = await getUserID();
        if (!currentUserID) {
            throw new Error("User not authenticated");
        }

        // First check if the item exists and belongs to the current user
        const existingItem = await prisma.items.findFirst({
            where: {
                id: itemId,
                userId: currentUserID
            }
        });

        if (!existingItem) {
            throw new Error("Item not found or you don't have permission to edit it");
        }

        // Update the item
        const updatedItem = await prisma.items.update({
            where: {
                id: itemId
            },
            data: {
                name: data.name,
                description: data.description,
                category: data.category,
                stock: data.stock,
                price: data.price,
                imgUrl: data.imgUrl || null
            }
        });

        console.log("Item updated successfully:", updatedItem);
        
        revalidatePath("/");
        revalidatePath("/Items");
        return { success: true, item: updatedItem };
    } catch (error) {
        console.error("Error updating item:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to update item" };
    }
}

export async function deleteItem(itemId: string) {
    try {
        console.log("deleteItem called with itemId:", itemId);
        
        const currentUserID = await getUserID();
        if (!currentUserID) {
            throw new Error("User not authenticated");
        }

        // First check if the item exists and belongs to the current user
        const existingItem = await prisma.items.findFirst({
            where: {
                id: itemId,
                userId: currentUserID
            }
        });

        if (!existingItem) {
            throw new Error("Item not found or you don't have permission to delete it");
        }

        // Delete the item
        const deletedItem = await prisma.items.delete({
            where: {
                id: itemId
            }
        });

        console.log("Item deleted successfully:", deletedItem);
        
        revalidatePath("/");
        revalidatePath("/Items");
        return { success: true, item: deletedItem };
    } catch (error) {
        console.error("Error deleting item:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete item" };
    }
}