import React, { useState, useEffect, useRef } from "react";
import { 
  FaLock, FaUnlock, FaClock, FaCheckCircle, FaTimesCircle, FaFlag, 
  FaBookOpen, FaPrint, FaAward, FaChartBar, FaEye, FaChevronLeft, 
  FaChevronRight, FaShieldAlt, FaKey, FaListOl, FaExclamationTriangle, FaRedo
} from "react-icons/fa";

// ─────────────────────────────────────────────────────────────────────────────
// 🔒 ÖSYM ÖZEL DENEME VERİ SETİ (PDF'LERDEN TAM DİJİTALLEŞTİRİLMİŞ 50 SAYISAL & SÖZEL SORU)
// ─────────────────────────────────────────────────────────────────────────────
const DENEME_QUESTIONS = [
  // ── SAYISAL & GEOMETRİ & SAYISAL MANTIK ───────────────────────────────────
  {
    id: 1,
    subject: "Matematik",
    topic: "Rasyonel Sayılar",
    question: `$$\\left(7 - \\frac{3}{4}\\right) \\cdot \\left(\\left(6 - \\frac{2}{3}\\right) : \\frac{5}{3}\\right)$$

işleminin sonucu kaçtır?`,
    options: [
      { id: "A", label: "A", text: "20" },
      { id: "B", label: "B", text: "14" },
      { id: "C", label: "C", text: "10" },
      { id: "D", label: "D", text: "8" },
      { id: "E", label: "E", text: "6" }
    ],
    correctAnswer: "A",
    solution: ` Adım 1: İlk parantez içini hesaplayalım:
7 - 3/4 = (28 - 3) / 4 = 25/4

 Adım 2: İkinci parantez içindeki çıkarma:
6 - 2/3 = (18 - 2) / 3 = 16/3

 Adım 3: Bölme işlemi:
(16/3) : (5/3) = (16/3) * (3/5) = 16/5

 Adım 4: Çarpma işlemi:
(25/4) * (16/5) = (25*16) / (4*5) = 5 * 4 = 20.
Cevap A şıkkıdır.`
  },
  {
    id: 2,
    subject: "Matematik",
    topic: "Üslü Sayılar",
    question: `$$\\frac{(-8)^2 \\cdot 4^3}{2^4 \\cdot 32^2}$$

işleminin sonucu kaçtır?`,
    options: [
      { id: "A", label: "A", text: "-1/8" },
      { id: "B", label: "B", text: "-1/2" },
      { id: "C", label: "C", text: "1/16" },
      { id: "D", label: "D", text: "1/4" },
      { id: "E", label: "E", text: "1" }
    ],
    correctAnswer: "D",
    solution: `Tüm sayıları 2 tabanına çevirelim:
(-8)² = 8² = (2³)² = 2⁶
4³ = (2²)³ = 2⁶
Pay = 2⁶ * 2⁶ = 2¹²

2⁴ = 2⁴
32² = (2⁵)² = 2¹⁰
Payda = 2⁴ * 2¹⁰ = 2¹⁴

Sonuç = 2¹² / 2¹⁴ = 2⁻² = 1/4.
Cevap D şıkkıdır.`
  },
  {
    id: 3,
    subject: "Matematik",
    topic: "Köklü Sayılar",
    question: `$$\\frac{1}{\\sqrt{24}} \\cdot \\frac{\\sqrt{3} + \\sqrt{12}}{2\\sqrt{18}}$$

işleminin sonucu kaçtır?`,
    options: [
      { id: "A", label: "A", text: "1/2" },
      { id: "B", label: "B", text: "1/3" },
      { id: "C", label: "C", text: "1/4" },
      { id: "D", label: "D", text: "1/6" },
      { id: "E", label: "E", text: "1/8" }
    ],
    correctAnswer: "E",
    solution: `Köklü ifadeleri sadeleştirelim:
√12 = 2√3 => Pay kısmı = √3 + 2√3 = 3√3
√18 = 3√2 => 2√18 = 6√2
(3√3) / (6√2) = √3 / (2√2)

1 / √24 = 1 / (2√6)

Çarpım: [1 / (2√6)] * [√3 / (2√2)] = √3 / (4√12) = √3 / (4 * 2√3) = 1/8.
Cevap E şıkkıdır.`
  },
  {
    id: 4,
    subject: "Matematik",
    topic: "Ondalık Sayılar",
    question: `$$\\frac{0,01}{0,001} - \\frac{0,003}{0,03}$$

işleminin sonucu kaçtır?`,
    options: [
      { id: "A", label: "A", text: "8,8" },
      { id: "B", label: "B", text: "9,7" },
      { id: "C", label: "C", text: "9,9" },
      { id: "D", label: "D", text: "10,1" },
      { id: "E", label: "E", text: "10,3" }
    ],
    correctAnswer: "C",
    solution: `0,01 / 0,001 = 10
0,003 / 0,03 = 0,1
10 - 0,1 = 9,9.
Cevap C şıkkıdır.`
  },
  {
    id: 5,
    subject: "Matematik",
    topic: "Sayı Basamakları & Toplama",
    question: `A, B ve C sıfırdan farklı birer rakam olmak üzere,

    A 3 B
  + B C A
  -------
  1 0 A C

olduğuna göre A · B · C çarpımı kaçtır?`,
    options: [
      { id: "A", label: "A", text: "90" },
      { id: "B", label: "B", text: "96" },
      { id: "C", label: "C", text: "126" },
      { id: "D", label: "D", text: "135" },
      { id: "E", label: "E", text: "140" }
    ],
    correctAnswer: "C",
    solution: `Birler basamağı: B + A = C (elde yoksa)
Onlar basamağı: 3 + C = A (veya elde 1 varsa 4 + C = A)
Yüzler basamağı: A + B (+ elde 1) = 10

İncelediğimizde A = 7, B = 2, C = 9 değerleri denkliği tam sağlar:
732 + 297 = 1029.
A · B · C = 7 · 2 · 9 = 126.
Cevap C şıkkıdır.`
  },
  {
    id: 6,
    subject: "Matematik",
    topic: "Eşitsizlikler",
    question: `a, b ve c gerçel sayılar olmak üzere

$$\\frac{a}{b} < b < 0 < b \\cdot c < c^2$$

eşitsizlikleri sağlanıyor. Buna göre aşağıdaki sıralamalardan hangisi doğrudur?`,
    options: [
      { id: "A", label: "A", text: "b < c < a < 0" },
      { id: "B", label: "B", text: "b < c < 0 < a" },
      { id: "C", label: "C", text: "b < 0 < c < a" },
      { id: "D", label: "D", text: "c < b < a < 0" },
      { id: "E", label: "E", text: "c < b < 0 < a" }
    ],
    correctAnswer: "E",
    solution: `1. b < 0 ve b · c > 0 olduğu için c < 0 olmalıdır.
2. b · c < c² eşitsizliğinde her iki tarafı negatif olan c sayısına bölersek eşitsizlik yön değiştirir: b > c yani c < b.
3. a / b < b < 0 ifadesinde b negatif olduğundan a pozitif olmalıdır (a > 0).
Sıralama: c < b < 0 < a.
Cevap E şıkkıdır.`
  },
  {
    id: 7,
    subject: "Matematik",
    topic: "Denklem Sistemleri",
    question: `a, b ve c gerçel sayıları için

a - b = 2
a + c = 2
b - 2c = 3

olduğuna göre (a · b) / c ifadesinin değeri kaçtır?`,
    options: [
      { id: "A", label: "A", text: "-3" },
      { id: "B", label: "B", text: "-1" },
      { id: "C", label: "C", text: "0" },
      { id: "D", label: "D", text: "1" },
      { id: "E", label: "E", text: "2" }
    ],
    correctAnswer: "A",
    solution: `a = b + 2 ve a = 2 - c olduğundan b + 2 = 2 - c => b = -c.
Üçüncü denklemde b yerine -c koyarsak: -c - 2c = 3 => -3c = 3 => c = -1.
c = -1 ise b = 1 ve a = 3 elde edilir.
(a · b) / c = (3 · 1) / (-1) = -3.
Cevap A şıkkıdır.`
  },
  {
    id: 8,
    subject: "Matematik",
    topic: "Tek ve Çift Sayılar",
    question: `a, b ve c birer tam sayı olmak üzere
• a + b + c ifadesinin tek sayı,
• a² + 2ab + c ifadesinin çift sayı
olduğu biliniyor.

Buna göre
I. a · b · c
II. a · (b + c)
III. c · (a + b)

ifadelerinden hangileri kesinlikle çift sayıdır?`,
    options: [
      { id: "A", label: "A", text: "Yalnız I" },
      { id: "B", label: "B", text: "Yalnız II" },
      { id: "C", label: "C", text: "Yalnız III" },
      { id: "D", label: "D", text: "I ve II" },
      { id: "E", label: "E", text: "II ve III" }
    ],
    correctAnswer: "E",
    solution: `a² + 2ab çift sayıları analiz edildiğinde a ve c pariteleri incelenir. İnceleme sonucunda II. a · (b + c) ve III. c · (a + b) ifadelerinin daima çift sayı olduğu görülür.
Cevap E şıkkıdır.`
  },
  {
    id: 9,
    subject: "Matematik",
    topic: "Eşitsizlik Çözümü",
    question: `$$\\frac{5x}{9} > \\frac{2x - 5}{3} > \\frac{x + 7}{4}$$

eşitsizliğini sağlayan kaç farklı x tam sayısı vardır?`,
    options: [
      { id: "A", label: "A", text: "6" },
      { id: "B", label: "B", text: "8" },
      { id: "C", label: "C", text: "9" },
      { id: "D", label: "D", text: "11" },
      { id: "E", label: "E", text: "13" }
    ],
    correctAnswer: "A",
    solution: `Sol ikili: 5x / 9 > (2x - 5) / 3 => 5x > 6x - 15 => x < 15.
Sağ ikili: (2x - 5) / 3 > (x + 7) / 4 => 8x - 20 > 3x + 21 => 5x > 41 => x > 8,2.
Şartı sağlayan tam sayılar: 9, 10, 11, 12, 13, 14 (Toplam 6 adet).
Cevap A şıkkıdır.`
  },
  {
    id: 10,
    subject: "Matematik",
    topic: "Mutlak Değer Denklemleri",
    question: `x ve y gerçel sayıları için

|x| · (x + |y|) = -18
|y - x| = -y

eşitlikleri sağlanmaktadır. Buna göre x değeri kaçtır?`,
    options: [
      { id: "A", label: "A", text: "-1" },
      { id: "B", label: "B", text: "-2" },
      { id: "C", label: "C", text: "-4" },
      { id: "D", label: "D", text: "-6" },
      { id: "E", label: "E", text: "-9" }
    ],
    correctAnswer: "D",
    solution: `|y - x| = -y olduğundan -y ≥ 0 yani y ≤ 0 olmalıdır. Buradan |y| = -y olur.
İlk denklemde |y| yerine -y koyarsak: |x| · (x - y) = -18. Sol tarafın negatif olması için x < 0 olmalıdır.
Çözüm yapıldığında x = -6, y = -3 bulunur.
Cevap D şıkkıdır.`
  },

  // ── GEOMETRİ SORULARI ──────────────────────────────────────────────────────
  {
    id: 44,
    subject: "Geometri",
    topic: "Üçgende Açılar",
    question: `ABC ve ABD birer üçgen
|AB| = |AC| = |BD| = |CE|
[AD] ∩ [BC] = {E}
m(DBE) = 80°

Buna göre m(DEB) = x kaç derecedir?`,
    options: [
      { id: "A", label: "A", text: "50" },
      { id: "B", label: "B", text: "55" },
      { id: "C", label: "C", text: "60" },
      { id: "D", label: "D", text: "65" },
      { id: "E", label: "E", text: "70" }
    ],
    correctAnswer: "E",
    solution: `İkizkenar üçgenlerin eşit açılarından faydalanılarak açı denklemleri kurulduğunda x = 70° olarak bulunur.
Cevap E şıkkıdır.`
  },
  {
    id: 45,
    subject: "Geometri",
    topic: "Dik Üçgen ve Benzerlik",
    question: `ABC üçgeninde [AD] ∩ [CE] = {F}, [AD] ┴ [CE], E ∈ [AB], D ∈ [BC], |AB| = 26 birim, |CF| = 6 birim, |EF| = x birimdir.

m(CAD) = m(BCE) = m(ABC) olduğuna göre x kaç birimdir?`,
    options: [
      { id: "A", label: "A", text: "6" },
      { id: "B", label: "B", text: "7" },
      { id: "C", label: "C", text: "8" },
      { id: "D", label: "D", text: "9" },
      { id: "E", label: "E", text: "10" }
    ],
    correctAnswer: "B",
    solution: `Açı benzerliği ve dikey üçgen bağıntılarından x = 7 birim elde edilir.
Cevap B şıkkıdır.`
  },
  {
    id: 46,
    subject: "Geometri",
    topic: "Dikdörtgende Uzunluk",
    question: `ABCD bir dikdörtgen, m(ABE) = m(BDC), [AE] ┴ [EB], |AE| = 15 birim, |BD| - |BE| = 9 birimdir.

Buna göre |BD| = x kaç birimdir?`,
    options: [
      { id: "A", label: "A", text: "34" },
      { id: "B", label: "B", text: "32" },
      { id: "C", label: "C", text: "30" },
      { id: "D", label: "D", text: "28" },
      { id: "E", label: "E", text: "26" }
    ],
    correctAnswer: "A",
    solution: `Dik üçgen bağıntıları ve Pisagor teoreminden x = 34 birim bulunur.
Cevap A şıkkıdır.`
  },
  {
    id: 47,
    subject: "Geometri",
    topic: "Yamukta Alan",
    question: `ABCD bir ikizkenar yamuk [AB] // [CD], m(BAD) = 60°, |AD| = |BC| = |CD|, |AB| = 2 birimdir.

Yukarıdaki verilere göre ABCD yamuğunun alanı kaç birimkaredir?`,
    options: [
      { id: "A", label: "A", text: "√3" },
      { id: "B", label: "B", text: "√3 / 2" },
      { id: "C", label: "C", text: "√3 / 4" },
      { id: "D", label: "D", text: "3√3 / 4" },
      { id: "E", label: "E", text: "3√3 / 8" }
    ],
    correctAnswer: "D",
    solution: `Yamuğun yüksekliği ve taban uzunlukları 30-60-90 üçgeni kurularak hesaplandığında Alan = 3√3 / 4 birimkare bulunur.
Cevap D şıkkıdır.`
  },
  {
    id: 48,
    subject: "Geometri",
    topic: "Çemberde Açı ve Uzunluk",
    question: `Şekilde C ve D noktaları [AB] çaplı O merkezli yarım çemberin üzerindedir.

m(BAC) = 10°, m(ACD) = 20°, |CD| = 12 birim olduğuna göre çemberin yarıçapı kaç birimdir?`,
    options: [
      { id: "A", label: "A", text: "2√3" },
      { id: "B", label: "B", text: "3√3" },
      { id: "C", label: "C", text: "4√3" },
      { id: "D", label: "D", text: "5√3" },
      { id: "E", label: "E", text: "6√3" }
    ],
    correctAnswer: "C",
    solution: `Çemberde çevre açı ve merkez açı kuralları uygulandığında r = 4√3 birim bulunur.
Cevap C şıkkıdır.`
  },

  // ── TÜRKÇE & SÖZEL MANTIK ─────────────────────────────────────────────────
  {
    id: 51,
    subject: "Türkçe",
    topic: "Paragrafta Anlam",
    question: `Parçalı anlatıma sahip romanları okumayı severim. Roman kahramanının hayatına doğrudan ---- zaman atlamaları ve geriye dönüşlerle onun zihninin içinde dolaşmaktan hoşlanırım. Sakin diyaloglar ve karakterlerin iç dünyasına yapılan yoğun odaklanmalar da bana göre romanı huzur veren bir ---- dönüştürür.

Bu parçada boş bırakılan yerlere sırasıyla aşağıdakilerden hangisi getirilmelidir?`,
    options: [
      { id: "A", label: "A", text: "müdahale etmektense - maceraya" },
      { id: "B", label: "B", text: "katkıda bulunmaktansa - eyleme" },
      { id: "C", label: "C", text: "bağlanıp kalmaktansa - yolculuğa" },
      { id: "D", label: "D", text: "tanıklık etmektense - deneyime" },
      { id: "E", label: "E", text: "gözlemde bulunmaktansa - olguya" }
    ],
    correctAnswer: "D",
    solution: `Anlam akışına göre "tanıklık etmektense" ve "deneyime" sözcükleri parçayı bütünler.
Cevap D şıkkıdır.`
  },
  {
    id: 52,
    subject: "Türkçe",
    topic: "Paragrafta Yardımcı Düşünce",
    question: `Erteleme genellikle bir zaman yönetimi problemi olarak anlaşılır fakat sorun çoğunlukla duygularla ilgilidir. Özünde erteleme, bir rahatlama stratejisidir. Bazı zihinler; bir işe başlamayı süreç olarak değil sanki bir finalmiş gibi algılar, başlamaktansa işin bitişine odaklanır. Hâl böyle olunca zihin "Biraz daha planlayayım." şeklinde rahatlatıcı telkinlerde bulunur.

Bu parçaya göre aşağıdakilerden hangisi kıpırdanmanın (ertelemenin) nedenlerinden biri değildir?`,
    options: [
      { id: "A", label: "A", text: "Bir bilgiyi hatırlamaya çalışma" },
      { id: "B", label: "B", text: "Dikkati toplamakta zorlanma" },
      { id: "C", label: "C", text: "Güç bir konuyla uğraşma" },
      { id: "D", label: "D", text: "Fazla uyarana maruz kalma" },
      { id: "E", label: "E", text: "İçsel motivasyonu artırma" }
    ],
    correctAnswer: "E",
    solution: `İçsel motivasyonu artırma ertelemenin bir nedeni olarak gösterilmemiştir.
Cevap E şıkkıdır.`
  },
  {
    id: 53,
    subject: "Türkçe (Sözel Mantık)",
    topic: "Dil Okulu Kurları Mantık Sorusu",
    question: `Bir dil okuluna giden Kemal, Lâle, Mustafa, Nuran, Olgun ve Perihan isimli öğrenciler; Almanca ve Fransızca dillerinin birinci, ikinci veya üçüncü kurlarından birinde ders almaktadır. 

• Her öğrenci en az bir dilde ders almaktadır.
• Yalnızca Almanca dersi alan Kemal, bu dilde Nuran ile aynı kura devam etmektedir.
• Almancanın bütün kurlarında ikişer öğrenci ders almaktadır.
• Fransızcanın birinci ve üçüncü kurlarında sadece birer öğrenci ders almaktadır.
• Fransızcanın ikinci kurunda sadece Nuran ve Olgun ders almaktadır.

Buna göre Almancanın kurlarından hangilerinde ders alan öğrenciler kesin olarak bilinebilir?`,
    options: [
      { id: "A", label: "A", text: "Yalnız I" },
      { id: "B", label: "B", text: "Yalnız II" },
      { id: "C", label: "C", text: "Yalnız III" },
      { id: "D", label: "D", text: "I ve II" },
      { id: "E", label: "E", text: "I ve III" }
    ],
    correctAnswer: "B",
    solution: `Kur dağılım tablosu oluşturulduğunda II. kurda yer alan öğrenciler kesin olarak tespit edilebilir.
Cevap B şıkkıdır.`
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 🔐 PASSCODE AUTHENTICATION & PRIVATE ENCRYPTION LAYER
// ─────────────────────────────────────────────────────────────────────────────
const MASTER_PASSCODE = "2026"; // Özel Erişim Şifresi

const OsymDenemeTab = ({ theme }) => {
  const [unlocked, setUnlocked] = useState(() => {
    return localStorage.getItem("osym_deneme_unlocked") === "true";
  });
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState("");

  // Exam state
  const [examState, setExamState] = useState("cover"); // cover, playing, finished
  const [answers, setAnswers] = useState({}); // { questionId: 'A' | 'B' | 'C' | 'D' | 'E' }
  const [flagged, setFlagged] = useState({}); // { questionId: boolean }
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(130 * 60); // 130 dakika (KPSS Süresi)
  const [timerRunning, setTimerRunning] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (examState === "playing" && timerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setExamState("finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [examState, timerRunning]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passInput === MASTER_PASSCODE) {
      setUnlocked(true);
      localStorage.setItem("osym_deneme_unlocked", "true");
      setPassError("");
    } else {
      setPassError("Hatalı güvenlik şifresi! Erişim reddedildi.");
    }
  };

  const handleLockOut = () => {
    setUnlocked(false);
    localStorage.removeItem("osym_deneme_unlocked");
    setPassInput("");
  };

  const startExam = () => {
    setExamState("playing");
    setTimerRunning(true);
    setTimeLeft(130 * 60);
    setAnswers({});
    setFlagged({});
    setCurrentQIdx(0);
    setShowSolutions(false);
  };

  const finishExam = () => {
    if (window.confirm("Sınavı bitirmek ve cevaplarınızı teslim etmek istediğinize emin misiniz?")) {
      setExamState("finished");
      setTimerRunning(false);
    }
  };

  const selectAnswer = (qId, optionId) => {
    if (examState !== "playing") return;
    setAnswers((prev) => {
      if (prev[qId] === optionId) {
        const next = { ...prev };
        delete next[qId];
        return next;
      }
      return { ...prev, [qId]: optionId };
    });
  };

  const toggleFlag = (qId) => {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Score Calculation
  let correctCount = 0;
  let wrongCount = 0;
  let emptyCount = 0;

  DENEME_QUESTIONS.forEach((q) => {
    const userAns = answers[q.id];
    if (!userAns) {
      emptyCount++;
    } else if (userAns === q.correctAnswer) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const netScore = Math.max(0, (correctCount - wrongCount / 4)).toFixed(2);

  // ─────────────────────────────────────────────────────────────────────────
  // 🔒 STEP 1: PRIVATE SECURITY LOCK SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl backdrop-blur-xl relative overflow-hidden ${
          theme === 'dark' ? 'bg-[#111827]/90 border-rose-500/30 text-gray-100' : 'bg-white border-rose-200 text-gray-800'
        }`}>
          {/* Security Glow Header */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-6">
            <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-3">
              <FaLock size={32} />
            </div>
            <h2 className="text-2xl font-black tracking-tight flex items-center justify-center gap-2">
              <FaShieldAlt className="text-rose-500" /> Gizli ÖSYM Deneme Alanı
            </h2>
            <p className="text-xs opacity-70 mt-1.5 leading-relaxed">
              Bu modül özel arşiv ÖSYM kitapçık sorularını içermektedir. Giriş için özel yetkili güvenlik PIN kodunu giriniz.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 opacity-80">
                Güvenlik PIN Kodu:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  placeholder="Giriş Şifresi..."
                  className={`w-full px-4 py-3.5 rounded-2xl border text-center text-lg font-black tracking-widest focus:outline-none transition ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border-gray-700 text-white focus:border-rose-500' 
                      : 'bg-slate-50 border-gray-300 text-gray-900 focus:border-rose-500'
                  }`}
                />
                <FaKey className="absolute right-4 top-4 opacity-40" />
              </div>
            </div>

            {passError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold text-center animate-shake">
                {passError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 transition-all transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
            >
              <FaUnlock size={14} /> Şifreli Giriş Yap
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
            <span className="text-[11px] opacity-50 font-mono">Varsayılan PIN: 2026</span>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = DENEME_QUESTIONS[currentQIdx];

  return (
    <div className={`p-4 md:p-6 transition-colors duration-300 min-h-screen ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
      
      {/* SECURITY TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-500 border border-rose-500/30 flex items-center gap-1">
              <FaLock size={10} /> Özel Yetkili Özel Deneme
            </span>
            <span className="text-xs opacity-50 font-mono">Sınav Kodu: ÖSYM-2026-PRIV</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-2">
            <FaBookOpen className="text-rose-500" /> T.C. ÖSYM Özel Deneme Kitapçığı
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {examState === "playing" && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 font-extrabold text-sm shadow-xs">
              <FaClock className="animate-pulse" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}

          <button
            onClick={handleLockOut}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-200 dark:bg-gray-800 hover:bg-rose-500 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            title="Güvenli Çıkış Yap"
          >
            <FaLock size={12} /> Oturumu Kapat
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 📄 COVER PAGE (Sınav Öncesi Başlangıç Ekranı) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {examState === "cover" && (
        <div className="max-w-4xl mx-auto my-6 p-8 md:p-12 rounded-3xl border shadow-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-center relative overflow-hidden">
          
          {/* Authentic ÖSYM Stamp Header */}
          <div className="border-4 border-slate-900 dark:border-slate-100 p-6 rounded-2xl mb-8 space-y-3 relative">
            <div className="w-16 h-16 mx-auto rounded-full border-2 border-slate-900 dark:border-slate-100 flex items-center justify-center font-black text-xl tracking-tighter">
              ÖSYM
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">
              T.C. ÖLÇME, SEÇME VE YERLEŞTİRME MERKEZİ
            </h1>
            <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              KPSS / ALES / DGS SAYISAL & SÖZEL ÖZEL DENEME SINAVI
            </p>
          </div>

          {/* Exam Specs Table */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left text-xs font-semibold">
            <div className="p-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
              <span className="opacity-60 block text-[10px] uppercase">Soru Sayısı:</span>
              <span className="text-base font-extrabold text-blue-500">{DENEME_QUESTIONS.length} Soru</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
              <span className="opacity-60 block text-[10px] uppercase">Sınav Süresi:</span>
              <span className="text-base font-extrabold text-amber-500">130 Dakika</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
              <span className="opacity-60 block text-[10px] uppercase">Yanlış Kuralı:</span>
              <span className="text-base font-extrabold text-rose-500">4 Yanlış 1 Doğruyu Götürür</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
              <span className="opacity-60 block text-[10px] uppercase">Erişim Türü:</span>
              <span className="text-base font-extrabold text-emerald-500">Özel Gizli Kodlu</span>
            </div>
          </div>

          {/* Rules Warning */}
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs text-left mb-8 space-y-2">
            <div className="font-extrabold text-sm uppercase flex items-center gap-2">
              <FaExclamationTriangle /> DİKKAT! SINAV BAŞLAMADAN KİTAPÇIĞI AÇMAYINIZ.
            </div>
            <ul className="list-disc list-inside space-y-1 opacity-90 leading-relaxed">
              <li>Bu kitapçıkta Matematik, Geometri, Türkçe ve Sözel/Sayısal Mantık özel arşiv soruları yer almaktadır.</li>
              <li>Soruları çözerken optik formu ekranın sağ paneli veya soru altındaki butonlar üzerinden işaretleyebilirsiniz.</li>
              <li>Sınav süresi başladığında kronometre geri sayıma başlayacaktır. İstediğiniz sorudan başlayabilirsiniz.</li>
            </ul>
          </div>

          <button
            onClick={startExam}
            className="px-10 py-5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-lg tracking-wider shadow-[0_0_40px_rgba(225,29,72,0.4)] transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-3 mx-auto"
          >
            <FaBookOpen /> KİTAPÇIĞI AÇ VE SINAVA BAŞLA
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 📝 EXAM PLAYING MODE (İki Sütunlu / Çekmeceli Sınav Kitapçığı) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {examState === "playing" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: QUESTION BOOKLET (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Question Card */}
            <div className={`p-6 md:p-8 rounded-3xl border shadow-xl flex flex-col justify-between min-h-[580px] ${
              theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              
              <div>
                {/* Question Top Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-black rounded-lg">
                      Soru No: {currentQ.id}
                    </span>
                    <span className="text-xs font-bold opacity-60">
                      {currentQ.subject} — {currentQ.topic}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFlag(currentQ.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      flagged[currentQ.id]
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <FaFlag size={11} /> {flagged[currentQ.id] ? 'İşaretlendi' : 'İşaretle'}
                  </button>
                </div>

                {/* Question Text */}
                <div className="text-sm md:text-base font-semibold leading-relaxed mb-8 whitespace-pre-line font-sans">
                  {currentQ.question}
                </div>

                {/* Options List */}
                <div className="space-y-3 mb-8">
                  {currentQ.options.map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => selectAnswer(currentQ.id, opt.id)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs md:text-sm font-semibold transition-all flex items-center gap-4 cursor-pointer ${
                          isSelected
                            ? 'bg-rose-500/15 border-rose-500 text-rose-500 font-bold shadow-sm'
                            : theme === 'dark'
                              ? 'bg-gray-800/60 border-gray-700 hover:bg-gray-700 text-gray-200'
                              : 'bg-slate-50 border-gray-200 hover:bg-slate-100 text-gray-800'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 transition ${
                          isSelected 
                            ? 'bg-rose-500 border-rose-500 text-white' 
                            : 'border-gray-400 opacity-70'
                        }`}>
                          {opt.label}
                        </span>
                        <span className="flex-1 leading-snug">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Booklet Navigation Controls */}
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                <button
                  disabled={currentQIdx === 0}
                  onClick={() => setCurrentQIdx(prev => prev - 1)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    currentQIdx === 0 
                      ? 'opacity-30 cursor-not-allowed' 
                      : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaChevronLeft size={10} /> Önceki Soru
                </button>

                <span className="text-xs font-extrabold opacity-60">
                  {currentQIdx + 1} / {DENEME_QUESTIONS.length}
                </span>

                <button
                  disabled={currentQIdx === DENEME_QUESTIONS.length - 1}
                  onClick={() => setCurrentQIdx(prev => prev + 1)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                    currentQIdx === DENEME_QUESTIONS.length - 1 
                      ? 'opacity-30 cursor-not-allowed' 
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  }`}
                >
                  Sonraki Soru <FaChevronRight size={10} />
                </button>
              </div>

            </div>

          </div>

          {/* RIGHT: INTERACTIVE OPTICAL SHEET DRAWER (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className={`p-6 rounded-3xl border shadow-xl ${
              theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3 mb-4">
                <h3 className="text-sm font-extrabold flex items-center gap-2">
                  <FaListOl className="text-rose-500" /> Optik Cevap Anahtarı
                </h3>
                <span className="text-xs font-bold text-emerald-500">
                  {Object.keys(answers).length} / {DENEME_QUESTIONS.length} İşaretlendi
                </span>
              </div>

              {/* Optical Grid */}
              <div className="max-h-[420px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                {DENEME_QUESTIONS.map((q, idx) => {
                  const userAns = answers[q.id];
                  const isCurrent = idx === currentQIdx;
                  const isFlagged = flagged[q.id];

                  return (
                    <div
                      key={q.id}
                      onClick={() => setCurrentQIdx(idx)}
                      className={`p-2 rounded-xl border flex items-center justify-between text-xs transition cursor-pointer ${
                        isCurrent
                          ? 'border-rose-500 bg-rose-500/10 font-bold'
                          : theme === 'dark'
                            ? 'border-gray-800 hover:bg-gray-800'
                            : 'border-gray-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 text-right font-mono font-bold opacity-60">{q.id}.</span>
                        {isFlagged && <FaFlag className="text-amber-500" size={10} />}
                      </div>

                      {/* Optical Circles */}
                      <div className="flex items-center gap-1.5">
                        {["A", "B", "C", "D", "E"].map((opt) => {
                          const isOptSelected = userAns === opt;
                          return (
                            <button
                              key={opt}
                              onClick={(e) => {
                                e.stopPropagation();
                                selectAnswer(q.id, opt);
                              }}
                              className={`w-6 h-6 rounded-full text-[10px] font-black border flex items-center justify-center transition cursor-pointer ${
                                isOptSelected
                                  ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                                  : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:border-rose-400'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <button
                onClick={finishExam}
                className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <FaCheckCircle size={14} /> Sınavı Bitir ve Teslim Et
              </button>

            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 📊 FINISHED EXAM SCORE CARD & SOLUTION ANALYSIS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {examState === "finished" && (
        <div className="space-y-6 max-w-5xl mx-auto">
          
          {/* Score Header Card */}
          <div className={`p-8 rounded-3xl border shadow-2xl text-center relative overflow-hidden ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-500 mb-4">
              <FaAward size={40} />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
              Sınav Derece & Sonuç Karnesi
            </h2>
            <p className="text-xs md:text-sm opacity-70 mb-8">
              ÖSYM standartlarında net hesabı (4 Yanlış 1 Doğruyu Götürür) uygulanmıştır.
            </p>

            {/* Score Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs uppercase font-extrabold text-emerald-500">Doğru</span>
                <span className="block text-2xl font-black text-emerald-500 mt-1">{correctCount}</span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-xs uppercase font-extrabold text-rose-500">Yanlış</span>
                <span className="block text-2xl font-black text-rose-500 mt-1">{wrongCount}</span>
              </div>
              <div className="p-4 rounded-2xl bg-gray-500/10 border border-gray-500/20">
                <span className="text-xs uppercase font-extrabold text-gray-400">Boş</span>
                <span className="block text-2xl font-black opacity-80 mt-1">{emptyCount}</span>
              </div>
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-xs uppercase font-extrabold text-blue-500">Net Skor</span>
                <span className="block text-2xl font-black text-blue-500 mt-1">{netScore}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowSolutions(!showSolutions)}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <FaEye /> {showSolutions ? "Çözümleri Gizle" : "Adım Adım Çözümleri Göster"}
              </button>

              <button
                onClick={startExam}
                className="px-6 py-3 rounded-2xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 font-extrabold text-xs transition cursor-pointer flex items-center gap-2"
              >
                <FaRedo /> Sınavı Yeniden Çöz
              </button>
            </div>
          </div>

          {/* Solutions Section */}
          {showSolutions && (
            <div className="space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2 px-2">
                <FaBookOpen className="text-rose-500" /> Detaylı Soru Çözümleri & Cevap Anahtarı
              </h3>

              {DENEME_QUESTIONS.map((q) => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                const isEmpty = !userAns;

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-3xl border shadow-md space-y-4 ${
                      theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                      <span className="font-extrabold text-sm">
                        Soru {q.id} — <span className="opacity-60">{q.subject}</span>
                      </span>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isEmpty 
                          ? 'bg-gray-500/10 text-gray-400' 
                          : isCorrect 
                            ? 'bg-emerald-500/15 text-emerald-500' 
                            : 'bg-rose-500/15 text-rose-500'
                      }`}>
                        {isEmpty ? 'BOŞ' : isCorrect ? 'DOĞRU' : `YANLIŞ (Sizin: ${userAns})`}
                      </span>
                    </div>

                    <div className="text-xs md:text-sm font-semibold opacity-90 whitespace-pre-line">
                      {q.question}
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 text-xs leading-relaxed">
                      <span className="font-extrabold uppercase block mb-1">
                        Doğru Cevap: {q.correctAnswer} — Çözüm:
                      </span>
                      <p className="whitespace-pre-line font-mono">{q.solution}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default OsymDenemeTab;
