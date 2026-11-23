import Image from 'next/image';
import React, { useState } from 'react';

import { IndexList, IndexRow, IndexSection, Lede } from '../components/Index';
import { PageShell } from '../components/PageShell';
import { AboutExtended } from '../data/bio';
import { FavMedia } from '../data/media';
import { travelImages } from '../images/travel';

const seoTitle = 'About';

function Snapshots() {
  const [caption, setCaption] = useState<string | null>(null);

  return (
    <>
      <div className="flex max-w-[calc(10*68px)] flex-wrap gap-1">
        {travelImages.map((photo) => (
          <Image
            key={photo.img.src}
            src={photo.img}
            alt={photo.alt}
            width={64}
            height={64}
            className="h-16 w-16 object-cover opacity-90 contrast-[1.05] grayscale transition-[filter,opacity] duration-200 hover:opacity-100 hover:contrast-100 hover:grayscale-0"
            onMouseEnter={() => setCaption(photo.title)}
            onMouseLeave={() => setCaption(null)}
          />
        ))}
      </div>
      <p className="mt-2 text-faint">{caption ?? `${travelImages.length} photos`}</p>
    </>
  );
}

export default function About() {
  return (
    <PageShell seoTitle={seoTitle} seoDescription={AboutExtended} current="about">
      <Lede>
        <p>
          <span className="plate-inline text-body">{AboutExtended}</span>
        </p>
      </Lede>

      <IndexSection label="favorite books & tv shows">
        <IndexList lead="27ch" leadMobile="minmax(0,1.3fr)">
          {FavMedia.map((media) => (
            <IndexRow
              key={media.name}
              href={media.link}
              external
              lead={media.name}
              leadTone="ink"
              main={media.type}
              mainTone="faint"
            />
          ))}
        </IndexList>
      </IndexSection>

      <IndexSection label="snapshots">
        <Snapshots />
      </IndexSection>
    </PageShell>
  );
}
