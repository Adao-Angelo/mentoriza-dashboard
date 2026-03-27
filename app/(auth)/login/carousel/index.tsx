'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { loginCarrouselItems } from '@/constants/auth/carrousel-items';

import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import * as React from 'react';

export function CarouselAuthLogin() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className='relative w-full h-dvh lg:flex hidden'>
      <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 2000 })]}
        setApi={setApi}
        className='w-full h-dvh'
      >
        <CarouselContent>
          {loginCarrouselItems.map(({ cover, description, id, title }) => (
            <CarouselItem key={id} className='relative w-full h-dvh'>
              <div className='relative w-full h-dvh'>
                <Image
                  src={cover}
                  width={1000}
                  height={1000}
                  className='w-full object-contain h-auto'
                  alt={title}
                />
                <div className='absolute bottom-0 w-full bg-linear-to-t from-black-dark  to-transparent z-10 h-screen' />

                <div className='absolute left-10 bottom-31 z-20 w-full max-w-120.5 flex flex-col gap-4 px-4 '>
                  <h4 className='text-4xl font-bold leading-10.5 text-white'>
                    {title}
                  </h4>
                  <p className='text-[16px] font-normal leading-6 tracking-[0.2px] text-white'>
                    {description}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className='absolute bottom-8 left-0 right-0 left-12 flex justify-start gap-2 z-30 p-3'>
        {loginCarrouselItems.map(({ id }) => (
          <button
            key={id}
            onClick={() => api?.scrollTo(id)}
            className={`h-2 rounded-full transition-all bg-white ${
              current === id ? 'b w-6' : 'w-2 opacity-60 '
            }`}
          />
        ))}
      </div>
    </div>
  );
}
