import React, { FC, useState } from 'react';

import { Button } from '@/components/ui/button';

interface GenerateNewsButtonProps {
    callback :() => Promise<void>;
}

const GenerateNewsButton : FC<GenerateNewsButtonProps> = ({ callback }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const onClickGenerate = async () => {
        setLoading(true);
        await callback();
        setLoading(false);
    }

    return (
        <Button size="lg" className="md:text-2xl text-xl" onClick={onClickGenerate} loading={loading}>Generate</Button>
    );
};

export default GenerateNewsButton;
