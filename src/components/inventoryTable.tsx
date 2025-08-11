"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    ChevronDown,
    Columns3,
    MoreHorizontal,
    Plus,
    RefreshCcw,
    SearchIcon,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Combobox } from "./ui/comboBox";
import { addItem, getItems, updateItem, deleteItem } from "@/actions/item.action";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUpload from "./ImageUpload";





// export type InventoryItem = {
//     id: string;
//     name: string;
//     description: string | null;
//     category: string;
//     stock: number;
//     price: number;
//     createdAt: Date;
//     updatedAt: Date;
//     userId: string;
//     imgUrl: string | null;
// };

type Item = Awaited<ReturnType<typeof getItems>>;
interface InventoryTableProps {
    items: Item
}

export const createColumns = (
    setIsEditDialogOpen: (open: boolean) => void,
    setItemToDelete: (item: any) => void,
    setIsDeleteDialogOpen: (open: boolean) => void,
    setEditFormData: (data: any) => void
): ColumnDef<any>[] => [

        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-center"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="text-center font-medium">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "category",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-center"
                    >
                        Category
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="text-center capitalize">{row.getValue("category")}</div>,
        },
        {
            accessorKey: "price",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-center"
                    >
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const price = parseFloat(row.getValue("price"));

                // Format the price as a peso price
                const formatted = new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                }).format(price);

                return <div className="text-center font-medium">{formatted}</div>;
            },
        },
        {
            accessorKey: "stock",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-center"
                    >
                        Stock
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const stock = row.getValue("stock") as number;
                return <div className="text-center font-medium">{stock}</div>;
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const item = row.original as any;

                return (

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                setEditFormData({
                                    id: item.id,
                                    name: item.name,
                                    description: item.description,
                                    category: item.category,
                                    stock: item.stock,
                                    price: item.price,
                                    userId: item.userId,
                                    imgUrl: item.imgUrl
                                });
                                setIsEditDialogOpen(true);
                            }}>Edit item</DropdownMenuItem>


                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                setItemToDelete(item);
                                setIsDeleteDialogOpen(true);
                            }}>Delete item</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];



export default function InventoryTable({ items }: InventoryTableProps) {


    if (!items) {
        return (
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[70px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />

                </div>
            </div>

        );
    }

    const router = useRouter();
    // Add Item state
    const [addFormData, setAddFormData] = useState({
        name: "",
        description: "",
        category: "",
        stock: 0,
        price: 0,
        userId: "",
        imgUrl: ""
    });
    const [isAddSubmitting, setIsAddSubmitting] = useState(false);
    const [addError, setAddError] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Edit Item state
    const [editFormData, setEditFormData] = useState({
        id: "",
        name: "",
        description: "",
        category: "",
        stock: 0,
        price: 0,
        userId: "",
        imgUrl: ""
    });
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);
    const [editError, setEditError] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Delete Item state
    const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    const handleAddChange = (field: string, value: string | number) => {
        setAddFormData(prev => {
            const updated = { ...prev, [field]: value };
            console.log("Updated addFormData:", updated);
            return updated;
        });
        if (addError) setAddError("");
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted with data:", addFormData);

        // Validate required fields
        if (!addFormData.name.trim() || !addFormData.category.trim() || addFormData.stock < 0 || addFormData.price < 0) {
            setAddError("Please fill in all required fields. Stock and price must be non-negative.");
            return;
        }

        setIsAddSubmitting(true);
        setAddError("");

        try {
            const result = await addItem({
                name: addFormData.name.trim(),
                description: addFormData.description.trim(),
                category: addFormData.category,
                stock: Number(addFormData.stock),
                price: Number(addFormData.price),
                imgUrl: addFormData.imgUrl.trim() || undefined
            });

            console.log("addItem result:", result);

            if (result.success) {
                toast.success("An item added successfully! :)")
                // Reset form
                setAddFormData({
                    name: "",
                    description: "",
                    category: "",
                    stock: 0,
                    price: 0,
                    userId: "",
                    imgUrl: ""
                });
                // Close dialog
                setIsAddDialogOpen(false);

                router.refresh();
            } else {
                setAddError(result.error || "Failed to add item");
                toast.error("The Item did not add :(")
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setAddError("An unexpected error occurred. Please try again.");
        } finally {
            setIsAddSubmitting(false);
        }
    }

    const handleEditChange = (field: string, value: string | number) => {
        setEditFormData({ ...editFormData, [field]: value });

        if (editError) setEditError("");
    }

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Edit form submitted with data:", editFormData);

        // Validate required fields
        if (!editFormData.name.trim() || !editFormData.category.trim() || editFormData.stock < 0 || editFormData.price < 0) {
            setEditError("Please fill in all required fields. Stock and price must be non-negative.");
            return;
        }

        setIsEditSubmitting(true);
        setEditError("");

        try {
            const result = await updateItem(editFormData.id, {
                name: editFormData.name,
                description: editFormData.description,
                category: editFormData.category,
                stock: editFormData.stock,
                price: editFormData.price,
                imgUrl: editFormData.imgUrl
            });

            if (result.success) {
                toast.success("Item updated successfully! :)");
                // Reset form
                setEditFormData({
                    id: "",
                    name: "",
                    description: "",
                    category: "",
                    stock: 0,
                    price: 0,
                    userId: "",
                    imgUrl: ""
                });
                // Close dialog
                setIsEditDialogOpen(false);
                router.refresh();
            } else {
                setEditError(result.error || "Failed to update item");
            }
        } catch (error) {
            console.error("Error updating item:", error);
            setEditError("An unexpected error occurred. Please try again.");
        } finally {
            setIsEditSubmitting(false);
        }
    }

    const handleDeleteItem = async () => {
        setIsAddSubmitting(true);
        if (!itemToDelete) return;

        try {
            const result = await deleteItem(itemToDelete.id);

            if (result.success) {
                toast.success("Item deleted successfully! :)");
                setIsDeleteDialogOpen(false);
                setItemToDelete(null);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to delete item");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
        } finally {
            setIsDeleteSubmitting(false);
        }
    }


    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchQuery, setSearchQuery] = React.useState<string>();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [selectedCategory, setSelectedCategory] = React.useState("");

    // Filter items based on search term and selected category
    const filteredItems = React.useMemo(() => {
        if (!items?.success || !items?.userItems) return [];

        return items.userItems.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "" || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [items?.success, items?.userItems, searchTerm, selectedCategory]);

    const columns = createColumns(setIsEditDialogOpen, setItemToDelete, setIsDeleteDialogOpen, setEditFormData);
    const table = useReactTable({

        data: filteredItems,
        columns: columns as ColumnDef<typeof filteredItems[0]>[],
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });
    return (
        <div className="w-full">
            <div className="flex items-center gap-2 py-4">
                <Input
                    placeholder="Filter names..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Combobox
                    value={selectedCategory}
                    onChange={(val) => setSelectedCategory(val)}
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <Columns3 className="mr-2 h-4 w-4" /> Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <div className="relative">
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                                placeholder="Search"
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                            <SearchIcon className="absolute inset-y-0 my-auto left-2 h-4 w-4" />
                        </div>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                if (
                                    searchQuery &&
                                    !column.id.toLowerCase().includes(searchQuery.toLowerCase())
                                ) {
                                    return null;
                                }

                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                table.resetColumnVisibility();
                                setSearchQuery("");
                            }}
                        >
                            <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                    setIsAddDialogOpen(open);
                    if (!open) {
                        // Reset form and clear errors when dialog closes
                        setAddFormData({
                            name: "",
                            description: "",
                            category: "",
                            stock: 0,
                            price: 0,
                            userId: "",
                            imgUrl: ""
                        });
                        setAddError("");
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsAddDialogOpen(true)}> <span> <Plus /> </span> Add Item</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Item</DialogTitle>
                            <DialogDescription>
                                Add new Item here. Click save when you&apos;re
                                done.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Item Name</Label>
                                    <Input id="name" type="text" value={addFormData.name} onChange={(e) => handleAddChange("name", e.target.value)} placeholder="Spatula" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" value={addFormData.description} onChange={(e) => handleAddChange("description", e.target.value)} placeholder="Say something about the item..." />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="category">Category</Label>
                                    <Combobox value={addFormData.category} onChange={(value) => handleAddChange("category", value)} />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex justify-between">
                                        <div className="flex flex-col">
                                            <Label htmlFor="stock" className="pb-3">Stock</Label>
                                            <Input id="stock" type="number" value={addFormData.stock} onChange={(e) => handleAddChange("stock", e.target.value)} placeholder="0" />
                                        </div>
                                        <div className="flex flex-col">
                                            <Label htmlFor="price" className="pb-3">Price</Label>
                                            <Input id="price" type="number" value={addFormData.price} onChange={(e) => handleAddChange("price", e.target.value)} placeholder="0.00" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-3 mb-3">
                                    <Label htmlFor="category">Upload your Image</Label>

                                    <ImageUpload
                                        endpoint="postImage"
                                        value={addFormData.imgUrl}
                                        onChange={(url) => handleAddChange("imgUrl", url)}
                                    />
                                </div>

                                {addError && <p className="text-red-500 text-sm">{addError}</p>}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={isAddSubmitting}>
                                    {isAddSubmitting ? "Adding..." : "Add"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>

            <div className="rounded-md border">
                <Table >
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const item = row.original;
                                const sluggedName = item.name.toLowerCase().replace(/\s+/g, "-");
                                const slug = `${item.id}--${sluggedName}`;
                                const itmURL = `/Items/${slug}`;

                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        onClick={() => router.push(itmURL)}
                                        className="cursor-pointer hover:bg-muted/50"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
                setIsEditDialogOpen(open);
                if (!open) {
                    // Reset form and clear errors when dialog closes
                    setEditFormData({
                        id: "",
                        name: "",
                        description: "",
                        category: "",
                        stock: 0,
                        price: 0,
                        userId: "",
                        imgUrl: ""
                    });
                    setEditError("");
                }
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                        <DialogDescription>
                            Edit the item details here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="edit-name">Item Name</Label>
                                <Input id="edit-name" type="text" value={editFormData.name} onChange={(e) => handleEditChange("name", e.target.value)} placeholder="Spatula" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea id="edit-description" value={editFormData.description} onChange={(e) => handleEditChange("description", e.target.value)} placeholder="Say something about the item..." />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="edit-category">Category</Label>
                                <Combobox value={editFormData.category} onChange={(value) => handleEditChange("category", value)} />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex justify-between">
                                    <div className="flex flex-col">
                                        <Label htmlFor="edit-stock" className="pb-3">Stock</Label>
                                        <Input id="edit-stock" type="number" value={editFormData.stock} onChange={(e) => handleEditChange("stock", e.target.value)} placeholder="0" />
                                    </div>
                                    <div className="flex flex-col">
                                        <Label htmlFor="edit-price" className="pb-3">Price</Label>
                                        <Input id="edit-price" type="number" value={editFormData.price} onChange={(e) => handleEditChange("price", e.target.value)} placeholder="0.00" />
                                    </div>

                                </div>
                            </div>
                            <div className="grid gap-3 mb-3">
                                <Label htmlFor="category">Upload your Image</Label>

                                <ImageUpload
                                    endpoint="postImage"
                                    value={editFormData.imgUrl}
                                    onChange={(url) => handleAddChange("imgUrl", url)}
                                />
                            </div>
                            {editError && <p className="text-red-500 text-sm">{editError}</p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isEditSubmitting}>
                                {isEditSubmitting ? "Updating..." : "Update"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Item</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this item? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteItem} disabled={isDeleteSubmitting}>
                            {isAddSubmitting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
