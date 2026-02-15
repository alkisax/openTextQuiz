import MultipleChoiceQuestion from "@/languageTest/components/test-parts/MultipleChoiceQuestion";
import type { GeoQuestion } from "../types/geographyFull.types";

type Props = {
  question: GeoQuestion;
  value?: string;
  onChange: (id: string, value: string) => void;
};

const GeographyFullQuestion = ({ question, value, onChange }: Props) => {
  return (
    <div className="space-y-4 border p-4 rounded">
      <MultipleChoiceQuestion
        question={question}
        value={value}
        onChange={(val) => onChange(question.id, val)}
      />
    </div>
  );
};

export default GeographyFullQuestion;
