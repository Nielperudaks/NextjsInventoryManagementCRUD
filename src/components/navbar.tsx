import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { HomeIcon, LogOut, User, Warehouse } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import { stackServerApp } from '@/stack'
import { getUserDetails } from '@/actions/user.actions'
import { UserButton } from '@stackframe/stack'


async function navbar() {

    const user = await stackServerApp.getUser();
    const app = stackServerApp.urls;
    const userProfile = await getUserDetails(user?.id);
    return (
        <nav className='sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Link href='/' className='text-2xl font-bold text-primary font-mono tracking-wider'>
                        StoreIt
                    </Link>



                    {/* Navigation */}
                    <div className='hidden md:flex items-center space-x-4'>
                        <ModeToggle />
                        <Button variant='ghost' asChild>
                            <Link href='/Items'>
                                <Warehouse className='w-4 h-4 mr-2' />
                                <span className='hidden md:inline'>Items</span>
                            </Link>
                        </Button>
                        <Button variant='ghost' asChild>
                            <Link href='/'>
                                <HomeIcon className='w-4 h-4 mr-2' />
                                <span className='hidden md:inline'>Home</span>
                            </Link>
                        </Button>

                        {user ? (<>
                            {/*Sign out*/}
                            <Button variant='ghost' asChild>
                                <Link href={app.signOut}>
                                    <LogOut className='w-4 h-4 mr-2' />
                                    <span className='hidden md:inline'>Sign Out</span>
                                </Link>
                            </Button>
                        </>) : (<>
                            {/*Sign In*/}
                            <Button variant='ghost' asChild>
                                <Link href={app.signIn}>
                                    <User className='w-4 h-4 mr-2' />
                                    <span className='hidden md:inline'>Sign In</span>
                                </Link>
                            </Button>
                        </>)}

                        <UserButton />


                    </div>
                </div>
            </div>
        </nav>
    )
}

export default navbar