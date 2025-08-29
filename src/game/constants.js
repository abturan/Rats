export const CHARACTERS = [
  { id: 'rex', name: 'Kaptan Rex ‘Paslı’ Kanca', maxHp: 8, maxStress: 6, passive: 'Liderlik: İlk tur +1 AP', tags: ['melee'] },
  { id: 'ilsa', name: 'Dr. Ilsa ‘Sızıntı’ Von Klemp', maxHp: 6, maxStress: 7, passive: 'Analiz: ‘İncele’ +2', tags: ['science'] },
  { id: 'kev', name: '“Kablocu” Kev', maxHp: 7, maxStress: 6, passive: 'Tamirci: ‘Etkileşim (Mühendislik)’ +2, %15 patlama riski', tags: ['engineer'] },
  { id: 'shiv', name: 'Shiv ‘Sessiz’ Ramirez', maxHp: 9, maxStress: 5, passive: 'Kaba Kuvvet: Yakın dövüş +1', tags: ['brute'] },
];

export const ITEM_DECK_BASE = [
  { id: 'crowbar', name: 'Paslı Levye', type: 'weapon', text: '+2 Yakın Dövüş bu tur.', uses: 0 },
  { id: 'firstaid', name: 'Süresi Dolmuş İlk Yardım', type: 'heal', text: '+2 Can (tek kullanımlık)', uses: 1 },
  { id: 'emp', name: 'EMP Bombası', type: 'emp', text: 'Tüm minyonları -1, Teknolojik Beslenme -1', uses: 1 },
  { id: 'fixkit', name: 'İmprovize Tamir Kiti', type: 'tool', text: 'Etkileşim (Mühendislik) +3 (2 kullanım)', uses: 2 },
  { id: 'mystery', name: 'Gizemli Uzaylı Düğmesi', type: 'chaos', text: '%50 iyi, %50 felaket.', uses: 1 },
  { id: 'flare', name: 'Acil Feneri', type: 'utility', text: 'Bu tur ‘Gafil Avlanma’ yok.', uses: 1 },
];

export const LOCATION_POOL = [
  {
    id: 'reactor',
    name: 'Sızdıran Reaktör Koridoru',
    trash: { bio: 0, tech: 2, chem: 2, occult: 0 },
    objective: {
      key: 'fix-reactor',
      title: 'Reaktörü Yamala (2 adım)',
      steps: 2,
      skill: 'mühendislik',
      dc: 12,
      desc: 'Enerji kaçağını durdur, ardından ana vanayı mühürle.',
    },
    note: 'Dar ve sıcak. Kimyasal sızıntı kokuyor.',
  },
  { id: 'mushroom', name: 'Mutant Mantar Mağarası', trash: { bio: 3, tech: 0, chem: 1, occult: 1 }, note: 'Sporlar stres yaratabilir.' },
  { id: 'hangar', name: 'Terk Edilmiş Bakım Hangarı', trash: { bio: 0, tech: 3, chem: 0, occult: 0 }, note: 'Hurda robotlarla dolu.' },
  { id: 'chapel', name: 'Yasaklı Şapel Bölmesi', trash: { bio: 0, tech: 0, chem: 0, occult: 3 }, note: 'Fısıltılar duyuluyor…' },
  { id: 'shaft', name: 'Servis Şaftı ve Kanalizasyon', trash: { bio: 2, tech: 1, chem: 0, occult: 0 }, note: 'Dar tüneller, kaygan zemin.' },
];

export const REACTIONS = [
  { id: 'lash', name: 'Saldırı', effect: 'hp-1', text: 'KÇC saldırır: -1 Can.' },
  { id: 'acid', name: 'Asit Sıçraması', effect: 'chem-hit', text: 'Asidik sıçrama: -1 Can (Kimyasal).' },
  { id: 'scream', name: 'Psşik Çığlık', effect: 'stress+1', text: 'Kafan zonkluyor: +1 Stres.' },
  { id: 'emp', name: 'EMP Patlaması', effect: 'emp-burst', text: 'Sistemler cızırdıyor: -1 AP bu tur.' },
  { id: 'spawn', name: 'Çöp Minyonları!', effect: 'spawn', text: 'Minyon sayısı +1.' },
];
