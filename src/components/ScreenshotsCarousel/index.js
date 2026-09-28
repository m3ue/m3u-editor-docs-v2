import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import MaterialIcon from '../MaterialIcon';

import screenshots from '../../data/screenshots';

export default function ScreenshotsCarousel() {
    const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' });
    const [visibleScreenshots, setVisibleScreenshots] = useState(screenshots || []);
    const [swiper, setSwiper] = useState(null);
    const baseUrl = useBaseUrl('');

    useEffect(() => {
        setVisibleScreenshots(screenshots || []);
    }, [screenshots]);

    useEffect(() => {
        // Prevent body scroll when lightbox is open
        if (lightbox.open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [lightbox.open]);

    const openLightbox = (src, alt) => setLightbox({ open: true, src, alt });
    const closeLightbox = () => setLightbox({ open: false, src: '', alt: '' });

    const handleImageError = (src) => {
        setVisibleScreenshots((prev) => prev.filter((s) => s.src !== src));
    };

    return (
        <>
            {visibleScreenshots.length > 0 ? (
                <div className={styles.carouselWrap}>
                <Swiper
                    onSwiper={setSwiper}
                    modules={[Pagination, A11y]}
                    spaceBetween={16}
                    slidesPerView={1.1}
                    centeredSlides
                    loop
                    pagination={{ clickable: true }}
                    breakpoints={{
                        768: { slidesPerView: 1.35, spaceBetween: 24 },
                        1200: { slidesPerView: 1.5, spaceBetween: 32 },
                    }}
                    style={{ paddingBottom: 40 }}
                    className={styles.carousel}
                >
                    {visibleScreenshots.map((img) => {
                        const src = `${baseUrl.replace(/\/$/, '')}${img.src}`;
                        return (
                            <SwiperSlide key={src}>
                                <img
                                    src={src}
                                    alt={img.alt}
                                    className={styles.screenshotImg}
                                    onError={() => handleImageError(img.src)}
                                    onClick={() => openLightbox(src, img.alt)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`Expand ${img.alt}`}
                                    onKeyDown={(e) => { if (e.key === 'Enter') openLightbox(src, img.alt); }}
                                />
                                <p className={styles.caption}>{img.alt.replace(/^\d+\s*/, '')}</p>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                <button type="button" className={`${styles.navButton} ${styles.navPrev}`} onClick={() => swiper?.slidePrev()} aria-label="Previous screenshot">
                    <MaterialIcon name="chevron_left" />
                </button>
                <button type="button" className={`${styles.navButton} ${styles.navNext}`} onClick={() => swiper?.slideNext()} aria-label="Next screenshot">
                    <MaterialIcon name="chevron_right" />
                </button>
                </div>
            ) : (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#cbd5e1' }}>No screenshots available.</div>
            )}
            {lightbox.open && createPortal(
                <div className={styles.lightboxOverlay} onClick={closeLightbox} role="dialog" aria-modal="true">
                    <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Close">&times;</button>
                    <img src={lightbox.src} alt={lightbox.alt} className={styles.lightboxImg} />
                </div>,
                document.body
            )}
        </>
    );
}
