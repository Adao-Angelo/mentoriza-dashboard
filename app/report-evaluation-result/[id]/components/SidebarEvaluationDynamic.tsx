/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Report } from "@/services/reports/Interfaces";
import { BookOpen, Brain, Target } from "lucide-react";

interface Props {
  report: Report;
  onIndicatorClick: (indicator: string) => void;
  onPointClick: (pointKey: string) => void;
  highlightedIndicator: string | undefined;
  highlightedPoint?: string;
}

export default function SidebarEvaluationDynamic({
  report,
  onIndicatorClick,
  onPointClick,
  highlightedIndicator,
  highlightedPoint,
}: Props) {
  const keyResults = report.keyResults || {};

  const indicators = [
    {
      key: "abnt",
      label: "Normas ABNT",
      icon: BookOpen,
      score: keyResults.abnt?.conformity_percentage || 0,
      color: "blue",
    },
    {
      key: "problematic",
      label: "Problemática",
      icon: Target,
      score: keyResults.problematic?.score || 0,
      color: "emerald",
    },
    {
      key: "theoretical",
      label: "Fundamentação Teórica",
      icon: BookOpen,
      score: keyResults.theoretical?.score || 0,
      color: "violet",
    },
    {
      key: "ai_detection",
      label: "Detecção de IA",
      icon: Brain,
      score: keyResults.ai_detection?.ai_percentage || 0,
      color: "amber",
    },
  ];

  return (
    <div className="relative w-96 bg-white border-r h-dvh overflow-y-auto p-6 space-y-6 no-scrollbar">
      <div className="text-center border-b pb-4">
        <div className="text-3xl font-bold text-primary">
          {report.score?.toFixed(1) || 0}
        </div>
        <div className="text-sm text-muted-foreground">Pontuação Geral</div>
      </div>

      <div className="space-y-3 border-b-2 pb-10">
        {indicators.map((ind) => {
          const isActive = highlightedIndicator === ind.key;

          return (
            <Card
              key={ind.key}
              className={`cursor-pointer rounded-[0px] transition-all shadow-none  ${isActive ? "border-primary  " : ""}`}
              onClick={() => onIndicatorClick(ind.key)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CardTitle className="text-base">{ind.label}</CardTitle>
                  </div>
                  <Badge
                    variant={
                      ind.score >= 70
                        ? "default"
                        : ind.score >= 50
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {ind.score.toFixed(1)}%
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Progress value={ind.score} className="h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {highlightedIndicator === "abnt" && keyResults.abnt && (
        <ABNTDetails
          highlightedPoint={highlightedPoint}
          abnt={keyResults.abnt}
          onPointClick={onPointClick}
        />
      )}

      {highlightedIndicator === "problematic" && keyResults.problematic && (
        <ProblematicDetails data={keyResults.problematic} />
      )}

      {highlightedIndicator === "theoretical" && keyResults.theoretical && (
        <TheoreticalDetails data={keyResults.theoretical} />
      )}

      {highlightedIndicator === "ai_detection" && keyResults.ai_detection && (
        <AIDetails data={keyResults.ai_detection} />
      )}
    </div>
  );
}

function ABNTDetails({
  abnt,
  onPointClick,
  highlightedPoint,
}: {
  abnt: any;
  onPointClick: (pointKey: string) => void;
  highlightedPoint?: string;
}) {
  const points = abnt.abnt_points || {};

  const pointList = [
    {
      key: "structure",
      label: "Estrutura",
      score: points.structure?.sub_score || 0,
    },
    {
      key: "citations",
      label: "Citações e Referências",
      score: points.citations?.sub_score || 0,
    },
    {
      key: "formatting",
      label: "Formatação e Numeração",
      score: points.formatting?.sub_score || 0,
    },
    {
      key: "tables_figures",
      label: "Tabelas e Figuras",
      score: points.tables_figures?.sub_score || 0,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {pointList.map((point) => {
          const violations = points[point.key]?.violations || [];
          const isActive = highlightedPoint === point.key;

          return (
            <Card
              key={point.key}
              className={`cursor-pointer transition-all shadow-none rounded-[0px] ${isActive ? "border-primary " : ""}`}
              onClick={() => onPointClick(point.key)}
            >
              <CardHeader className="">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{point.label}</CardTitle>
                  <Badge
                    variant={
                      point.score >= 70
                        ? "success"
                        : point.score >= 50
                          ? "warning"
                          : "error"
                    }
                  >
                    {point.score}%
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="flex items-center gap-1.5">
                    {violations.length} problema(s)
                  </span>
                  <span className="text-xs text-primary font-medium border border-primary rounded px-2 py-0.5">
                    Destacar
                  </span>
                </div>

                {violations.length > 0 && (
                  <div className="mt-3 space-y-3 text-xs border-t pt-3">
                    {violations.map((violation: any, i: number) => (
                      <div
                        key={i}
                        className="text-danger line-clamp-2 leading-tight p-1 bg-danger/5 rounded"
                      >
                        {violation.message}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ProblematicDetails({ data }: { data: any }) {
  return (
    <Card className="rounded-none shadow-none">
      <CardHeader>
        <CardTitle>Problemática - Observações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {data.observations?.map((obs: string, i: number) => (
          <div key={i} className="flex gap-2">
            <span className="text-green-500">•</span>
            <span>{obs}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TheoreticalDetails({ data }: { data: any }) {
  return (
    <Card className="rounded-none shadow-none">
      <CardHeader>
        <CardTitle>Fundamentação Teórica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {data.observations?.map((obs: string, i: number) => (
          <div key={i} className="flex gap-2">
            <span className="text-amber-500">•</span>
            <span>{obs}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AIDetails({ data }: { data: any }) {
  return (
    <Card className="rounded-none shadow-none">
      <CardHeader>
        <CardTitle>Detecção de IA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Conteúdo gerado por IA:</span>
          <span className="font-bold">{data.ai_percentage.toFixed(1)}%</span>
        </div>
        <Progress value={data.ai_percentage} className="h-3" />
        {data.is_ai_generated && (
          <Badge variant="destructive">Possível conteúdo gerado por IA</Badge>
        )}
      </CardContent>
    </Card>
  );
}
