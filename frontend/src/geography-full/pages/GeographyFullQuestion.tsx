import MultipleChoiceQuestion from "@/languageTest/components/test-parts/MultipleChoiceQuestion";
import type { GeoAnswer, GeoQuestion } from "../types/geographyFull.types";
import ShortTextQuestion from "../components/ShortTextQuestion";
import MatchingQuestionComponent from "../components/MatchingQuestion";
import MultiSelectQuestion from "../components/MultiSelectQuestion";
import ListInputQuestion from "../components/ListInputQuestion";

type Props = {
  question: GeoQuestion;
  value?: GeoAnswer;
  onChange: (id: string, value: GeoAnswer) => void;
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

      {question.type === "matching" && (
        <MatchingQuestionComponent
          question={question}
          value={
            value && typeof value === "object" && !Array.isArray(value)
              ? value
              : {}
          }
          onChange={(val) => onChange(question.id, val)}
        />
      )}

      {question.type === "multiSelect" && (
        <MultiSelectQuestion
          question={question}
          value={Array.isArray(value) ? value : []}
          onChange={(val) => onChange(question.id, val)}
        />
      )}

      {question.type === "listInput" && (
        <ListInputQuestion
          question={question}
          value={Array.isArray(value) ? value : []}
          onChange={(val) => onChange(question.id, val)}
        />
      )}
    </div>
  );
};

export default GeographyFullQuestion;
