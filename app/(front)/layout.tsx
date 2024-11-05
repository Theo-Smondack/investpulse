import React from 'react';

import NavBar from '@/app/(front)/(ui)/nav-bar';
import { LayoutProps } from '@/types';

const FrontLayout = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col justify-between min-h-screen">
            <header>
                <NavBar />
            </header>
            <div className="flex-1 flex flex-col justify-center">{children}</div>
        </div>
    );
};

export default FrontLayout;
