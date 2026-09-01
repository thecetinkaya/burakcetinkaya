import React, { useState, useEffect } from "react";
import { db } from "../lib/supabase";

// Import KPSS SaaS Subcomponents
import KpssNavbar from "../components/kpss/KpssNavbar";
import KpssHero from "../components/kpss/KpssHero";
import KpssFeatureShowcase from "../components/kpss/KpssFeatureShowcase";
import KpssInteractiveVideo from "../components/kpss/KpssInteractiveVideo";
import KpssPricing from "../components/kpss/KpssPricing";
import KpssAppStoreBadge from "../components/kpss/KpssAppStoreBadge";
import KpssAuthModal from "../components/kpss/KpssAuthModal";
import KpssWorkspaceView from "../components/kpss/KpssWorkspaceView";

/**
 * KPSS / AGS / TYT / AYT SaaS Hazırlık Platformu & Öğrenci Çalışma Sayfası
 */
const KpssPage = () => {
  const [viewMode, setViewMode] = useState("landing"); // "landing" | "workspace"
  const [workspaceInitialTab, setWorkspaceInitialTab] = useState("kanban");
  
  // Auth State
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState("login");

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    // Check user session
    const checkUser = async () => {
      try {
        const { data: { user: sessionUser } } = await db.auth.getSessionUser();
        if (sessionUser) {
          setUser(sessionUser);
        } else {
          const localUserStr = localStorage.getItem("kpss_local_user");
          if (localUserStr) {
            setUser(JSON.parse(localUserStr));
          }
        }
      } catch (err) {
        const localUserStr = localStorage.getItem("kpss_local_user");
        if (localUserStr) {
          setUser(JSON.parse(localUserStr));
        }
      }
    };
    checkUser();
  }, []);

  const handleOpenAuth = (mode = "login") => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await db.auth.signOut();
    } catch (e) {}
    localStorage.removeItem("kpss_local_user");
    setUser(null);
  };

  const handleSelectFeature = (featureId) => {
    setWorkspaceInitialTab(featureId);
    setViewMode("workspace");
    window.scrollTo(0, 0);
  };

  const handleSelectPlan = (planType) => {
    if (planType === "premium" || planType === "free") {
      setViewMode("workspace");
      window.scrollTo(0, 0);
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
        currentMode={viewMode}
        onToggleMode={(mode) => {
          setViewMode(mode);
          window.scrollTo(0, 0);
        }}
        onOpenAuth={handleOpenAuth}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main View Switcher */}
      {viewMode === "landing" ? (
        <main>
          {/* Hero Section */}
          <KpssHero 
            onStart={() => {
              if (!user) handleOpenAuth("register");
              else setViewMode("workspace");
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
      ) : (
        <KpssWorkspaceView 
          initialTab={workspaceInitialTab}
          onBackToLanding={() => setViewMode("landing")}
        />
      )}

      {/* Auth Modal */}
      <KpssAuthModal 
        isOpen={authModalOpen}
        initialMode={authInitialMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />

    </div>
  );
};

export default KpssPage;
