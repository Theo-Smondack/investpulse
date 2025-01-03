'use client';

import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import CustomTypewriter from '@/components/ui/custom-typewriter';

const LoadingTypewriter: FC = () => {
    const [textVisible, setTextVisible] = useState<boolean>(false);
    const t = useTranslations('home.news-card.typewriter');

    const onCompleteCallback = () => {
        setTextVisible(true);
    };

    return (
        <div className="flex">
            <CustomTypewriter
                typeString={t('fetching')}
                onCompleteCallback={onCompleteCallback}
                hideCursorOnComplete
            />
            {textVisible && <CustomTypewriter strings={'...'} autoStart loop />}
        </div>
    );
};

export default LoadingTypewriter;
