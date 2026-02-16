import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { GeoGradedAnswer, GeoAnswer } from "../types/geographyFull.types";

type Props = {
  gradedAnswers: GeoGradedAnswer[];
};

const formatAnswer = (answer: GeoAnswer | undefined): string => {
  if (!answer) return "—";

  if (Array.isArray(answer)) {
    return answer.join(" / ");
  }

  if (typeof answer === "object") {
    return Object.entries(answer)
      .map(([key, value]) => `${key}-${value}`)
      .join(", ");
  }

  return answer;
};

const GeographyFullGradingSummary = ({ gradedAnswers }: Props) => {
  const total = gradedAnswers.length;
  const correctCount = gradedAnswers.filter((a) => a.correct).length;

  return (
    <Card className="mt-4">
      <CardContent>
        <h3 className="mb-2 text-lg font-semibold">Αξιολόγηση</h3>

        <div className="mb-3">
          <Badge className="bg-primary text-primary-foreground">
            Σωστά: {correctCount} / {total}
          </Badge>
        </div>

        <ul className="space-y-2">
          {gradedAnswers.map((a, i) => (
            <li key={a.id} className="rounded-md border p-2">
              <p className="text-sm font-medium">
                {i + 1}. {formatAnswer(a.userAnswer)} →{" "}
                {formatAnswer(a.correctAnswer as GeoAnswer)}
              </p>

              <Badge
                className={
                  a.correct
                    ? "bg-primary text-primary-foreground"
                    : "bg-destructive text-white"
                }
              >
                {a.correct
                  ? a.hasSpellingErrors
                    ? "σωστό (ορθογραφικό)"
                    : "σωστό"
                  : "λάθος"}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default GeographyFullGradingSummary;