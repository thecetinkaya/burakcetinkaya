import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageConfigs = {
  "/": {
    title: "Burak Çetinkaya - Bilgisayar Mühendisi | Portfolyo & Yazılım Çözümleri",
    description: "Burak Çetinkaya - Bilgisayar Mühendisi (Computer Engineer). Modern web uygulamaları, React, Next.js, Node.js ve özel yazılım çözümleri.",
  },
  "/about": {
    title: "Burak Çetinkaya - Hakkımda | Bilgisayar Mühendisi",
    description: "Burak Çetinkaya'nın eğitimi, deneyimleri, yetkinlikleri ve projeleri hakkında bilgi edinin.",
  },
  "/projects": {
    title: "Burak Çetinkaya - Projeler | Yazılım & Web Projeleri",
    description: "Burak Çetinkaya tarafından geliştirilen web, akademik, e-ticaret ve yazılım projelerini inceleyin.",
  },
  "/contact": {
    title: "Burak Çetinkaya - İletişim | Proje Teklifi & İş Birliği",
    description: "Burak Çetinkaya ile iletişime geçin. Yeni bir proje başlatmak, teklif almak veya danışmanlık için mesaj gönderin.",
  },
  "/admin": {
    title: "Burak Çetinkaya - Admin Paneli",
    description: "Yönetim paneli ve içerik kontrol alanı.",
  },
};

const SEO = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const config = pageConfigs[currentPath] || {
      title: `Burak Çetinkaya - ${currentPath.replace("/", "").toUpperCase()}`,
      description: "Burak Çetinkaya - Bilgisayar Mühendisi Kişisel Web Sitesi ve Portfolyosu.",
    };

    // Update document title
    document.title = config.title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", config.description);
    } else {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      metaDesc.content = config.description;
      document.head.appendChild(metaDesc);
    }

    // Google Analytics pageview tracker
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: config.title,
        page_location: window.location.href,
        page_path: currentPath,
      });
    }
  }, [location]);

  return null;
};

export default SEO;
