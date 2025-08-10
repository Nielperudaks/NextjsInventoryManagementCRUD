import InventoryTable from '@/components/inventoryTable';
import { stackServerApp } from '@/stack';
import {  SignUp } from '@stackframe/stack';
import React from 'react'
import { getItems } from '@/actions/item.action';

async function page() {
    const user = await stackServerApp.getUser();
    
    // Fetch items for the current user
    const items = await getItems("");
    
  return (
    <>
        {user ? (
            <div className="mt-7 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-10 gap 6">
           
                <div className="lg:col-span-full">
                    <InventoryTable items={items} />
                </div>
            </div>
            

        ) : (
            <div className="flex justify-center items-center mt-20">
                <SignUp></SignUp>
            </div>
            
        )}
    </>
  )
}

export default page