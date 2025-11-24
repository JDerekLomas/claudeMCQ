import { MCQData } from '@/types';

interface ParsedContent {
  beforeMCQ: string;
  mcq: MCQData | null;
  afterMCQ: string;
}

export function parseMCQBlock(content: string): ParsedContent {
  // Match the MCQ block format
  const mcqRegex = /\?mcq\s+id="([^"]+)"\s+objective="([^"]+)"\n([\s\S]*?)\?correct\s+([a-d])([\s\S]*?)(?=\n\n|$)/;
  const match = content.match(mcqRegex);

  if (!match) {
    return { beforeMCQ: content, mcq: null, afterMCQ: '' };
  }

  const [fullMatch, id, objective, questionBlock, correctAnswer, metaBlock] = match;
  const startIndex = content.indexOf(fullMatch);
  const endIndex = startIndex + fullMatch.length;

  // Parse the question and options
  const lines = questionBlock.trim().split('\n');
  const stem = lines[0];
  const options: { letter: string; text: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const optionMatch = lines[i].match(/^-\s*\(([a-d])\)\s*(.+)$/);
    if (optionMatch) {
      options.push({ letter: optionMatch[1], text: optionMatch[2] });
    }
  }

  // Parse explanation
  const explanationMatch = metaBlock.match(/\?explanation\s+(.+?)(?=\n\?|$)/);
  const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;

  // Parse misconceptions
  const misconceptions: Record<string, string> = {};
  const misconceptionRegex = /\?misconception:([a-d])\s+"([^"]+)"/g;
  let misconceptionMatch;
  while ((misconceptionMatch = misconceptionRegex.exec(metaBlock)) !== null) {
    misconceptions[misconceptionMatch[1]] = misconceptionMatch[2];
  }

  return {
    beforeMCQ: content.slice(0, startIndex).trim(),
    mcq: {
      id,
      objective,
      stem,
      options,
      correctAnswer,
      explanation,
      misconceptions: Object.keys(misconceptions).length > 0 ? misconceptions : undefined,
    },
    afterMCQ: content.slice(endIndex).trim(),
  };
}

export function hasMCQBlock(content: string): boolean {
  return content.includes('?mcq ');
}
