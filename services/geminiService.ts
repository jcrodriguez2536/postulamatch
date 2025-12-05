import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, FileAttachment, MarketTrends, UserProfile, RedFlagsAnalysis, InterviewSimulation, SeniorFeedback, SalaryNegotiation, JobTranslation } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// --- SCHEMAS ---

// 1. Core Analysis Schema (Profile, Verdict, Matrix, Analyses, Final Eval)
const coreAnalysisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        userProfile: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "Nombre completo extraído o inferido del CV." },
                currentRole: { type: Type.STRING, description: "Rol actual o más reciente." },
                yearsExperience: { type: Type.STRING, description: "Años de experiencia estimados." },
                topSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Las 5 habilidades técnicas más fuertes del candidato." }
            },
            required: ["name", "currentRole", "yearsExperience", "topSkills"]
        },
        verdict: { type: Type.STRING, enum: ["APTO", "NO APTO"] },
        verdictExplanation: { type: Type.STRING, description: "Explicación clara del veredicto." },
        vacancyAnalysis: { type: Type.STRING, description: "Análisis completo de la vacante." },
        candidateAnalysis: { type: Type.STRING, description: "Análisis completo del candidato." },
        comparisonMatrix: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    criteria: { type: Type.STRING },
                    requirement: { type: Type.STRING },
                    candidateMatch: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ["Match", "Gap", "Partial"] },
                },
                required: ["criteria", "requirement", "candidateMatch", "status"],
            },
        },
        finalEvaluation: {
            type: Type.OBJECT,
            properties: {
                caseStudy: { type: Type.STRING, description: "Caso práctico complejo." },
                questions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            question: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ["MultipleChoice", "TrueFalse", "ShortAnswer"] },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswer: { type: Type.STRING },
                        },
                        required: ["question", "type", "correctAnswer"]
                    },
                    description: "25 preguntas mixtas."
                },
                feedbackReport: { type: Type.STRING, description: "Informe breve de competencias." }
            },
            required: ["caseStudy", "questions", "feedbackReport"]
        },
        tutorInstructions: { type: Type.STRING, description: "Instrucciones de persona para el Chatbot." },
        accessibilityStatement: { type: Type.STRING, description: "Declaración accesibilidad." }
    },
    required: [
        "userProfile",
        "verdict",
        "verdictExplanation",
        "comparisonMatrix",
        "vacancyAnalysis",
        "candidateAnalysis",
        "finalEvaluation",
        "tutorInstructions",
        "accessibilityStatement"
    ],
};

// 2. Study Path Schema (Dedicated for the 15-week generation)
const studyPathSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        studyPath: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    weekNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    estimatedHours: { type: Type.STRING, description: "Estimación de horas de estudio requeridas (Ej: '10-12 horas')." },
                    theory: { type: Type.STRING, description: "Explicación técnica profunda y sustanciosa. Enfócate en arquitectura interna, 'under-the-hood', patrones de diseño avanzados y trade-offs. NO introducciones básicas." },
                    podcastScript: {
                        type: Type.STRING,
                        description: "Guion breve de diálogo (Max 150 palabras). Host A (Experto) y Host B (Curioso)."
                    },
                    podcastSummary: {
                        type: Type.STRING,
                        description: "Resumen muy conciso (bullet points) del tema."
                    },
                    resources: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ["Reading", "Document", "Video"] },
                                link: { type: Type.STRING, description: "IMPORTANTE: No inventes URLs. Escribe un TÉRMINO DE BÚSQUEDA preciso. Ej: 'React Advanced Patterns 2024 pdf', 'Clean Architecture course free'." },
                                description: { type: Type.STRING, description: "Descripción corta." },
                            },
                            required: ["title", "type", "link", "description"]
                        },
                        description: "Los 3 recursos más críticos."
                    },
                    assessments: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ["Conceptual", "Practical", "Challenge"] },
                                questions: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            id: { type: Type.STRING },
                                            question: { type: Type.STRING },
                                            type: { type: Type.STRING, enum: ["MultipleChoice", "TrueFalse", "ShortAnswer"] },
                                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                            correctAnswer: { type: Type.STRING },
                                        },
                                        required: ["question", "type", "correctAnswer"]
                                    },
                                    description: "3 preguntas clave por evaluación."
                                }
                            },
                            required: ["title", "type", "questions"]
                        },
                        description: "OBLIGATORIO: Exactamente 3 evaluaciones distintas por semana."
                    },
                },
                required: ["weekNumber", "title", "estimatedHours", "theory", "podcastScript", "podcastSummary", "resources", "assessments"],
            },
            description: "Generar ruta de EXACTAMENTE 15 semanas."
        }
    },
    required: ["studyPath"]
};

// Other Schemas (Market, Salary, etc.) remain unchanged
const marketTrendsSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        marketGaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Brechas reales del mercado en los próximos 12 meses." },
        growingTech: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tecnologías o habilidades en crecimiento." },
        decliningTech: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tecnologías o habilidades perdiendo demanda." },
        emergingRoles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Roles emergentes relacionados." },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recomendaciones claras y accionables." }
    },
    required: ["marketGaps", "growingTech", "decliningTech", "emergingRoles", "recommendations"]
};

const salarySchema: Schema = {
    type: Type.OBJECT,
    properties: {
        initialOffer: { type: Type.STRING, description: "La oferta inicial (números realistas) y paquete de beneficios." },
        recruiterExcuse: { type: Type.STRING, description: "La excusa típica del reclutador (ej: 'Tope de banda', 'Equidad')." },
        lowballRisks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Riesgos de aceptar esta oferta sin negociar." },
        negotiationStrategy: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    objection: { type: Type.STRING, description: "Objeción potencial del reclutador." },
                    counterScript: { type: Type.STRING, description: "Guion exacto de qué responder (Counter-Offer)." }
                },
                required: ["objection", "counterScript"]
            }
        },
        closingTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Consejos finales para cerrar el trato." }
    },
    required: ["initialOffer", "recruiterExcuse", "lowballRisks", "negotiationStrategy", "closingTips"]
};

const redFlagsSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        redFlags: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ["High", "Medium"] }
                },
                required: ["title", "description", "severity"]
            },
            description: "Lista de banderas rojas detectadas (explotación, ambigüedad, salario bajo, etc)."
        },
        risks: { type: Type.STRING, description: "Riesgos a corto y largo plazo (Markdown)." },
        questionsToAsk: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Preguntas incisivas para hacer en la entrevista y detectar toxicidad." },
        alternatives: { type: Type.STRING, description: "Sugerencias o ajustes para mitigar estos riesgos (Markdown)." }
    },
    required: ["redFlags", "risks", "questionsToAsk", "alternatives"]
};

const interviewSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        introduction: { type: Type.STRING, description: "Breve introducción preparando al candidato para una sesión difícil." },
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING, description: "La pregunta difícil o tramposa." },
                    category: { type: Type.STRING, enum: ["Challenge", "Trick", "Pressure", "Culture"] },
                    intent: { type: Type.STRING, description: "La verdadera intención detrás de la pregunta (qué busca el reclutador)." },
                    guide: { type: Type.STRING, description: "Guía paso a paso de cómo responder correctamente sin caer en la trampa." }
                },
                required: ["question", "category", "intent", "guide"]
            },
            description: "Generar mínimo 8 preguntas variadas y de alto nivel."
        },
        generalTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Consejos generales de lenguaje corporal y tono para entrevistas de presión." }
    },
    required: ["introduction", "questions", "generalTips"]
};

const seniorFeedbackSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        realityCheck: { type: Type.STRING, description: "Un análisis brutalmente honesto (texto plano/markdown) sobre dónde está parado el profesional realmente." },
        doingWell: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Aspectos positivos técnicos o de soft skills." },
        doingPoorly: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Aspectos donde está fallando gravemente según estándares Senior." },
        stopDoingImmediately: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Hábitos, tecnologías o actitudes que debe abandonar YA." },
        priorities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lo que debe priorizar para crecer rápido (Principio de Pareto)." },
        marketTrends: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tendencias de mercado específicas para su perfil." },
        improvementPlan: { type: Type.STRING, description: "Plan de mejora conciso y directo (Markdown)." }
    },
    required: ["realityCheck", "doingWell", "doingPoorly", "stopDoingImmediately", "priorities", "marketTrends", "improvementPlan"]
};

const jobTranslationSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        ambiguities: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    quote: { type: Type.STRING, description: "La frase ambigua o exagerada de la vacante." },
                    explanation: { type: Type.STRING, description: "Qué significa realmente." }
                },
                required: ["quote", "explanation"]
            }
        },
        dictionary: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    jargon: { type: Type.STRING, description: "Término corporativo (Ej: 'Salario competitivo', 'Ambiente dinámico')." },
                    reality: { type: Type.STRING, description: "Traducción honesta/irónica." }
                },
                required: ["jargon", "reality"]
            }
        },
        hiddenSignals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Señales ocultas de cultura tóxica o sobrecarga." },
        responsibilities: {
            type: Type.OBJECT,
            properties: {
                real: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lo que realmente vas a hacer." },
                smoke: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Responsabilidades de relleno o marketing." }
            },
            required: ["real", "smoke"]
        },
        honestVersion: { type: Type.STRING, description: "Una versión reescrita de la vacante, corta y honesta (Markdown)." }
    },
    required: ["ambiguities", "dictionary", "hiddenSignals", "responsibilities", "honestVersion"]
};

// --- MAIN GENERATION FUNCTIONS ---

export const generateAnalysis = async (resumeFile: FileAttachment, jobFile: FileAttachment): Promise<AnalysisResult> => {
    // Common parts for both requests
    const commonParts = [
        { text: "\n--- VACANTE ---\n" },
        {
            inlineData: {
                mimeType: jobFile.mimeType,
                data: jobFile.data
            }
        },
        { text: "\n--- CANDIDATO (CV) ---\n" },
        {
            inlineData: {
                mimeType: resumeFile.mimeType,
                data: resumeFile.data
            }
        }
    ];

    // 1. Core Analysis Prompt (Strategy, Verdict, Profile)
    const corePrompt = `
    Analiza CV vs Vacante.
    
    Genera:
    1. Perfil del usuario (Skills, Experiencia).
    2. Veredicto (APTO/NO APTO) y Explicación.
    3. Análisis detallado de vacante y candidato.
    4. Matriz Comparativa.
    5. Evaluación Final (Caso de estudio + 25 preguntas).
    6. Instrucciones del Tutor y Accesibilidad.

    NOTA: NO generes la ruta de estudio aquí.
    OUTPUT: JSON estricto (Core Schema). Español.
  `;

    // 2. Study Path Prompt (Content Generation)
    const pathPrompt = `
    Genera SOLAMENTE la Ruta de Estudio de 15 SEMANAS basada en el CV y Vacante.
    Enfócate en cerrar las brechas y profundizar en los requisitos.
    
    REGLAS ESTRICTAS:
    - 15 Semanas EXACTAS.
    - Teoría: ALTA DENSIDAD TÉCNICA (Markdown). Arquitectura, patrones, under-the-hood.
    - Podcast: Guion breve (~150 palabras) y Resumen.
    - Recursos: Top 3 términos de búsqueda precisos.
    - Evaluaciones: 3 por semana (Conceptual, Práctica, Desafío).
    
    PRIORIDAD: Estructura completa y densidad técnica.
    OUTPUT: JSON estricto (Study Path Schema). Español.
  `;

    try {
        // PARALLEL EXECUTION
        const [coreResponse, pathResponse] = await Promise.all([
            ai.models.generateContent({
                model: "gemini-2.0-flash-exp",
                contents: { role: "user", parts: [{ text: corePrompt }, ...commonParts] },
                config: { responseMimeType: "application/json", responseSchema: coreAnalysisSchema }
            }),
            ai.models.generateContent({
                model: "gemini-2.0-flash-exp",
                contents: { role: "user", parts: [{ text: pathPrompt }, ...commonParts] },
                config: { responseMimeType: "application/json", responseSchema: studyPathSchema }
            })
        ]);

        if (coreResponse.text && pathResponse.text) {
            const coreData = JSON.parse(coreResponse.text);
            const pathData = JSON.parse(pathResponse.text);

            // Merge results
            return {
                ...coreData,
                studyPath: pathData.studyPath
            } as AnalysisResult;
        }
        throw new Error("One or both analysis parts failed to generate text");
    } catch (error) {
        console.error("Analysis failed:", error);
        throw error;
    }
};

export const generateMarketTrends = async (userProfile: UserProfile): Promise<MarketTrends> => {
    const promptText = `
        Analista de Tendencias Laborales.
        
        Perfil: ${userProfile.currentRole}, Skills: ${userProfile.topSkills.join(", ")}.
        
        Analiza: Brechas a 12 meses, tech en auge/declive, roles emergentes y recomendaciones.
        JSON estricto. Español.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: { role: "user", parts: [{ text: promptText }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: marketTrendsSchema,
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as MarketTrends;
        }
        throw new Error("Failed to generate trends");
    } catch (error) {
        console.error("Trends generation failed:", error);
        throw error;
    }
};

export const generateSalaryNegotiation = async (resumeFile: FileAttachment, jobFile: FileAttachment): Promise<SalaryNegotiation> => {
    const promptText = `
        Simulador de Negociación (Recruiter Persona).
        Basado en los docs adjuntos, genera: Oferta inicial baja, excusa del reclutador, riesgos y estrategias de contraoferta.
        JSON estricto. Español.
    `;

    const parts = [
        { text: promptText },
        { text: "\n--- VACANTE ---\n" },
        {
            inlineData: {
                mimeType: jobFile.mimeType,
                data: jobFile.data
            }
        },
        { text: "\n--- CANDIDATO (CV) ---\n" },
        {
            inlineData: {
                mimeType: resumeFile.mimeType,
                data: resumeFile.data
            }
        }
    ];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: { role: "user", parts: parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: salarySchema,
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as SalaryNegotiation;
        }
        throw new Error("Failed to generate salary negotiation");
    } catch (error) {
        console.error("Salary negotiation failed:", error);
        throw error;
    }
};

export const generateRedFlagsAnalysis = async (jobFile: FileAttachment): Promise<RedFlagsAnalysis> => {
    const promptText = `
        Auditoría HR de Toxicidad.
        Analiza la vacante adjunta. Detecta Red Flags (explotación, salario, cultura).
        JSON estricto. Español.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: {
                role: "user",
                parts: [
                    { text: promptText },
                    {
                        inlineData: {
                            mimeType: jobFile.mimeType,
                            data: jobFile.data
                        }
                    }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: redFlagsSchema,
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as RedFlagsAnalysis;
        }
        throw new Error("Failed to generate Red Flags analysis");
    } catch (error) {
        console.error("Red Flags analysis failed:", error);
        throw error;
    }
};

export const generateInterviewSimulation = async (resumeFile: FileAttachment, jobFile: FileAttachment): Promise<InterviewSimulation> => {
    const promptText = `
        Entrevistador Bar Raiser (High Pressure).
        Genera preguntas de desafío, trampa, presión y cultura basadas en los documentos. Incluye intención y guía.
        JSON estricto. Español.
    `;

    const parts = [
        { text: promptText },
        { text: "\n--- VACANTE ---\n" },
        {
            inlineData: {
                mimeType: jobFile.mimeType,
                data: jobFile.data
            }
        },
        { text: "\n--- CANDIDATO (CV) ---\n" },
        {
            inlineData: {
                mimeType: resumeFile.mimeType,
                data: resumeFile.data
            }
        }
    ];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: { role: "user", parts: parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: interviewSchema,
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as InterviewSimulation;
        }
        throw new Error("Failed to generate interview simulation");
    } catch (error) {
        console.error("Interview generation failed:", error);
        throw error;
    }
};

export const generateSeniorFeedback = async (resumeFile: FileAttachment): Promise<SeniorFeedback> => {
    const promptText = `
        Mentor CTO (Brutalmente Honesto).
        Analiza el CV. Identifica errores, stack obsoleto (STOP DOING), prioridades y plan de mejora.
        JSON estricto. Español.
    `;

    const parts = [
        { text: promptText },
        { text: "\n--- CANDIDATO (CV) ---\n" },
        {
            inlineData: {
                mimeType: resumeFile.mimeType,
                data: resumeFile.data
            }
        }
    ];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: { role: "user", parts: parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: seniorFeedbackSchema,
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as SeniorFeedback;
        }
        throw new Error("Failed to generate senior feedback");
    } catch (error) {
        console.error("Senior feedback generation failed:", error);
        throw error;
    }
};

export const generateJobTranslation = async (jobFile: FileAttachment): Promise<JobTranslation> => {
    const promptText = `
        Decodificador de Vacantes.
        Traduce el lenguaje corporativo a realidad honesta. Señales ocultas, humo vs responsabilidades reales.
        JSON estricto. Español.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: {
                role: "user",
                parts: [
                    { text: promptText },
                    {
                        inlineData: {
                            mimeType: jobFile.mimeType,
                            data: jobFile.data
                        }
                    }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: jobTranslationSchema,
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as JobTranslation;
        }
        throw new Error("Failed to generate job translation");
    } catch (error) {
        console.error("Job translation failed:", error);
        throw error;
    }
};

export const createChatSession = (contextData: AnalysisResult) => {
    const systemInstruction = `
    ${contextData.tutorInstructions}
    Estudiante: ${contextData.userProfile.name}
    
    REGLA: Solo responde preguntas sobre la vacante, el CV o el plan de estudio.
    Si el tema es externo, recházalo cortésmente.
    Idioma: Español.
    `;

    return ai.chats.create({
        model: "gemini-2.0-flash-exp",
        config: {
            systemInstruction,
        }
    });
};

export const generateAudio = async (text: string): Promise<{ audio: string; text: string }> => {
    // Audio generation not available in browser - return placeholder
    return {
        audio: "",
        text: text
    };
};