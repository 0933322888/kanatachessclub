export const siteConfig = {
    kanata: {
        name: "Kanata Chess Club",
        description: "Welcome to the Kanata Chess Club",
        gatheringDay: 3, // Wednesday
        gatheringTime: "7:00 PM - 10:00 PM",
        location: "Kelsey's Original Roadhouse",
        address: "Kelsey's Original Roadhouse (700 March Rd, Kanata, ON K2K 2V9)",
        googleMapsUrl: "https://maps.app.goo.gl/9s3M7y4Zj6aQ8e1Z9",
        scheduleType: "biweekly",
        socials: {
            email: "mailto:hello@kanatachess.com",
            instagram: "https://www.instagram.com/kanatachess",
        },
        assets: {
            logo: "/logo.png",
            heroImage: "/images/hero_background.png",
            heroImageAlt: "Chess board close up",
        }
    },
    barrhaven: {
        name: "Barrhaven Chess Club",
        description: "Welcome to the Barrhaven Chess Club",
        gatheringDay: 4, // Thursday
        gatheringTime: "7:00 PM - 10:00 PM",
        location: "Greenfield's Gastro Public House",
        address: "Greenfield's Gastro Public House (900 Greenbank Rd, Nepean, ON K2J 1S8)",
        googleMapsUrl: "https://maps.app.goo.gl/P8Z8Z8Z8Z8Z8Z8Z8", // Placeholder
        scheduleType: "biweekly",
        socials: {
            email: "mailto:hello@barrhavenchess.com",
        },
        assets: {
            logo: "/logo.png", // Using same logo for now until provided
            heroImage: "/images/hero_background.png", // Using same hero for now
            heroImageAlt: "Chess board close up",
        }
    }
};

export const getSiteConfig = () => {
    const clubId = process.env.NEXT_PUBLIC_CLUB_ID || 'kanata';
    return siteConfig[clubId] || siteConfig.kanata;
};
