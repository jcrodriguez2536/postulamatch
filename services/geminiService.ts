import { AnalysisResult, FileAttachment, MarketTrends, UserProfile, RedFlagsAnalysis, InterviewSimulation, SeniorFeedback, SalaryNegotiation, JobTranslation } from "../types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const base64ToBlob = async (base64: string, mimeType: string): Promise<Blob> => {
    const res = await fetch(`data:${mimeType};base64,${base64}`);
    return await res.blob();
};

export const generateAnalysis = async (resumeFile: FileAttachment, jobFile: FileAttachment): Promise<AnalysisResult> => {
    const formData = new FormData();
    const resumeBlob = await base64ToBlob(resumeFile.data, resumeFile.mimeType);
    const jobBlob = await base64ToBlob(jobFile.data, jobFile.mimeType);

    formData.append('resume', resumeBlob, 'resume');
    formData.append('job', jobBlob, 'job');

    const response = await fetch(`${BACKEND_URL}/api/analysis`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Analysis failed');
    }

    return await response.json();
};

export const generateMarketTrends = async (userProfile: UserProfile): Promise<MarketTrends> => {
    const response = await fetch(`${BACKEND_URL}/api/market-trends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile })
    });

    if (!response.ok) {
        throw new Error('Market trends generation failed');
    }

    return await response.json();
};

export const generateSalaryNegotiation = async (resumeFile: FileAttachment, jobFile: FileAttachment): Promise<SalaryNegotiation> => {
    const formData = new FormData();
    const resumeBlob = await base64ToBlob(resumeFile.data, resumeFile.mimeType);
    const jobBlob = await base64ToBlob(jobFile.data, jobFile.mimeType);

    formData.append('resume', resumeBlob, 'resume');
    formData.append('job', jobBlob, 'job');

    const response = await fetch(`${BACKEND_URL}/api/salary-negotiation`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Salary negotiation generation failed');
    }

    return await response.json();
};

export const generateRedFlagsAnalysis = async (jobFile: FileAttachment): Promise<RedFlagsAnalysis> => {
    const formData = new FormData();
    const jobBlob = await base64ToBlob(jobFile.data, jobFile.mimeType);

    formData.append('job', jobBlob, 'job');

    const response = await fetch(`${BACKEND_URL}/api/red-flags`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Red flags analysis failed');
    }

    return await response.json();
};

export const generateInterviewSimulation = async (resumeFile: FileAttachment, jobFile: FileAttachment): Promise<InterviewSimulation> => {
    const formData = new FormData();
    const resumeBlob = await base64ToBlob(resumeFile.data, resumeFile.mimeType);
    const jobBlob = await base64ToBlob(jobFile.data, jobFile.mimeType);

    formData.append('resume', resumeBlob, 'resume');
    formData.append('job', jobBlob, 'job');

    const response = await fetch(`${BACKEND_URL}/api/interview-simulator`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Interview simulation failed');
    }

    return await response.json();
};

export const generateSeniorFeedback = async (resumeFile: FileAttachment): Promise<SeniorFeedback> => {
    const formData = new FormData();
    const resumeBlob = await base64ToBlob(resumeFile.data, resumeFile.mimeType);

    formData.append('resume', resumeBlob, 'resume');

    const response = await fetch(`${BACKEND_URL}/api/senior-feedback`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Senior feedback generation failed');
    }

    return await response.json();
};

export const generateJobTranslation = async (jobFile: FileAttachment): Promise<JobTranslation> => {
    const formData = new FormData();
    const jobBlob = await base64ToBlob(jobFile.data, jobFile.mimeType);

    formData.append('job', jobBlob, 'job');

    const response = await fetch(`${BACKEND_URL}/api/job-translation`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Job translation failed');
    }

    return await response.json();
};

export const createChatSession = (contextData: AnalysisResult) => {
    // Chat session logic needs to be adapted.
    // The frontend expects an object with `sendMessage`.
    // I can return a mock object that calls the backend.

    return {
        sendMessage: async (message: string) => {
            const response = await fetch(`${BACKEND_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context: contextData, message })
            });
            if (!response.ok) throw new Error('Chat failed');
            return await response.json(); // Expected format?
        }
    };
};

export const generateAudio = async (text: string): Promise<{ audio: string; text: string }> => {
    const response = await fetch(`${BACKEND_URL}/api/audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        throw new Error('Audio generation failed');
    }

    return await response.json();
};