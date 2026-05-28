import ProgramDetail from "../_components/program-detail";

export default function WorkshopPage() {
  return (
    <ProgramDetail
      slug="workshop"
      fallbackTitle="Workshop"
      fallbackDescription="Program Workshop .id Academy adalah kegiatan pelatihan interaktif yang bertujuan memberikan keterampilan praktis kepada peserta dalam membangun, mengelola, dan mengoptimalkan identitas digital menggunakan nama domain .id."
      fallbackBenefits={[
        "Memahami fungsi dan pentingnya domain .id sebagai identitas digital.",
        "Membuat dan mengelola website menggunakan nama domain .id secara mandiri.",
        "Menerapkan prinsip keamanan data dalam penggunaan teknologi.",
        "Memanfaatkan layanan DNS management untuk konfigurasi domain.",
      ]}
    />
  );
}
