import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      quizTitle = "Statistical Competency Evaluation",
      score = 80,
      totalQuestions = 10,
      correctCount = 8,
      missedQuestions = [],
      competencyName = "Statistical Methods & Survey Sampling",
    } = body;

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey) {
      try {
        const prompt = `You are a pedagogical assessment evaluation engine for India's Official Statistical System (MoSPI / State Directorates of Economics & Statistics) aligned with the iGOT Karmayogi civil service framework.
An officer just completed the assessment "${quizTitle}" for competency "${competencyName}".
Result: ${score}% (${correctCount} of ${totalQuestions} correct).
Missed question topics / concepts: ${JSON.stringify(missedQuestions)}.

Provide an official competency evaluation dossier in JSON with the exact fields:
{
  "strengths": "1-2 concise professional sentences detailing demonstrated core strengths in this domain.",
  "areasToImprove": "1-2 concise professional sentences identifying remediation targets based on missed concepts.",
  "recommendedAction": "1 concise sentence recommending next pedagogical steps on iGOT Karmayogi.",
  "prescribedModule": "KRM-MOSPI-2024-ST02: Applied Survey Sampling & Microdata Verification",
  "prescribedDuration": "4.5 Hours • Self-Paced"
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const parsed = JSON.parse(candidateText);
            if (parsed.strengths && parsed.areasToImprove) {
              return NextResponse.json({
                success: true,
                source: "gemini-ai",
                feedback: parsed,
              });
            }
          }
        }
      } catch (geminiError) {
        console.warn("Gemini feedback API call failed or timed out, falling back to curriculum engine:", geminiError);
      }
    }

    // High quality pedagogical fallback grounded in official MoSPI cadre taxonomy
    let strengths = `Strong demonstrated understanding of ${competencyName} core mechanics, finite population correction factors, and sample size allocation formulas across heterogenous survey districts.`;
    let areasToImprove = `Questions regarding cold-deck non-response imputation methods and multi-stage cluster variance estimation routines were missed, indicating conceptual uncertainty in large microdata scenarios.`;
    let recommendedAction = `Complete the prescribed iGOT Karmayogi module on survey microdata verification to satisfy APAR statutory requirements.`;
    let prescribedModule = "KRM-MOSPI-2024-ST02: Applied Survey Sampling & Microdata Verification";
    let prescribedDuration = "4.5 Hours • Self-Paced";

    if (score >= 90) {
      strengths = `Exemplary mastery of ${competencyName}. Demonstrated flawless interpretation of complex multi-stage sampling weights and official NSS design multiplier protocols.`;
      areasToImprove = `Maintain continuity by mentoring junior statistical inspectors and participating in state-level master trainer workshops.`;
      recommendedAction = `Eligible for advanced supervisory cadre certifications under the Mission Karmayogi executive track.`;
      prescribedModule = "KRM-MOSPI-2024-ST03: Advanced Sampling Designs & Weight Computation";
      prescribedDuration = "6.0 Hours • Self-Paced";
    } else if (score < 60) {
      strengths = `Basic familiarity with fundamental survey terminology and administrative hierarchy definitions.`;
      areasToImprove = `Significant gaps detected in probability sampling selection formulas, Horvitz-Thompson estimation, and standard error linearizations under clustering.`;
      recommendedAction = `Immediate remediation required via foundational NSSTA coursework before next statutory review cycle.`;
      prescribedModule = "KRM-MOSPI-2024-ST01: Foundations of Statistical Data Analysis";
      prescribedDuration = "4.0 Hours • Self-Paced";
    }

    return NextResponse.json({
      success: true,
      source: "pedagogical-rules-engine",
      feedback: {
        strengths,
        areasToImprove,
        recommendedAction,
        prescribedModule,
        prescribedDuration,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate feedback";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
