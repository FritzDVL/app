"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CommunityRulesProps {
  rules?: string[];
  className?: string;
}

// Default rules that apply to all communities
const DEFAULT_RULES = [
  "Be respectful and constructive",
  "No spam ",
  "Share resources and help others learn",
  "Use appropriate tags for your posts",
  "Follow community guidelines and stay on topic",
  "Help maintain a welcoming environment for all members",
];

export function CommunityRules({ rules = DEFAULT_RULES, className = "" }: CommunityRulesProps) {
  return (
    <Card className={`motion-preset-fade-in gradient-card border border-brand-200/50 ${className}`}>
      <CardHeader>
        <h3 className="text-lg font-semibold">Community Rules</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {rules.length > 0 ? (
          rules.map((rule, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="mt-0.5 text-sm font-bold text-brand-500">{index + 1}.</span>
              <span className="text-sm text-gray-600">{rule}</span>
            </div>
          ))
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-500">No rules defined</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
