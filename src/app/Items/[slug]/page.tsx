import React from 'react'
import ItemCard from './itemCard'
import { getItemById } from '@/actions/item.action'
import { notFound } from 'next/navigation'
import { getUserID } from '@/actions/user.actions'
import { SignIn, SignUp } from '@stackframe/stack'

interface PageProps {
  params: {
    slug: string
  }
}

async function Page({ params }: PageProps) {
  // Extract the item ID from the slug (format: "id--name")
  const itemId = params.slug.split('--')[0];
  
  const result = await getItemById(itemId);
  const user = await getUserID();
  if(!user){
    return <SignIn/>
  }
  
  if (!result.success || !result.item) {
    notFound();
  }

  return (
    <div className="mt-7 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-10 gap 6">
      <div className="lg:col-span-full">
        <ItemCard item={result.item} />
      </div>
    </div>
  )
}

export default Page