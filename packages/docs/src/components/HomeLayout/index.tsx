import React from 'react';
import { Link, Outlet, useAppState } from 'servite/client';
import { Mdx } from '../Mdx';
import { Footer } from '../Footer';
import { Button } from '../Button';

interface HomePageMeta {
  heroImage?: string;
  heroText?: React.ReactNode;
  tagline?: React.ReactNode;
  actions?: { text: React.ReactNode; link: string }[];
  features?: { title?: React.ReactNode; details?: React.ReactNode }[];
  footer?: React.ReactNode;
}

export function HomeLayout() {
  const { pageData } = useAppState();
  const { heroImage, heroText, tagline, actions, features, footer } =
    (pageData?.meta || {}) as HomePageMeta;

  return (
    <div className="max-w-screen-lg px-6 mx-auto h-full flex flex-col">
      <div className="flex-1 divide-y divide-c-border-1">
        <header className="py-12 md:pt-20 md:pb-16 text-center">
          {heroImage &&
            (heroImage.includes('/') ? (
              <img
                src={heroImage}
                alt="hero"
                className="max-w-full w-auto max-h-48 mx-auto mb-6 md:mb-8"
              />
            ) : (
              <div className="mx-auto mb-6 text-[150px] leading-tight md:mb-8">
                {heroImage}
              </div>
            ))}
          {heroText && (
            <h1 className="mb-5 text-center text-6xl md:text-7xl !leading-tight font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-c-brand to-[#4776E6]">
                {heroText}
              </span>
            </h1>
          )}
          {tagline && (
            <p className="mt-5 mb-8 text-center text-xl text-c-text-2 font-medium md:text-2xl">
              {tagline}
            </p>
          )}
          {actions && (
            <div className="mt-8 flex justify-center space-x-4 md:space-x-5">
              {actions.map((action, index) => (
                <Link key={index} to={action.link}>
                  <Button type={index === 0 ? 'primary' : 'secondary'}>
                    {action.text}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </header>
        {features && (
          <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index}>
                {feature.title && (
                  <h2 className="mb-3 text-xl font-medium text-c-text-1">
                    {feature.title}
                  </h2>
                )}
                {feature.details && (
                  <p className="text-base text-c-text-2">{feature.details}</p>
                )}
              </div>
            ))}
          </div>
        )}
        <Mdx className="pt-10">
          <Outlet />
        </Mdx>
      </div>
      {footer && <Footer>{footer}</Footer>}
    </div>
  );
}
