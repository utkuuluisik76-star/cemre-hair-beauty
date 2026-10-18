// Concept content, intentionally separate from the reusable components.
export type CemreLocale = "tr" | "en";
export const bookingConfig = {
  demo: true,
  whatsappNumber: "900000000000",
  displayNumber: "+90 000 000 00 00",
};
export const cemre = {
  tr: {
    demo: "Cemre bir konsept çalışmasıdır. Görseller temsili, randevu akışı demodur.",
    nav: ["Bakımlar", "Önce & sonra", "Atmosfer"],
    cta: "Randevu Alın",
    skip: "İçeriğe geç",
    hero: "Bodrum’un kalbinde cildinize ve görünümünüze hak ettiği yeniliği katın",
    intro: "Kendinize ayırdığınız zaman, iyi hissetmenin en sade hali.",
    sub: "Saç, cilt ve bakım ritüelleri için Ege’den ilham alan sakin bir alan.",
    caption: "Salon atmosferi için üretilmiş konsept görsel.",
    servicesTitle: "Size iyi gelen bakımı seçin.",
    servicesText:
      "Saçınızdan cildinize, ihtiyacınıza göre şekillenen bir bakım planı.",
    services: [
      {
        title: "Cilt Bakımları",
        description:
          "Cildinizi tanımakla başlayan, günlük bakımınıza odaklanan bir yaklaşım.",
        items: [
          "Cilt analizi görüşmesi",
          "Nem odaklı bakım",
          "Kişisel bakım planı",
        ],
        icon: "face",
      },
      {
        title: "Saç Tasarım ve Bakım",
        description:
          "Doğal dokunuzu koruyan kesimler, yumuşak hareket ve özenli bitişler.",
        items: [
          "Kesim & şekillendirme",
          "Fön & saç bakımı",
          "Renk danışmanlığı",
        ],
        icon: "hair",
      },
      {
        title: "Akdeniz Wellness",
        description:
          "Güne kısa bir ara. Yavaşlamak ve kendinize zaman ayırmak için bakım ritüelleri.",
        items: [
          "Saç derisi bakım ritüeli",
          "El & tırnak bakımı",
          "Rahatlama odaklı bakım",
        ],
        icon: "sun",
      },
    ],
    select: "Bu bakımı seç",
    conceptMenu: "Örnek bakım menüsü · Hizmet kapsamı ve fiyatlar: TO CONFIRM",
    compareTitle: "Muhteşem Dönüşüme Tanık Olun",
    compareText:
      "Doğal hacimden yumuşak, parlak bir bitişe. Farkı görmek için çizgiyi kaydırın.",
    before: "Önce",
    after: "Sonra",
    compareLabel: "Önce ve sonra görsellerini karşılaştırın",
    compareNote:
      "Temsili, yapay olarak üretilmiş görsel karşılaştırmasıdır. Gerçek danışan veya işlem sonucu değildir.",
    bookingTitle: "Biraz zaman, sadece sizin için.",
    bookingText:
      "Bakımınızı seçin, tercihlerinizi ekleyin. Randevu talebinizi WhatsApp mesajı olarak hazırlayalım.",
    steps: ["Bakım", "Uzman", "Tarih & iletişim"],
    serviceLegend: "Hangi bakımı düşünüyorsunuz?",
    expertLegend: "Bir uzman tercihiniz var mı?",
    noPreference: "Tercihim yok",
    noPreferenceText: "Salonun yönlendirmesini tercih ediyorum.",
    expertOption: "Bir uzman belirtmek istiyorum",
    expertLabel: "Uzman tercihi (isteğe bağlı)",
    expertPlaceholder: "Tercih ettiğiniz uzman",
    expertNote:
      "Bu konseptte gerçek ekip listesi bulunmuyor. Tercihinizi not olarak ekleyebilirsiniz.",
    date: "Tercih ettiğiniz tarih",
    time: "Tercih ettiğiniz saat",
    name: "Adınız soyadınız",
    phone: "Telefon numaranız",
    note: "Notunuz (isteğe bağlı)",
    notePlaceholder: "Bakımınızla ilgili paylaşmak istediğiniz bir şey var mı?",
    availability:
      "Bu alanlar tercih belirtmek içindir; uygunluk takvimine bağlı değildir. Tarih, saat ve ücret salon tarafından ayrıca teyit edilir.",
    privacy:
      "Demo mesajına girdiğim bilgilerin ekleneceğini anladım. Sağlık bilgisi paylaşmıyorum.",
    next: "Devam edin",
    back: "Geri",
    prepare: "WhatsApp mesajını hazırlayın",
    preview: "Mesajınız hazır — henüz gönderilmedi.",
    demoNotice:
      "Demo numarası kullanılıyor. WhatsApp’a gönderim kapalıdır; bu işlem randevu oluşturmaz. Gerçek kişisel bilgi girmeyin.",
    copy: "Mesajı kopyalayın",
    copied: "Mesaj kopyalandı.",
    copyFail:
      "Kopyalama kullanılamıyor. Aşağıdaki mesajı seçip kopyalayabilirsiniz.",
    edit: "Bilgileri düzenleyin",
    messageLabel: "Türkçe WhatsApp mesajı önizlemesi",
    noJs: "Bu demo akışını kullanmak için JavaScript gerekir. Gerçek WhatsApp numarası henüz eklenmemiştir.",
    locationTitle: "Ege’nin ritminde, size ait bir mola.",
    locationText:
      "Doğal ışık, yalın malzemeler ve denizden ilham alan bir atmosfer. Cemre için düşündüğümüz alan böyle.",
    location: "Bodrum, Muğla",
    address: "Açık adres ve yol tarifi: TO CONFIRM",
    hours: "Çalışma saatleri: TO CONFIRM",
    mapNote: "Bölgesel harita · Salon konumu henüz belirlenmedi.",
    mapLink: "Bodrum’u haritada görüntüleyin",
    legal: "Bilgilendirme & gizlilik",
    legalItems: [
      [
        "Danışan gizliliği",
        "TO CONFIRM — Veri sorumlusu, işleme amaçları, saklama süreleri ve başvuru kanalı gerçek işletme bilgileriyle tamamlanmalıdır. Bu demo hiçbir bilgiyi sunucuya kaydetmez.",
      ],
      [
        "Randevu ve iptal koşulları",
        "TO CONFIRM — Ücretler, süreler, uygunluk ve iptal koşulları işletme tarafından teyit edilmelidir. WhatsApp talebi kesinleşmiş randevu değildir.",
      ],
      [
        "Bakım öncesi bilgilendirme",
        "TO CONFIRM — Uygulama kapsamı ve kişiye uygunluk yetkili ekip tarafından değerlendirilmelidir. Bu sayfada tıbbi tanı, tedavi veya sonuç garantisi verilmez.",
      ],
    ],
    footer: "Bodrum için bir hair & beauty konsepti.",
    credit: "Tasarım: U-LUKSSTUDYO",
    mobileSub: "Size ayrılan bir an",
  },
  en: {
    demo: "Cemre is a concept. Images are illustrative and the appointment flow is a demo.",
    nav: ["Treatments", "Before & after", "The space"],
    cta: "Request an appointment",
    skip: "Skip to content",
    hero: "A little renewal for your skin and your style, in the heart of Bodrum",
    intro: "Time for yourself. A simpler way to feel good.",
    sub: "A calm, Aegean-inspired space for hair, skin and care rituals.",
    caption: "Generated concept image of the proposed salon atmosphere.",
    servicesTitle: "Find your kind of care.",
    servicesText: "From your hair to your skin, a care plan shaped around you.",
    services: [
      {
        title: "Skin care",
        description:
          "An approach that begins with understanding your skin and your daily routine.",
        items: [
          "Skin consultation",
          "Hydration-focused care",
          "Personal care planning",
        ],
        icon: "face",
      },
      {
        title: "Hair design & care",
        description:
          "Cuts that work with your natural texture, soft movement and considered finishes.",
        items: ["Cut & styling", "Blow-dry & hair care", "Colour consultation"],
        icon: "hair",
      },
      {
        title: "Mediterranean wellness",
        description:
          "A pause in your day. Care rituals to slow down and make time for yourself.",
        items: [
          "Scalp care ritual",
          "Hand & nail care",
          "Relaxation-focused care",
        ],
        icon: "sun",
      },
    ],
    select: "Choose this treatment",
    conceptMenu: "Illustrative treatment menu · Scope and prices: TO CONFIRM",
    compareTitle: "A different finish. Still you.",
    compareText:
      "From natural volume to a smooth, glossy finish. Drag the line to compare.",
    before: "Before",
    after: "After",
    compareLabel: "Compare before and after images",
    compareNote:
      "An illustrative, AI-generated comparison. Not a real client or treatment result.",
    bookingTitle: "A little time, just for you.",
    bookingText:
      "Choose your care and add your preferences. We’ll prepare your appointment request as a Turkish WhatsApp message.",
    steps: ["Treatment", "Specialist", "Date & details"],
    serviceLegend: "What care do you have in mind?",
    expertLegend: "Do you have a specialist preference?",
    noPreference: "No preference",
    noPreferenceText: "I would like the salon to guide me.",
    expertOption: "I would like to name a specialist",
    expertLabel: "Specialist preference (optional)",
    expertPlaceholder: "Your preferred specialist",
    expertNote:
      "There is no real team list in this concept. You can add a preference as a note.",
    date: "Preferred date",
    time: "Preferred time",
    name: "Full name",
    phone: "Phone number",
    note: "Your note (optional)",
    notePlaceholder: "Anything you would like to share about your appointment?",
    availability:
      "These are preferences, not live availability. The salon must confirm the date, time and price.",
    privacy:
      "I understand that my details will appear in the demo message. I am not sharing health information.",
    next: "Continue",
    back: "Back",
    prepare: "Prepare WhatsApp message",
    preview: "Your message is ready — not sent yet.",
    demoNotice:
      "A dummy number is in use. WhatsApp sending is disabled and no booking is created. Do not enter real personal information.",
    copy: "Copy message",
    copied: "Message copied.",
    copyFail:
      "Clipboard is unavailable. You can select and copy the message below.",
    edit: "Edit details",
    messageLabel: "Turkish WhatsApp message preview",
    noJs: "JavaScript is required for this demo flow. A real WhatsApp number has not been added.",
    locationTitle: "A pause, at the pace of the Aegean.",
    locationText:
      "Natural light, simple materials and a sea-inspired atmosphere. This is the space we imagine for Cemre.",
    location: "Bodrum, Muğla",
    address: "Street address and directions: TO CONFIRM",
    hours: "Opening hours: TO CONFIRM",
    mapNote: "Area map · No salon location has been selected.",
    mapLink: "View Bodrum on the map",
    legal: "Information & privacy",
    legalItems: [
      [
        "Client privacy",
        "TO CONFIRM — Data controller, purposes, retention and contact details require real business information. This demo does not save any details to a server.",
      ],
      [
        "Appointments & cancellation",
        "TO CONFIRM — Prices, duration, availability and cancellation terms need confirmation. A WhatsApp request is not a confirmed appointment.",
      ],
      [
        "Before your treatment",
        "TO CONFIRM — Treatment scope and suitability must be assessed by the qualified team. This page offers no medical diagnosis, treatment or guaranteed results.",
      ],
    ],
    footer: "A hair & beauty concept for Bodrum.",
    credit: "Design: U-LUKSSTUDYO",
    mobileSub: "A moment for yourself",
  },
};
