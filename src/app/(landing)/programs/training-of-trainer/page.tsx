import ProgramDetail from "../_components/program-detail";

export default function TrainingOfTrainerPage() {
  return (
    <ProgramDetail
      slug="training-of-trainer"
      fallbackTitle="Training of Trainer"
      fallbackDescription="Program Training of Trainer .id Academy adalah program pengembangan calon trainer yang mampu menyampaikan materi literasi digital, domain, DNS, dan keamanan digital kepada komunitasnya."
      fallbackBenefits={[
        "Menguasai konsep literasi digital dan ekosistem domain .id.",
        "Menyusun materi pelatihan yang mudah dipahami peserta.",
        "Meningkatkan kemampuan fasilitasi dan presentasi.",
        "Mampu mengajarkan kembali materi secara mandiri.",
      ]}
    />
  );
}
