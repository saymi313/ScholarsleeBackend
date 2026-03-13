export const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Scholarslee",
    "description": "Global mentorship platform connecting students with expert mentors for study abroad success",
    "url": "https://scholarslee.com",
    "logo": "https://scholarslee.com/icon.png",
    "foundingDate": "2024",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Islamabad",
        "addressRegion": "Islamabad Capital Territory",
        "addressCountry": "PK"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-888-1234-5678",
        "contactType": "Customer Service",
        "email": "info@scholarslee.com",
        "availableLanguage": ["English"]
    },
    "sameAs": [
        "https://www.linkedin.com/company/scholarslee/",
        "https://www.instagram.com/scholarslee/"
    ],
    "offers": {
        "@type": "Offer",
        "category": "Educational Services",
        "description": "Mentorship services for study abroad students"
    }
});

export const generateWebSiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Scholarslee",
    "alternateName": "Scholarslee Mentorship",
    "url": "https://scholarslee.com/",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://scholarslee.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
});

export const generateBreadcrumbSchema = (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url.startsWith('http') ? item.url : `https://scholarslee.com${item.url}`
    }))
});

export const generateSiteNavigationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
        {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Home",
            "url": "https://scholarslee.com"
        },
        {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "About Us",
            "url": "https://scholarslee.com/about"
        },
        {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Mentors",
            "url": "https://scholarslee.com/mentees/mentors"
        },
        {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "Services",
            "url": "https://scholarslee.com/mentees/services"
        }
    ]
});

export const generateMentorSchema = (mentor) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": mentor.name || mentor.fullName,
    "description": mentor.bio || mentor.title,
    "image": mentor.profileImage || mentor.avatar,
    "jobTitle": mentor.title,
    "worksFor": {
        "@type": "Organization",
        "name": "Scholarslee"
    },
    "url": `https://scholarslee.com/mentees/mentor-details/${mentor.slug || mentor._id || mentor.id}`
});

export const generateServiceSchema = (service, mentor) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.title,
    "provider": {
        "@type": "Person",
        "name": mentor?.name || "Expert Mentor"
    },
    "description": service.description,
    "providerMobility": "dynamic",
    "offers": {
        "@type": "Offer",
        "price": service.price,
        "priceCurrency": "USD"
    }
});
