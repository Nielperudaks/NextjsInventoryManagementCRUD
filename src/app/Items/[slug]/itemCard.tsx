"use client";

import { Button } from "@/components/ui/button";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    stock: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    imgUrl: string | null;
  };
}

export default function ItemCard({ item }: ItemCardProps) {
    if(!item){
       return <h1>No Plant data</h1>;
    }
  const router = useRouter();

  const handleBack = () => {
    router.push('/Items');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          <Image
            src={item.imgUrl || "/placeholder-image.jpg"}
            alt={item.name}
            className="object-cover w-full h-full"
            width={700}
            height={700}
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {item.category}
            </span>           
          </div>

          <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-2xl font-bold">
              ₱{item.price.toFixed(2)}
            </span>
          </div>

          <p className="text-muted-foreground mb-6">
            {item.description || "No description available"}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <div className={`h-2 w-2 rounded-full ${item.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{item.stock > 0 ? 'In Stock' : 'Out of Stock'}</span> 
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button size="lg" className="flex-1">
              Edit
            </Button>
            <Button size="lg" variant="outline" className="flex-1" onClick={handleBack}>
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
