import { useTranslations } from 'next-intl';
import React, { FC, useState } from 'react';

import { Button } from '@/components/ui/button';

interface GenerateNewsButtonProps {
    callback :() => Promise<void>;
}

const GenerateNewsButton : FC<GenerateNewsButtonProps> = ({ callback }) => {
    const t = useTranslations();
    const [loading, setLoading] = useState<boolean>(false);

    const onClickGenerate = async () => {
        setLoading(true);
        await callback();
        setLoading(false);
    }

    return (
        <Button
            size="lg"
            className="text-xl md:text-2xl"
            onClick={onClickGenerate}
            loading={loading}
        >
            {t('home.button.generate')}
        </Button>
    );
};

export default GenerateNewsButton;
