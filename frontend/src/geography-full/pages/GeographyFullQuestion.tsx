import MultipleChoiceQuestion from "@/languageTest/components/test-parts/MultipleChoiceQuestion";
import type { GeoQuestion } from "../types/geographyFull.types";
import ShortTextQuestion from "../components/ShortTextQuestion";

type Props = {
  question: GeoQuestion;
  value?: string | string[];
  onChange: (id: string, value: string | string[]) => void;
};

const GeographyFullQuestion = ({ question, value, onChange }: Props) => {
  return (
    <div className="space-y-4 border p-4 rounded">
      {question.type === "multipleChoice" && (
        <MultipleChoiceQuestion
          question={question}
          value={value as string}
          onChange={(val) => onChange(question.id, val)}
        />
      )}

      {question.type === "shortText" && (
        <ShortTextQuestion
          question={question}
          value={value}
          onChange={(val) => onChange(question.id, val)}
        />
      )}
    </div>
  );
};

export default GeographyFullQuestion;
