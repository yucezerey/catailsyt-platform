# CatAIlyst — Yapay Zekâ Hazırlık Platformu

Yapay zekâ hazırlığını kendini nasıl gördüğüne değil, gerçekte ne bildiğine ve ne yaptığına bakarak ölçen değerlendirme uygulaması.

## Ayrışma noktası

Piyasadaki hazırlık araçlarının neredeyse tamamı öz-bildirime dayanıyor: kişiye "yapay zekâyı ne kadar iyi biliyorsun" diye soruyor ve cevabı skor sayıyor. Ölçtükleri şey yetkinlik değil, özgüven.

Würzburg Üniversitesi'nin 2025'te 514 kişiyle yaptığı çalışmada nesnel bilgi testi ile öznel öz-değerlendirme arasındaki korelasyon **r = .02** çıktı. İstatistiksel olarak sıfır.

CatAIlyst ikisini birden ölçer ve aradaki açıklığı **fark skoru** olarak raporlar. Dört profil üretir: aşırı güven, yetersiz güven, kalibre yetkin, kalibre acemi. Kurum açısından en riskli grup aşırı güven grubudur — hatayı fark etmez, eğitimi gereksiz görür.

## Akış

```
/                 Satış sayfası
/olcum            Ölçüm akışı (odak modu, tek soru tek ekran)
  ├─ hazırlık     Mod, paket, rıza kapısı
  ├─ ısınma       Skora girmeyen kolay açılış — terk edişin %31'i ilk soruda
  ├─ bağlam       Rol · sektör · büyüklük · kıdem
  ├─ sorular      Klavye destekli, otomatik kayıtlı
  └─ öz-değ.      3 soru, en sonda — önce sorulsa test cevaplarını etkilerdi
/rapor            Skor, radar, fark skoru, çerçeve uyumu, yol haritası
```

## Teknik

- Next.js 16 (App Router) + React 19 + TypeScript strict
- Tailwind CSS 4, CSS değişkenlerine dayalı tasarım sistemi (açık/koyu/sistem teması)
- Grafik bağımlılığı yok — radar ve ölçüler kendi SVG bileşenlerimiz
- Erişilebilirlik: native `fieldset` + `radio` (ok tuşları ve ARIA tarayıcıdan gelir), `:focus-visible` halkası, `prefers-reduced-motion`
- Veri istemcide kalır: cevaplar `localStorage`'a yazılır, sunucuya gönderilmez
- PDF (jsPDF, gömülü DejaVu ile tam Türkçe) ve DOCX çıktısı tek rapor modelinden üretilir

## Klasör düzeni

```
app/            Rotalar (landing, ölçüm, rapor)
components/
  ui/           Buton, kart, etiket, ölçü çubuğu, tema anahtarı
  olcum/        Soru kartı, ilerleme rayı, adımlar, akış makinesi
  rapor/        Rapor görünümü, radar, fark matrisi
lib/
  soru-bankasi  74 maddelik havuz (bireysel + kurumsal)
  sorular       Paketler, dairesel rotasyon, bağlam ve öz-değerlendirme
  skorlama      Boyut → çerçeve → seviye → fark skoru
  rapor         Tek rapor modeli (ekran, PDF ve DOCX aynı kaynaktan)
  disa-aktar/   PDF ve DOCX üreticileri
test/           Skorlama ve rotasyon testleri
```

## Komutlar

```bash
npm run dev        # geliştirme
npm run test       # skorlama ve rotasyon testleri
npm run dogrula    # lint + tip kontrolü + test + derleme
npm run build      # üretim derlemesi
```

## Sınırlar

Bu bir sertifikasyon aracı değil. Öz-bildirim maddeleri kişinin beyanına dayanır, doğrulanmaz. Sonuç ölçüm anındaki cevapları yansıtır ve doğru-yanlış değil olgunluk seviyesi gösterir. Raporun sonunda bu sınırlar okuyucuya da yazılır.
