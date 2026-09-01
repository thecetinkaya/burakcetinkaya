import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/supabase";

// Import KPSS SaaS Subcomponents
import KpssNavbar from "../components/kpss/KpssNavbar";
import KpssHero from "../components/kpss/KpssHero";
import KpssFeatureShowcase from "../components/kpss/KpssFeatureShowcase";
import KpssInteractiveVideo from "../components/kpss/KpssInteractiveVideo";
import KpssPricing from "../components/kpss/KpssPricing";
import KpssAppStoreBadge from "../components/kpss/KpssAppStoreBadge";

/**
 * KPSS / AGS / TYT / AYT Public SaaS Hazırlık Tanıtım Sayfası (/kpss)
 */
const KpssPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState("login");

  useEffect(() => {
    window.scrollTo(0, 0);

    const checkUser = async () => {
      try {
        const { data: { user: sessionUser } } = await db.auth.getSessionUser();
        if (sessionUser) {
          setUser(sessionUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };
    checkUser();

    window.addEventListener("kpss_auth_change", checkUser);
    return () => window.removeEventListener("kpss_auth_change", checkUser);
  }, []);

  const handleOpenAuth = () => {
    navigate("/auth");
  };

  const handleLogout = async () => {
    await db.auth.logout();
    setUser(null);
  };

  const handleToggleMode = (mode) => {
    if (mode === "workspace") {
      if (!user) {
        navigate("/auth");
      } else {
        navigate("/student");
      }
    }
  };

  const handleSelectFeature = () => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate("/student");
    }
  };

  const handleSelectPlan = () => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate("/student");
    }
  };

  const handleExploreVideo = () => {
    const el = document.getElementById("interactive-video");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Platform Navigation */}
      <KpssNavbar 
        currentMode="landing"
        onToggleMode={handleToggleMode}
        onOpenAuth={handleOpenAuth}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main SaaS Landing Showcase */}
      <main>
        {/* Hero Section */}
        <KpssHero 
          onStart={() => {
            if (!user) handleOpenAuth("register");
            else navigate("/student");
          }}
          onOpenAuth={handleOpenAuth}
          onExploreVideo={handleExploreVideo}
        />

        {/* All-in-One Features Showcase */}
        <KpssFeatureShowcase onSelectFeature={handleSelectFeature} />

        {/* Interactive Video Showcase */}
        <KpssInteractiveVideo />

        {/* Pricing & Stripe Modal */}
        <KpssPricing onSelectPlan={handleSelectPlan} />

        {/* Mobile App Store Badge */}
        <KpssAppStoreBadge />

        {/* Platform Footer */}
        <footer className="py-12 bg-[#04070e] border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-3">
          <div className="flex justify-center items-center gap-2 font-bold text-slate-300">
            <span>🎓 KPSS PRO 2026</span>
            <span>•</span>
            <span>AGS</span>
            <span>•</span>
            <span>TYT / AYT Sınav Hazırlık Platformu</span>
          </div>
          <p>© 2026 Burak Çetinkaya. Tüm Hakları Saklıdır.</p>
        </footer>
      </main>

    </div>
  );
};

export default KpssPage;
