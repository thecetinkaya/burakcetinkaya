import React, { useState } from "react";
import { 
  LuPlay, LuPause, LuVolume2, LuMaximize2, LuSparkles, 
  LuCheck, LuBookmark, LuMessageSquare, LuLayers, LuTv
} from "react-icons/lu";

/**
 * İnteraktif Ders Videosu ve Test Modülü Vitrini
 */
const KpssInteractiveVideo = () => {
  const [activeVideoTab, setActiveVideoTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuestionOverlay, setShowQuestionOverlay] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [notes, setNotes] = useState([
    { time: "02:15", text: "Amasya Genelgesi milli mücadelenin amacını belirtti." },
    { time: "05:40", text: "Erzurum Kongresi toplanış bakımından bölgesel, kararlar bakımından ulusal." }
  ]);
  const [newNote, setNewNote] = useState("");

  const INTERACTIVE_VIDEOS = [
    {
      id: 1,
      title: "KPSS Tarih - Amasya Genelgesi İnteraktif Çözümü",
      duration: "12:45",
      author: "Hoca Efendi - Tarih Uzmanı",
      thumbnailBg: "from-amber-600/30 to-rose-900/40",
      question: {
        timecode: "04:30",
        prompt: "Amasya Genelgesi'nin hangi maddesi 'Milli Egemenlik' ilkesine geçileceğinin ilk işaretidir?",
        options: [
          { id: "A", text: "Vatanın bütünlüğü milletin bağımsızlığı tehlikededir.", isCorrect: false },
          { id: "B", text: "Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.", isCorrect: true },
          { id: "C", text: "Sivas'ta ulusal bir kongre toplanacaktır.", isCorrect: false },
          { id: "D", text: "İstanbul hükümeti sorumluluğunu yerine getirememektedir.", isCorrect: false }
        ]
      }
    },
    {
      id: 2,
      title: "KPSS Matematik - Sayı Problemleri Pratik Yollar",
      duration: "18:20",
      author: "Matematik Akademi",
      thumbnailBg: "from-emerald-600/30 to-cyan-900/40",
      question: {
        timecode: "07:15",
        prompt: "Bir sınıftaki öğrenciler sıralara 2'şerli oturunca 4 öğrenci ayakta kalıyor, 3'erli oturunca 2 sıra boş kalıyor. Sınıf mevcudu kaçtır?",
        options: [
          { id: "A", text: "20 Öğrenci", isCorrect: false },
          { id: "B", text: "24 Öğrenci", isCorrect: true },
          { id: "C", text: "28 Öğrenci", isCorrect: false },
          { id: "D", text: "30 Öğrenci", isCorrect: false }
        ]
      }
    }
  ];

  const currentVideo = INTERACTIVE_VIDEOS[activeVideoTab];

  const handleSelectOption = (optId) => {
    setSelectedAnswer(optId);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer) {
      setAnswerSubmitted(true);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([...notes, { time: "04:30", text: newNote }]);
    setNewNote("");
  };

  return (
    <section id="interactive-video" className="py-24 bg-[#070b14] text-white relative">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
            <LuSparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Yeni Nesil Öğrenme Teknolojisi</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            İnteraktif Video & <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Anlık Soru Çözüm Test Sistemi
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400">
            Ders izlerken kritik dakikalarda karşınıza çıkan interaktif soruları çözün, anında dönüt alın ve zaman damgalı notlarınızı kaydedin.
          </p>
        </div>

        {/* Video Selector Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {INTERACTIVE_VIDEOS.map((vid, idx) => (
            <button
              key={vid.id}
              onClick={() => {
                setActiveVideoTab(idx);
                setSelectedAnswer(null);
                setAnswerSubmitted(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer border ${
                activeVideoTab === idx
                  ? "bg-slate-900 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10"
                  : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <LuTv className="w-4 h-4" />
              <span>{vid.title}</span>
            </button>
          ))}
        </div>

        {/* Video Player & Interactive Question Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Video Frame & Interactive Overlay */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className={`relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br ${currentVideo.thumbnailBg} border border-slate-800 shadow-2xl flex flex-col justify-between p-6`}>
              
              {/* Top Watermark Bar */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 backdrop-blur-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="text-xs font-bold text-slate-200">İnteraktif Soru Dakikası (04:30)</span>
                </div>

                <button
                  onClick={() => setShowQuestionOverlay(!showQuestionOverlay)}
                  className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30 backdrop-blur-md"
                >
                  {showQuestionOverlay ? "Soruyu Gizle" : "Soruyu Göster"}
                </button>
              </div>

              {/* Interactive Pop-up Question Overlay */}
              {showQuestionOverlay && (
                <div className="my-auto max-w-xl mx-auto w-full bg-slate-950/95 border border-emerald-500/40 p-5 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-300 z-20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
                      <LuSparkles className="w-3.5 h-3.5" /> Canlı Soru Modülü
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Soru ID: #KPSS-2026-T1</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mb-4 leading-snug">
                    {currentVideo.question.prompt}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2.5 mb-4">
                    {currentVideo.question.options.map((opt) => {
                      const isSelected = selectedAnswer === opt.id;
                      let btnStyle = "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-emerald-500/40";
                      
                      if (answerSubmitted) {
                        if (opt.isCorrect) {
                          btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300";
                        }
                      } else if (isSelected) {
                        btnStyle = "bg-emerald-500/15 border-emerald-400 text-white font-bold";
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() => !answerSubmitted && handleSelectOption(opt.id)}
                          className={`w-full p-3 rounded-xl text-xs sm:text-sm text-left transition border flex items-center gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {opt.id}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {answerSubmitted && opt.isCorrect && (
                            <LuCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit Answer */}
                  {!answerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                        selectedAnswer
                          ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                          : "bg-slate-800 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      Cevabı Gönder & Videoya Devam Et
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <span className="text-emerald-300 font-semibold">
                        {selectedAnswer === "B" ? "🎉 Tebrikler! Doğru cevap verdiniz." : "❌ Yanlış cevap. Doğru şık B şıkkıdır."}
                      </span>
                      <button
                        onClick={() => { setSelectedAnswer(null); setAnswerSubmitted(false); setIsPlaying(true); }}
                        className="px-3 py-1 bg-emerald-500 text-slate-950 font-black rounded-lg text-[11px]"
                      >
                        Devam Et ▶
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* Video Bottom Player Controls Bar */}
              <div className="flex items-center justify-between bg-slate-950/90 p-3 rounded-2xl border border-slate-800 backdrop-blur-xl z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center hover:scale-105 transition cursor-pointer"
                  >
                    {isPlaying ? <LuPause className="w-4 h-4" /> : <LuPlay className="w-4 h-4 ml-0.5" />}
                  </button>

                  <div className="text-xs font-mono text-slate-300">
                    <span>04:30</span> / <span className="text-slate-500">{currentVideo.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-slate-900 text-[10px] font-bold text-emerald-400 border border-slate-800">
                    1.25x Hız
                  </span>
                  <LuVolume2 className="w-4 h-4 text-slate-400" />
                  <LuMaximize2 className="w-4 h-4 text-slate-400" />
                </div>
              </div>

            </div>

          </div>

          {/* Video Notes & Interactive Timecodes Side Panel */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-sm text-white flex items-center gap-2">
                  <LuBookmark className="w-4 h-4 text-amber-400" />
                  <span>Ders Notları & İşaretler</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  Canlı Senkron
                </span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {notes.map((n, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-emerald-400 font-bold">⏱️ {n.time}</span>
                      <span className="text-slate-500">Otomatik Kayıt</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-medium">{n.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Videodaki bu dakikaya not ekle..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  Not Ekle
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default KpssInteractiveVideo;
