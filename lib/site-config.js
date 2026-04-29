export const siteConfig = {
    kanata: {
        name: "Kanata Chess Club",
        description: "Welcome to the Kanata Chess Club",
        gatheringDay: 3, // Wednesday
        gatheringTime: "7:00 PM - 9:00 PM",
        location: "Food court at Tanger Outlets",
        address: "800 Palladium Dr, Kanata, ON K2V 1A3",
        googleMapsUrl: "https://maps.app.goo.gl/Yz7Qm3cEEjBG9r5R7",
        coordinates: {
            latitude: 45.2972887,
            longitude: -75.9420474
        },
        scheduleType: "biweekly",
        tagline: "A community of strategy, skill, and friendship.",

        socials: {
            email: "mailto:a6138808764@gmail.com",
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
        gatheringTime: "5:30 PM - 8:00 PM",
        location: "Wizard's Tower",
        address: "1-80 Marketplace Ave, Nepean, ON K2J 4H9",
        googleMapsUrl: "https://maps.app.goo.gl/MPopVBUbPhnyd6dW9",
        coordinates: {
            latitude: 45.270812,
            longitude: -75.7428872
        },
        scheduleType: "biweekly",
        tagline: "A community of strategy, skill, and friendship.",

        socials: {
            email: "mailto:a6138808764@gmail.com",
        },
        assets: {
            logo: "/bcc_logo.png", // Using same logo for now until provided
            heroImage: "/images/hero_background.png", // Using same hero for now
            heroImageAlt: "Chess board close up",
        }
    }
};

export const getSiteConfig = (clubId) => {
    const id = clubId || process.env.NEXT_PUBLIC_CLUB_ID || 'kanata';
    return siteConfig[id] || siteConfig.kanata;
};
