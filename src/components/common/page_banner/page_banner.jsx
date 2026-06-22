import CustomContainer from "@/components/ui/custom_container/custom_container";
import styles from "./page_banner.module.scss";
import Link from "next/link";
import { ChevronRight, HouseFill } from "react-bootstrap-icons";
import FONTS from "@/styles/fonts";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

const PageBanner = ({ title, image, videoSrc, customCrumbs }) => {
    const router = useRouter();

    const breadcrumbs = useMemo(() => {
        if (customCrumbs) return customCrumbs;
        if (!router) return []; // Fallback for safety

        const pathWithoutQuery = router.asPath.split('?')[0];
        const pathSegments = pathWithoutQuery.split('/').filter(v => v.length > 0);
        
        return pathSegments.map((segment, index) => {
            const href = '/' + pathSegments.slice(0, index + 1).join('/');
            // Decode URI component for segments like "kerala%20tours"
            // Replace hyphens with spaces and Title Case
            const name = decodeURIComponent(segment)
                .replace(/-/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase());
            
            return { name, href, isLast: index === pathSegments.length - 1 };
        });
    }, [router, customCrumbs]);

    return (
        <section className={styles.PageBanner}
            style={{
                backgroundImage: videoSrc ? 'none' : `url('${image}')`
            }}
        >
            {videoSrc && (
                <video 
                    src={videoSrc} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className={styles.bgVideo}
                />
            )}
            <div className={styles.overlay} />

            <CustomContainer>
                <div className={styles.cont}>
                    <div className={styles.crumbs} data-aos="fade-up" data-aos-delay="150">
                        <Link href="/"><HouseFill /> Home</Link>
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                <span><ChevronRight /></span>
                                {crumb.isLast ? (
                                    <span>{crumb.name}</span>
                                ) : (
                                    <Link href={crumb.href}>{crumb.name}</Link>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <h1 data-aos="fade-up" className={FONTS.font2}>{title}</h1>
                </div>
            </CustomContainer>
        </section>
    );
}

export default PageBanner;