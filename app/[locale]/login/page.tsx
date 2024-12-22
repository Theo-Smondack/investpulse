'use client';

import { useTranslations } from 'next-intl';

import LoginForm from '@/app/[locale]/login/(ui)/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage = () => {
    const t = useTranslations('login');
    return (
        <div className="flex h-screen">
            <Card className="m-auto w-9/12 md:w-1/3 lg:w-1/4 2xl:w-1/6">
                <CardHeader>
                    <CardTitle>{t('title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
