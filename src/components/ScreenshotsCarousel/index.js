import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import 'swiper/css';
import styles from './styles.module.css';
import MaterialIcon from '../MaterialIcon';

import defaultScreenshots from '../../data/screenshots';

const DEFAULT_BREAKPOINTS = {
    768: { slidesPerView: 1.35, spaceBetween: 24 },
    1200: { slidesPerView: 1.5, spaceBetween: 32 },
};

/**
 * Minimum slide count Swiper needs before centered loop mode actually loops
 * (mirrors its loopFix check): the widest slidesPerView rounded up to an odd
 * number, plus half that again for the clones on each side. Below this Swiper
 * silently disables the loop and slides pop in at the edges.
 */
function minLoopSlides(slidesPerView, breakpoints) {
    const widest = Math.max(
        slidesPerView,
        ...Object.values(breakpoints || {}).map((bp) => bp.slidesPerView || 0),
    );
    let visible = Math.ceil(widest);
    if (visible % 2 === 0) visible += 1;
    return visible + Math.max(1, Math.ceil(visible / 2));
}

/**
 * Centered screenshot carousel with a lightbox. Defaults to the editor
 * screenshots; pass `screenshots` plus `slidesPerView`/`breakpoints` for other
 * sets. `frame` draws device chrome around each image: 'none' (the image
 * already has its own, like the macOS window captures), 'tv', 'tablet' or 'phone'.
 */
export default function ScreenshotsCarousel({
    screenshots = defaultScreenshots,
    slidesPerView = 1.1,
    breakpoints = DEFAULT_BREAKPOINTS,
    frame = 'none',
}) {
    const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' });
    const [visibleScreenshots, setVisibleScreenshots] = useState(screenshots || []);
    const [swiper, setSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const count = visibleScreenshots.length;

    // Short sets are repeated whole so every gallery loops endlessly; the dots
    // below still track the real screenshot rather than each copy
    const slides = useMemo(() => {
        if (count === 0) return [];
        const copies = Math.ceil(minLoopSlides(slidesPerView, breakpoints) / count);
        return Array.from({ length: copies }, (_, copy) =>
            visibleScreenshots.map((img) => ({ ...img, copy })),
        ).flat();
    }, [visibleScreenshots, count, slidesPerView, breakpoints]);

    // Jump to the copy of a screenshot closest to the current slide so the
    // carousel takes the short way round
    const goTo = (index) => {
        if (!swiper) return;
        const total = slides.length;
        const current = swiper.realIndex;
        const distance = (from, to) => Math.min(Math.abs(to - from), total - Math.abs(to - from));
        let target = index;
        for (let candidate = index; candidate < total; candidate += count) {
            if (distance(current, candidate) < distance(current, target)) target = candidate;
        }
        swiper.slideToLoop(target);
    };

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
                    onRealIndexChange={(instance) => setActiveIndex(instance.realIndex % count)}
                    modules={[A11y]}
                    spaceBetween={16}
                    slidesPerView={slidesPerView}
                    centeredSlides
                    loop
                    breakpoints={breakpoints}
                    style={{ paddingBottom: 40 }}
                    className={styles.carousel}
                >
                    {slides.map((img) => {
                        // Already a final, content-hashed URL from require()
                        const { src } = img;
                        return (
                            <SwiperSlide key={`${img.copy}-${src}`}>
                                <div className={clsx(styles.frame, styles[`frame_${frame}`])}>
                                    <img
                                        src={src}
                                        alt={img.alt}
                                        loading="lazy"
                                        className={styles.screenshotImg}
                                        onError={() => handleImageError(img.src)}
                                        onClick={() => openLightbox(src, img.alt)}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Expand ${img.alt}`}
                                        onKeyDown={(e) => { if (e.key === 'Enter') openLightbox(src, img.alt); }}
                                    />
                                </div>
                                <p className={styles.caption}>{img.alt.replace(/^\d+\s*/, '')}</p>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                <div className={styles.pagination}>
                    {visibleScreenshots.map((img, index) => (
                        <button
                            key={img.src}
                            type="button"
                            className={clsx(styles.bullet, index === activeIndex && styles.bulletActive)}
                            onClick={() => goTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === activeIndex}
                        />
                    ))}
                </div>
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
