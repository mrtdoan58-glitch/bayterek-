import { FrequencyKey } from "./ontology";

export interface VarlikIcerik {
  slug: string;
  frekans: FrequencyKey;
  ad: string;
  etiket: string;
  acilis: string;
  kalpTip: "katmanlar" | "kutuplar" | "psikoloji" | "catismali";
  // derin lore (yeni — atmosferik derinlik)
  lore: string;
  // semboller (yeni)
  semboller: { ad: string; anlam: string }[];
  // ilişkili varlıklar (yeni — rabbit hole)
  iliskili: { ad: string; not: string; frekans: FrequencyKey }[];
  bilgi: { label: string; baslik: string; metin: string; not: string };
  tur: "pillar" | "satellite";
}

export const CANON: Record<FrequencyKey, VarlikIcerik> = {
  KOZMOS: {
    slug: "kozmos", frekans: "KOZMOS", ad: "Kozmos", etiket: "EVRENİN YAPISI", tur: "pillar",
    acilis:
      "Önce su vardı. Suyun üstünde gök. Aralarında henüz hiçbir şey yoktu — ne ad, ne yön, ne bakan bir göz. Sonra bir eksen dikildi ortaya, ve evren üç oldu: yukarısı, ortası, aşağısı. Bunun ne zaman olduğunu soran yok. Soracak kimse o zaman henüz yoktu.",
    kalpTip: "katmanlar",
    lore: "Üç dünya üst üste durur. Aralarında tek bir eksen.\n\nEn üstte gök. Kat kat, kimine göre yedi, kimine göre dokuz, kimine göre on yedi. Sayı önemli değil; önemli olan yukarı doğru gittikçe ışığın artması, ağırlığın azalması. En üstte oturan bir irade var. Aşağıya pek bakmaz.\n\nOrtada yer. İnsanın durduğu ince katman. İki dünyanın arasında, ikisine de ait değil. Buradan yukarısı da görünür, aşağısı da; ama buradan çıkış yalnızca eksendendir.\n\nEn altta karanlık. Işığın inmediği derinlik. Oraya bir kez inenin geri dönüşü, dönebildiyse, kolay olmadı.\n\nBu üçünü birbirine bağlayan ağaçtır. Kökü en altta, gövdesi ortada, dalları en üstte. Bir ağaç değil tam olarak — evrenin durma biçimi. Kaldırsan, üç dünya birbirinin üstüne çöker.\n\nİnsan bu yapının ortasında durur. Yapı insan için kurulmadı. İnsan geldiğinde yapı çoktan oradaydı.",
    semboller: [
      { ad: "Dünya Ağacı", anlam: "Üç dünyayı bağlayan eksen. Harita değil; evrenin ayakta durma biçimi." },
      { ad: "Üç Katman", anlam: "Gök, yer, yer altı. Sayı değişir; yukarı-orta-aşağı değişmez." },
      { ad: "Su", anlam: "Başlangıcın maddesi. Her şeyden önce var olan, her şeyin içinden geçen." },
    ],
    iliskili: [
      { ad: "Tengri", not: "Göğün tepesindeki irade", frekans: "TENGRI" },
      { ad: "Erlik Han", not: "Köklerin karanlığı", frekans: "ALBASTI" },
      { ad: "Şaman", not: "Eksende yolculuk eden tek kişi", frekans: "KOZMOS" },
    ],
    bilgi: {
      label: "Dünya Ağacı", baslik: "Üç dünyayı bağlayan tek şey",
      metin: "Bu evrenin bir merkezi yoktur, bir ekseni vardır. Fark önemlidir. Merkez, etrafında bir şey döndüğünü ima eder. Eksen yalnızca tutar.\n\nŞaman o eksende yolculuk eder; davulunun sesi onu yukarı çıkarır ya da aşağı indirir. Geri kalan herkes ortada kalır, kendi katmanında. Yukarısını ve aşağısını yalnızca anlatılardan bilir.",
      not: "Üç dünya modeli farklı Türk ve Altay topluluklarında farklı kat sayılarıyla, farklı adlarla anlatılır. Buradaki yapı en yaygın aktarımı izler. Sayılar değişir; yukarı, orta, aşağı değişmez.",
    },
  },
  TENGRI: {
    slug: "tengri", frekans: "TENGRI", ad: "Tengri", etiket: "GÖĞÜN İRADESİ", tur: "pillar",
    acilis:
      "Tengri'nin adı gökten gelir. Ama Tengri gök değildir; göğün diledikleridir. Bir şey ister, ve o şey olur — gürültüsüz, kanıtsız, karşı çıkılmadan. Neyi ilk dilediğini soran çıkmıştır. Cevap veren çıkmamıştır. Belki de ilk dilek hâlâ sürüyor.",
    kalpTip: "kutuplar",
    lore: "Tengri yukarıda. Bu cümle eksik. Çünkü yukarısı, ancak bir aşağısı varsa yukarıdır.\n\nEksenin dibinde Erlik durur. Tengri yapar, Erlik bozar. Tengri düzen koyar, Erlik o düzenin kenarını kemirir. İkisi karşı karşıya değildir — biri öbürünün varlık sebebidir. Tengri tek başına dilese, dileğine direnen hiçbir şey olmaz; ve direnci olmayan irade, irade olduğunu bile bilmez.\n\nKağana yetkiyi Tengri verir. Ama o yetki, kağanın onu kaybedebileceği bir dünyada anlam taşır — Erlik'in çektiği, bozduğu, geri aldığı bir dünyada. Gökten inen güç, ancak yerde sınanırsa güçtür.\n\nTengri buyurmaz aslında. Buyurmak, karşısında itiraz olabileceğini varsayar. Tengri yalnızca diler, ve dilek ile gerçek arasındaki mesafe Erlik'tir. O mesafe olmasa, Tengri'nin dilemesiyle olması aynı an olurdu — ve hiçbir şey anlamını bulamazdı.\n\nİkisi düşman değil. Gerilim düşmanlık değildir. Bir yayın iki ucu birbirinin düşmanı değildir; gerginlik olmadan ok atılmaz.",
    semboller: [
      { ad: "Mavi Gök", anlam: "Tengri'nin kendisi değil, Tengri'nin göründüğü yer. Sınırsız, her yöne açık." },
      { ad: "Yay", anlam: "İki ucun gerilimi. Düşmanlık değil, işlevsel çekişme." },
      { ad: "Kut", anlam: "Gökten inen yetki. Verilir, taşınır, kaybedilebilir." },
    ],
    iliskili: [
      { ad: "Erlik Han", not: "Karşıt irade — aşağı çeken", frekans: "ALBASTI" },
      { ad: "Ülgen", not: "Yaratıcı el — yukarıdan gelen", frekans: "TENGRI" },
      { ad: "Kozmos", not: "İradenin durduğu eksen", frekans: "KOZMOS" },
    ],
    bilgi: {
      label: "İrade Nedir", baslik: "Bir tanrı ne ister?",
      metin: "Tengri'yi tek başına anlatmak, bir elin tek parmağını anlatmaya benzer. Mümkün, ama eksik.\n\nEski yazıtlarda kağanın gücü 'Tengri gibi' sözüyle anılır — gökten inen, yerde tutulan bir yetki. Bu yetki bir armağan değildi; bir yüktü. Tengri verir, ve verdiği şeyin taşınıp taşınmadığına bakar. Bakar, ama karışmaz. İrade dilemekle biter; gerisi yerde olanların işidir.",
      not: "'Tengri' farklı topluluklarda hem gök hem en yüce irade anlamında kullanılır; sınırı boylar arasında değişir. Burada Tengri'yi karşıtıyla birlikte aktardık. Erlik'i çıkarırsan, Tengri'nin dilemesi boşa düşer — dilenecek bir direnç kalmaz.",
    },
  },
  ALBASTI: {
    slug: "albasti", frekans: "ALBASTI", ad: "Albastı", etiket: "ALT DÜNYA · LOHUSA KORKUSU", tur: "pillar",
    acilis:
      "Al — kızıl. Bastı — üstüne çöken. Adını duyduğun an yarısını bilirsin: kızıl bir şey, ve çöküyor. Lohusayı bastığına, yeni doğanı aldığına inanılır. Hangi kızıllık olduğunu kimse söylemez. Kan da denir, ateş de, lohusanın gözü kapanmadan gördüğü son ışık da. Orada bulunan kimse geri dönüp anlatmadı.",
    kalpTip: "psikoloji",
    lore: "Albastı uzakta yaşamaz. Gökte değil, dağın ardında değil. Albastı eşiktedir.\n\nDoğum başlayınca gelir. Suya yakın durur — derenin kıyısında, su kabının dibinde, ıslak bezin altında. Lohusa terler, titrer, ateşi yükselir. Odanın bir köşesinde bir ağırlık olur. Anne onu göremez. Sırtının döndüğü köşede hisseder.\n\nKimi anlatıda uzun saçlıdır, saçını tarar. Kimi anlatıda kediye döner, keçiye. Kimi anlatıda hiç biçimi yoktur — yalnızca göğsün üstüne oturan bir basınç. Ayrıntı boydan boya değişir. Yakınlığı değişmez. Albastı hep çok yakındır. Nefes mesafesinde.\n\nCiğer aldığı söylenir. Lohusanın ciğerini suya götürdüğü, suya değdirdiği. Suya değdiği an annenin gittiği.\n\nEşiğe demir konur. Bıçak, iğne, nal. Demiri geçmez. Lohusa kırk gün yalnız kalmaz. Biri hep yanında oturur, biri hep uyanık. Karanlık basınca bir kandil yakılır, sabaha kadar söndürülmez.",
    semboller: [
      { ad: "Kızıl", anlam: "Kan, doğum, tehlike — yaşamın ve ölümün aynı renkte buluşması." },
      { ad: "Demir", anlam: "Koruyucu sınır; eşiğe konan, varlığı geçirmeyen madde." },
      { ad: "Su Kıyısı", anlam: "İki dünya arasındaki geçit; varlığın beklediği eşik." },
    ],
    iliskili: [
      { ad: "Erlik Han", not: "Alt dünyanın efendisi", frekans: "ALBASTI" },
      { ad: "Umay Ana", not: "Karşıt güç — doğumun koruyucusu", frekans: "TENGRI" },
      { ad: "Köroğlu", not: "Sınırda duran bir başka varlık", frekans: "KOROGLU" },
    ],
    bilgi: {
      label: "Psikolojik Okuma", baslik: "Bir korkuya verilen yüz",
      metin: "Albastı bir yaratık değil. Ya da yalnızca yaratık değil.\n\nDoğum, bir kadının ölmesi için en olası gecelerden biriydi. Sebebi görünmezdi, gelişi ani. O gece, o odada, görünmeyen bir şey gelip en güçlü kadını alıyordu, ve kimse neden olduğunu söyleyemiyordu. O görünmeyen şeyin bir adı oldu. Bir yüzü, bir biçimi, kızıl bir rengi. Adı konan korkunun yanında durulur; adı konmayanın yanında durulmaz.\n\nDemir o ateşi düşürmedi. Kandil o geceyi kısaltmadı. Ama biri o eşikte oturdu, biri o odada uyanık kaldı, ve o kadın o gece yalnız değildi. Albastı kırk gün boyunca eşikte bekledi. Eşikte, çünkü içeride biri vardı.",
      not: "Bu bir halk inancıdır. Bölgeden bölgeye, evden eve değişir; kesin bir kayıt değildir. Albastı'yı korkusuyla birlikte bıraktık. Korkuyu çıkarırsan, geriye Albastı kalmaz.",
    },
  },
  KOROGLU: {
    slug: "koroglu", frekans: "KOROGLU", ad: "Köroğlu", etiket: "?", tur: "satellite",
    acilis:
      "Köroğlu'nun kim olduğunu biliyoruz. Fazlasıyla biliyoruz. Bir kahraman, diyor biri. Yaşamış bir âşık, diyor öbürü. Yerin gönderdiği bir ad, diyor üçüncüsü. Üçü de elinde bir kaynak tutuyor, üçü de haklı. Aralarından birini seçmeye kalkınca diğer ikisi hâlâ orada duruyor, susmadan.",
    kalpTip: "catismali",
    lore: "Üçü de aynı sayfada. Biri kalkıp diğerini yalanlamıyor; yan yana duruyorlar, ve yan yana durdukça birbirlerini eskitiyorlar.\n\nDestan kahramanını anlatır; tarih o kahramanın belgesini bulamaz. Tarih bir eşkıyadan söz eder; halk onun mezardan geldiğini söyler. Halk yeraltını işaret eder; destan onu çoktan göğe çıkarmıştır.\n\nÜç ok, üç ayrı yöne. Köroğlu hepsinin değdiği nokta.",
    semboller: [
      { ad: "Kırat", anlam: "Kahraman ile hayvanın birleştiği yer. Kırat olmadan Köroğlu yere düşer." },
      { ad: "Saz", anlam: "Savaşçının âşık olduğu an. Şiddet ve şiir aynı elde." },
      { ad: "Çamlıbel", anlam: "Sığınak mı, sürgün mü? Kaçışın adı mı, direnişin kalesi mi?" },
    ],
    iliskili: [
      { ad: "Ergenekon", not: "Destan dünyası", frekans: "KOZMOS" },
      { ad: "Erlik Han", not: "Yerin gölgesi", frekans: "ALBASTI" },
      { ad: "Tengri", not: "Direnişin iradesi", frekans: "TENGRI" },
    ],
    bilgi: {
      label: "Çatlak", baslik: "Neden hiçbir dünyaya tam ait değil",
      metin: "Albastı bir korkuydu — adlandırınca yanında durulabildi. Kozmos bir yapıydı — ekseni görününce yerini bulduk. Tengri bir gerilimdi — karşıtını bilince anlaşıldı. Hepsinin bir tutamağı vardı.\n\nKöroğlu'nun tutamağı yok. Onu bir dünyaya koymaya kalkışırsan, bir başka dünya itiraz eder. İnsan dersen, yer altı çağırır. Mit dersen, tarih karışır. Tarih dersen, destan güler.",
      not: "Diğer varlıkları bir notla kapatabildik: 'bu bir efsanedir.' Köroğlu'nu kapatamıyoruz. Onu tanımlayan şey, tanımlanamamasıdır. Bu çatlak kapanmıyor.\n\nBunu bir eksiklik sanma. Her mitolojide böyle figürler vardır — sınıfların sızdığı, kategorinin tutmadığı yerler. Onlar sistemin hatası değil; sistemin nefes aldığı çatlaklardır.",
    },
  },
};

export function getCanon(frekans: FrequencyKey): VarlikIcerik {
  return CANON[frekans];
}
